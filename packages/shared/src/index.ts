// ---------------------------------------------------------------------------
// @vaani-setu/shared — public API
// ---------------------------------------------------------------------------

// Languages
export {
  LANGUAGE_CODES,
  LANGUAGES,
  getLanguage,
  isLanguageCode,
} from './languages.js';

export type { Language, LanguageCode } from './languages.js';

// Message protocol
export {
  encodeMessage,
  decodeMessage,
  isClientMessage,
  isServerMessage,
} from './messages.js';

export type {
  UtteranceId,
  // Client → Server
  ClientMessage,
  ClientMessageType,
  StartSessionMessage,
  AudioChunkClientMessage,
  EndUtteranceMessage,
  SwapLanguagesMessage,
  // Server → Client
  ServerMessage,
  ServerMessageType,
  PartialTranscriptMessage,
  FinalTranscriptMessage,
  TranslationMessage,
  TtsAudioMessage,
  LatencyMessage,
  ErrorMessage,
  ErrorCode,
} from './messages.js';
