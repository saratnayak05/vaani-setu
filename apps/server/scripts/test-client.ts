import { WebSocket } from 'ws';

const BASE_URL = process.env['SERVER_URL'] || 'http://localhost:3001';
const WS_URL = process.env['WS_URL'] || 'ws://localhost:3001';

console.log('----------------------------------------------------');
console.log('🧪 Starting Vaani-Setu Backend Automated Test Suite');
console.log(`Target: ${BASE_URL} (WS: ${WS_URL})`);
console.log('----------------------------------------------------');

async function testHealth(): Promise<boolean> {
  console.log('\n[1/3] Testing GET /health endpoint...');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) {
      console.error(`❌ Health check failed with status ${res.status}`);
      return false;
    }
    const data = await res.json();
    console.log('✅ Health check passed:', JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('❌ Could not connect to backend server. Is it running?');
    console.error(`   Error: ${(err as Error).message}`);
    return false;
  }
}

async function testHttpTranslate(): Promise<boolean> {
  console.log('\n[2/3] Testing POST /api/translate endpoint...');
  try {
    const res = await fetch(`${BASE_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Where is the bus stand?',
        sourceLanguage: 'en-IN',
        targetLanguage: 'hi-IN',
      }),
    });

    if (!res.ok) {
      console.error(`❌ HTTP Translate failed with status: ${res.status}`);
      const errText = await res.text();
      console.error(`   Details: ${errText}`);
      return false;
    }

    const data = (await res.json()) as {
      sourceText: string;
      translatedText: string;
      audioBase64: string;
      mimeType: string;
      latency: Record<string, number>;
    };

    console.log('✅ HTTP Translate response received:');
    console.log(`   Source: "${data.sourceText}"`);
    console.log(`   Translation: "${data.translatedText}"`);
    console.log(`   Audio bytes: ${data.audioBase64 ? Buffer.from(data.audioBase64, 'base64').length : 0} bytes (${data.mimeType})`);
    console.log(`   Latency:`, data.latency);
    return true;
  } catch (err) {
    console.error('❌ HTTP Translate error:', (err as Error).message);
    return false;
  }
}

function testWebSocket(): Promise<boolean> {
  console.log('\n[3/3] Testing WebSocket pipeline (ws://)...');
  return new Promise((resolve) => {
    let ws: WebSocket;
    const timeout = setTimeout(() => {
      console.error('❌ WebSocket test timed out after 10s');
      if (ws) ws.close();
      resolve(false);
    }, 10000);

    try {
      ws = new WebSocket(WS_URL);
    } catch (err) {
      clearTimeout(timeout);
      console.error('❌ Failed to open WebSocket:', (err as Error).message);
      return resolve(false);
    }

    const received: string[] = [];

    ws.on('open', () => {
      console.log('   WebSocket connection established.');
      // 1. Start session
      ws.send(
        JSON.stringify({
          type: 'start_session',
          sourceLanguage: 'od-IN',
          targetLanguage: 'ta-IN',
        })
      );

      // 2. Send mock audio chunk & end utterance
      const dummyPcm = Buffer.alloc(16000); // 0.5s of 16kHz audio
      const utteranceId = `test-utt-${Date.now()}`;

      ws.send(
        JSON.stringify({
          type: 'audio_chunk',
          utteranceId,
          audio: dummyPcm.toString('base64'),
          seq: 0,
        })
      );

      ws.send(
        JSON.stringify({
          type: 'end_utterance',
          utteranceId,
        })
      );
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        received.push(msg.type);
        console.log(`   📥 Received WebSocket event: [${msg.type}]`, {
          ...(msg.text ? { text: msg.text } : {}),
          ...(msg.latency ? { latency: msg.latency } : {}),
          ...(msg.mimeType ? { mimeType: msg.mimeType } : {}),
        });

        // When we have received translation, tts_audio, and latency, test is complete
        if (
          received.includes('final_transcript') &&
          received.includes('translation') &&
          received.includes('tts_audio') &&
          received.includes('latency')
        ) {
          clearTimeout(timeout);
          ws.close();
          console.log('✅ WebSocket pipeline test fully passed!');
          resolve(true);
        }
      } catch (err) {
        console.error('   Failed to parse WebSocket message:', err);
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timeout);
      console.error('❌ WebSocket error:', err.message);
      resolve(false);
    });
  });
}

async function run() {
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('\n❌ Backend is NOT running or failed health check.');
    console.log('   Start the server first with: npm run dev:server');
    process.exit(1);
  }

  const translateOk = await testHttpTranslate();
  const wsOk = await testWebSocket();

  console.log('\n====================================================');
  if (healthOk && translateOk && wsOk) {
    console.log('🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY!');
  } else {
    console.log('⚠️ Some backend tests failed. See output above.');
    process.exit(1);
  }
  console.log('====================================================\n');
}

run();
