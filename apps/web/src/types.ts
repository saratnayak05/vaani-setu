export interface LanguageMeta {
  code: string;
  nativeName: string;
  englishName: string;
  script: string;
  family: string;
  speakers: string;
  region: string;
  beta?: boolean;
}

export type TranslationMode = 'text' | 'voice' | 'both';

export type VoiceGender = 'female' | 'male';

export type SpeechSpeed = '0.75x' | '1.0x' | '1.25x';

export interface AppSettings {
  theme: 'dark' | 'light';
  mode: TranslationMode;
  interfaceLang: string;
  voiceGender: VoiceGender;
  speechSpeed: SpeechSpeed;
  autoDetectAcoustic: boolean;
  tableFaceToFaceMode: boolean;
}

export interface ConversationTurn {
  id: string;
  speaker: 'speaker1' | 'speaker2';
  langCode: string;
  nativeText: string;
  phoneticText: string;
  englishMeaning?: string;
  timestamp: string;
  latencySeconds: number;
  isPlaying?: boolean;
}
