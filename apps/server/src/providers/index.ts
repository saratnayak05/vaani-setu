import { serverConfig } from '../config.js';
import type { SttProvider } from './stt.js';
import type { TranslateProvider } from './translate.js';
import type { TtsProvider } from './tts.js';
import { MockSttProvider, MockTranslateProvider, MockTtsProvider } from './mock.js';
import { SarvamSttProvider, SarvamTranslateProvider, SarvamTtsProvider } from './sarvam.js';

export interface Providers {
  stt: SttProvider;
  translate: TranslateProvider;
  tts: TtsProvider;
}

export function createProviders(): Providers {
  if (serverConfig.useMockProviders) {
    console.log('[Vaani-Setu Backend] Using Mock Providers (no SARVAM_API_KEY provided)');
    return {
      stt: new MockSttProvider(),
      translate: new MockTranslateProvider(),
      tts: new MockTtsProvider(),
    };
  }

  console.log('[Vaani-Setu Backend] Using Sarvam AI Live Providers');
  return {
    stt: new SarvamSttProvider(serverConfig.sarvamApiKey),
    translate: new SarvamTranslateProvider(serverConfig.sarvamApiKey),
    tts: new SarvamTtsProvider(serverConfig.sarvamApiKey),
  };
}

export type { SttProvider, TranslateProvider, TtsProvider };
