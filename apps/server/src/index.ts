import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { serverConfig } from './config.js';
import { createProviders } from './providers/index.js';
import type { LanguageCode } from '@vaani-setu/shared';
import {
  decodeMessage,
  encodeMessage,
  isClientMessage,
  type ServerMessage,
} from '@vaani-setu/shared';

const providers = createProviders();

/** Add CORS headers to all HTTP responses */
function setCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/** Parse incoming JSON request body */
async function parseJsonBody<T>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? (JSON.parse(body) as T) : ({} as T));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Create HTTP server
const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? '/', `http://${req.headers.host || 'localhost'}`);

  // 1. Health check
  if (req.method === 'GET' && (url.pathname === '/health' || url.pathname === '/api/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'vaani-setu-server',
        version: '0.0.1',
        uptime: process.uptime(),
        mode: serverConfig.useMockProviders ? 'mock' : 'live-sarvam',
      })
    );
    return;
  }

  // 2. POST /api/translate
  if (req.method === 'POST' && url.pathname === '/api/translate') {
    try {
      const startTime = performance.now();
      const body = await parseJsonBody<{
        text: string;
        sourceLanguage: LanguageCode;
        targetLanguage: LanguageCode;
      }>(req);

      if (!body.text || !body.sourceLanguage || !body.targetLanguage) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing text, sourceLanguage, or targetLanguage' }));
        return;
      }

      // 1. Translate
      const transStart = performance.now();
      const transResult = await providers.translate.translate(
        body.text,
        body.sourceLanguage,
        body.targetLanguage
      );
      const translateMs = Math.round(performance.now() - transStart);

      // 2. TTS
      const ttsStart = performance.now();
      const ttsResult = await providers.tts.synthesize(
        transResult.translatedText,
        body.targetLanguage
      );
      const ttsMs = Math.round(performance.now() - ttsStart);
      const totalMs = Math.round(performance.now() - startTime);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          sourceText: body.text,
          translatedText: transResult.translatedText,
          sourceLanguage: body.sourceLanguage,
          targetLanguage: body.targetLanguage,
          audioBase64: ttsResult.audio.toString('base64'),
          mimeType: ttsResult.mimeType,
          latency: {
            sttMs: 0,
            translateMs,
            ttsMs,
            totalMs,
          },
        })
      );
    } catch (err: unknown) {
      console.error('[HTTP Error]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal translation error',
        })
      );
    }
    return;
  }

  // 3. POST /api/speech (Full pipeline: STT -> Translate -> TTS)
  if (req.method === 'POST' && url.pathname === '/api/speech') {
    try {
      const startTime = performance.now();
      const body = await parseJsonBody<{
        audioBase64: string;
        sourceLanguage: LanguageCode;
        targetLanguage: LanguageCode;
      }>(req);

      if (!body.audioBase64 || !body.sourceLanguage || !body.targetLanguage) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing audioBase64, sourceLanguage, or targetLanguage' }));
        return;
      }

      const audioBuffer = Buffer.from(body.audioBase64, 'base64');

      // 1. STT
      const sttStart = performance.now();
      const sttResult = await providers.stt.transcribe(audioBuffer, body.sourceLanguage);
      const sttMs = Math.round(performance.now() - sttStart);

      // 2. Translate
      const transStart = performance.now();
      const transResult = await providers.translate.translate(
        sttResult.transcript,
        body.sourceLanguage,
        body.targetLanguage
      );
      const translateMs = Math.round(performance.now() - transStart);

      // 3. TTS
      const ttsStart = performance.now();
      const ttsResult = await providers.tts.synthesize(
        transResult.translatedText,
        body.targetLanguage
      );
      const ttsMs = Math.round(performance.now() - ttsStart);
      const totalMs = Math.round(performance.now() - startTime);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          transcript: sttResult.transcript,
          translatedText: transResult.translatedText,
          sourceLanguage: body.sourceLanguage,
          targetLanguage: body.targetLanguage,
          audioBase64: ttsResult.audio.toString('base64'),
          mimeType: ttsResult.mimeType,
          latency: {
            sttMs,
            translateMs,
            ttsMs,
            totalMs,
          },
        })
      );
    } catch (err: unknown) {
      console.error('[HTTP Error]', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: err instanceof Error ? err.message : 'Internal speech pipeline error',
        })
      );
    }
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Attach WebSocket Server if available
async function initWebSocket() {
  try {
    const wsModule = await import('ws');
    const WebSocketServer = wsModule.WebSocketServer || wsModule.default?.WebSocketServer;
    if (!WebSocketServer) return;

    const wss = new WebSocketServer({ server });
    console.log('[Vaani-Setu Backend] WebSocket Server mounted on same port');

    wss.on('connection', (ws) => {
      let sourceLang: LanguageCode = 'od-IN';
      let targetLang: LanguageCode = 'ta-IN';
      let audioChunks: Buffer[] = [];

      const send = (msg: ServerMessage) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(encodeMessage(msg));
        }
      };

      ws.on('message', async (raw) => {
        const decoded = decodeMessage(raw.toString());
        if (!isClientMessage(decoded)) {
          // Check for custom text_translate convenience message
          const custom = decoded as { type?: string; utteranceId?: string; text?: string };
          if (custom?.type === 'text_translate' && custom.text) {
            const utteranceId = custom.utteranceId || `utt-${Date.now()}`;
            const startTime = performance.now();

            // Translate
            const transStart = performance.now();
            const transResult = await providers.translate.translate(custom.text, sourceLang, targetLang);
            const translateMs = Math.round(performance.now() - transStart);

            send({
              type: 'translation',
              utteranceId,
              text: transResult.translatedText,
              sourceLanguage: sourceLang,
              targetLanguage: targetLang,
            });

            // TTS
            const ttsStart = performance.now();
            const ttsResult = await providers.tts.synthesize(transResult.translatedText, targetLang);
            const ttsMs = Math.round(performance.now() - ttsStart);

            send({
              type: 'tts_audio',
              utteranceId,
              audio: ttsResult.audio.toString('base64'),
              mimeType: ttsResult.mimeType,
            });

            send({
              type: 'latency',
              utteranceId,
              sttMs: 0,
              translateMs,
              ttsMs,
              totalMs: Math.round(performance.now() - startTime),
            });
          }
          return;
        }

        switch (decoded.type) {
          case 'start_session':
            sourceLang = decoded.sourceLanguage;
            targetLang = decoded.targetLanguage;
            audioChunks = [];
            break;

          case 'swap_languages': {
            const tmp = sourceLang;
            sourceLang = targetLang;
            targetLang = tmp;
            break;
          }

          case 'audio_chunk':
            audioChunks.push(Buffer.from(decoded.audio, 'base64'));
            break;

          case 'end_utterance': {
            const utteranceId = decoded.utteranceId;
            const fullAudio = Buffer.concat(audioChunks);
            audioChunks = [];

            const startTime = performance.now();

            try {
              // 1. STT
              const sttStart = performance.now();
              const sttResult = await providers.stt.transcribe(fullAudio, sourceLang);
              const sttMs = Math.round(performance.now() - sttStart);

              send({
                type: 'final_transcript',
                utteranceId,
                text: sttResult.transcript,
                language: sourceLang,
              });

              // 2. Translate
              const transStart = performance.now();
              const transResult = await providers.translate.translate(
                sttResult.transcript,
                sourceLang,
                targetLang
              );
              const translateMs = Math.round(performance.now() - transStart);

              send({
                type: 'translation',
                utteranceId,
                text: transResult.translatedText,
                sourceLanguage: sourceLang,
                targetLanguage: targetLang,
              });

              // 3. TTS
              const ttsStart = performance.now();
              const ttsResult = await providers.tts.synthesize(
                transResult.translatedText,
                targetLang
              );
              const ttsMs = Math.round(performance.now() - ttsStart);
              const totalMs = Math.round(performance.now() - startTime);

              send({
                type: 'tts_audio',
                utteranceId,
                audio: ttsResult.audio.toString('base64'),
                mimeType: ttsResult.mimeType,
              });

              send({
                type: 'latency',
                utteranceId,
                sttMs,
                translateMs,
                ttsMs,
                totalMs,
              });
            } catch (err: unknown) {
              send({
                type: 'error',
                utteranceId,
                code: 'unknown',
                message: err instanceof Error ? err.message : 'Processing error',
              });
            }
            break;
          }
        }
      });
    });
  } catch {
    // ws package not installed yet, HTTP endpoints serve pipeline
  }
}

// Start server
server.listen(serverConfig.port, () => {
  console.log(`[Vaani-Setu Backend] Listening on http://localhost:${serverConfig.port}`);
  initWebSocket();
});
