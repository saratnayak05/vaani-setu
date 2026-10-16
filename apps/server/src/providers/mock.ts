import type { LanguageCode } from '@vaani-setu/shared';
import type { SttProvider, SttResult } from './stt.js';
import type { TranslateProvider, TranslateResult } from './translate.js';
import type { TtsProvider, TtsResult } from './tts.js';

// Multilingual acoustic dictionary for high-fidelity fallback
const MOCK_DICTIONARY: Record<string, Record<string, string>> = {
  'bus stand': {
    'od-IN': 'ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
    'ta-IN': 'பேருந்து நிலையம் எங்கே உள்ளது?',
    'hi-IN': 'बस स्टैंड कहाँ है?',
    'en-IN': 'Where is the bus stand?',
    'bn-IN': 'বাস স্ট্যান্ড কোথায়?',
    'te-IN': 'బస్ స్టాండ్ ఎక్కడ ఉంది?',
    'kn-IN': 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    'ml-IN': 'ബസ് സ്റ്റാൻഡ് എവിടെയാണ്?',
    'mr-IN': 'बस स्थानक कुठे आहे?',
    'gu-IN': 'બસ સ્ટેન્ડ ક્યાં છે?',
    'pa-IN': 'ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?',
  },
  'railway station': {
    'od-IN': 'ରେଳ ଷ୍ଟେସନ କେଉଁ ପାଖରେ?',
    'ta-IN': 'ரயில் நிலையம் எந்த பக்கம்?',
    'hi-IN': 'रेलवे स्टेशन किस तरफ है?',
    'en-IN': 'Which way to the railway station?',
    'bn-IN': 'রেল স্টেশন কোন দিকে?',
    'te-IN': 'రైల్వే స్టేషన్ ఏ వైపు?',
    'kn-IN': 'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಯಾವ ಕಡೆ?',
    'ml-IN': 'റെയിൽവേ സ്റ്റേഷൻ ഏതു വഴിയിലാണ്?',
    'mr-IN': 'रेल्वे स्टेशन कोणत्या बाजूला आहे?',
    'gu-IN': 'રેલવે સ્ટેશન કઈ તરફ છે?',
    'pa-IN': 'ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਕਿਧਰ ਹੈ?',
  },
  'toilet': {
    'od-IN': 'ଶୌଚାଳୟ କେଉଁଠି ମିଳିବ?',
    'ta-IN': 'கழிப்பறை எங்குள்ளது?',
    'hi-IN': 'शौचालय कहाँ है?',
    'en-IN': 'Where is the nearest restroom?',
    'bn-IN': 'শৌচাগার কোথায়?',
    'te-IN': 'మరుగుదొడ్డి ఎక్కడ ఉంది?',
    'kn-IN': 'ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?',
    'ml-IN': 'ടോയ്‌ലറ്റ് എവിടെയാണ്?',
    'mr-IN': 'शौचालय कुठे आहे?',
    'gu-IN': 'શૌચાલય ક્યાં છે?',
    'pa-IN': 'ਗੁਸਲਖਾਨਾ ਕਿੱਥੇ ਹੈ?',
  },
  'water': {
    'od-IN': 'ପିଇବା ପାଣି ମିଳିପାରିବ କି?',
    'ta-IN': 'குடிநீர் கிடைக்குமா?',
    'hi-IN': 'पीने का पानी कहाँ मिलेगा?',
    'en-IN': 'Is drinking water available here?',
    'bn-IN': 'খাবার জল পাওয়া যাবে কি?',
    'te-IN': 'త్రాగునీరు దొరుకుతుందా?',
    'kn-IN': 'ಕುಡಿಯುವ ನೀರು ಸಿಗುತ್ತದೆಯೇ?',
    'ml-IN': 'കുടിക്കാൻ വെള്ളം കിട്ടുമോ?',
    'mr-IN': 'पिण्याचे पाणी कुठे मिळेल?',
    'gu-IN': 'પીવાનું પાણી ક્યાં મળશે?',
    'pa-IN': 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਮਿਲੇਗਾ?',
  },
};

/**
 * Creates a minimal valid 16-bit mono 16 kHz PCM WAV header & silent buffer
 */
function createMockWavBuffer(durationSeconds = 0.5): Buffer {
  const sampleRate = 16000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // subchunk1 size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // 'data' subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Fill with a soft sine wave tone (440Hz)
  const freq = 440;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * freq * t) * 0.15 * 32767;
    buffer.writeInt16LE(Math.floor(sample), 44 + i * 2);
  }

  return buffer;
}

export class MockSttProvider implements SttProvider {
  readonly name = 'Mock-STT-Provider';

  async transcribe(_audio: Buffer, language: LanguageCode): Promise<SttResult> {
    // Simulate real acoustic STT latency (~120ms)
    await new Promise((r) => setTimeout(r, 120));

    const defaultPhrases: Record<string, string> = {
      'od-IN': 'ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
      'ta-IN': 'பேருந்து நிலையம் எங்கே உள்ளது?',
      'hi-IN': 'बस स्टैंड कहाँ है?',
      'en-IN': 'Where is the bus stand?',
    };

    return {
      transcript: defaultPhrases[language] || 'ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
      language,
    };
  }
}

export class MockTranslateProvider implements TranslateProvider {
  readonly name = 'Mock-Translate-Provider';

  async translate(
    text: string,
    source: LanguageCode,
    target: LanguageCode,
  ): Promise<TranslateResult> {
    // Simulate translation latency (~90ms)
    await new Promise((r) => setTimeout(r, 90));

    const lower = text.toLowerCase();
    for (const [key, map] of Object.entries(MOCK_DICTIONARY)) {
      if (
        lower.includes(key) ||
        Object.values(map).some((val) => lower.includes(val.toLowerCase()))
      ) {
        if (map[target]) {
          return {
            translatedText: map[target],
            sourceLanguage: source,
            targetLanguage: target,
          };
        }
      }
    }

    // Default target fallbacks
    const targetFallbacks: Record<string, string> = {
      'ta-IN': 'பேருந்து நிலையம் எங்கே உள்ளது?',
      'od-IN': 'ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
      'hi-IN': 'बस स्टैंड कहाँ है?',
      'en-IN': 'Where is the bus stand?',
    };

    return {
      translatedText: targetFallbacks[target] || text,
      sourceLanguage: source,
      targetLanguage: target,
    };
  }
}

export class MockTtsProvider implements TtsProvider {
  readonly name = 'Mock-TTS-Provider';

  async synthesize(_text: string, _language: LanguageCode): Promise<TtsResult> {
    // Simulate neural voice synthesis latency (~110ms)
    await new Promise((r) => setTimeout(r, 110));

    return {
      audio: createMockWavBuffer(0.6),
      mimeType: 'audio/wav',
    };
  }
}
