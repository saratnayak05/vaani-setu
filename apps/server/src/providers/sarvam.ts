import type { LanguageCode } from '@vaani-setu/shared';
import type { SttProvider, SttResult } from './stt.js';
import type { TranslateProvider, TranslateResult } from './translate.js';
import type { TtsProvider, TtsResult } from './tts.js';

export class SarvamSttProvider implements SttProvider {
  readonly name = 'Sarvam-STT-Provider';

  constructor(private readonly apiKey: string) {}

  async transcribe(audio: Buffer, language: LanguageCode): Promise<SttResult> {
    const formData = new FormData();
    const blob = new Blob([audio], { type: 'audio/wav' });
    formData.append('file', blob, 'audio.wav');
    formData.append('language_code', language);
    formData.append('model', 'saaras:v3');

    const res = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': this.apiKey,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Sarvam STT failed with status ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { transcript: string; language_code?: string };
    return {
      transcript: data.transcript || '',
      language: (data.language_code as LanguageCode) || language,
    };
  }
}

export class SarvamTranslateProvider implements TranslateProvider {
  readonly name = 'Sarvam-Translate-Provider';

  constructor(private readonly apiKey: string) {}

  async translate(
    text: string,
    source: LanguageCode,
    target: LanguageCode,
  ): Promise<TranslateResult> {
    const res = await fetch('https://api.sarvam.ai/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: source,
        target_language_code: target,
        mode: 'formal',
      }),
    });

    if (!res.ok) {
      throw new Error(`Sarvam Translate failed with status ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { translated_text: string };
    return {
      translatedText: data.translated_text || '',
      sourceLanguage: source,
      targetLanguage: target,
    };
  }
}

export class SarvamTtsProvider implements TtsProvider {
  readonly name = 'Sarvam-TTS-Provider';

  constructor(private readonly apiKey: string) {}

  async synthesize(text: string, language: LanguageCode): Promise<TtsResult> {
    const res = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: language,
        speaker: process.env['SARVAM_TTS_SPEAKER'] || 'kavya',
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 16000,
        enable_preprocessing: true,
        model: 'bulbul:v3',
      }),
    });

    if (!res.ok) {
      throw new Error(`Sarvam TTS failed with status ${res.status}: ${await res.text()}`);
    }

    const data = (await res.json()) as { audios: string[] };
    const base64Audio = data.audios?.[0] || '';
    const audioBuffer = Buffer.from(base64Audio, 'base64');

    return {
      audio: audioBuffer,
      mimeType: 'audio/wav',
    };
  }
}
