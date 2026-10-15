// ---------------------------------------------------------------------------
// STT provider interface — abstracts speech-to-text services.
// ---------------------------------------------------------------------------

import type { LanguageCode } from '@vaani-setu/shared';

/** Result returned by an STT provider. */
export interface SttResult {
  /** Transcribed text. */
  transcript: string;
  /** Detected or confirmed language of the audio. */
  language: LanguageCode;
}

/**
 * Converts audio to text.
 *
 * Every concrete provider (Mock, Sarvam, …) must implement this interface.
 */
export interface SttProvider {
  readonly name: string;

  /**
   * Transcribe an audio buffer.
   *
   * @param audio  Raw audio bytes (PCM16 LE mono 16 kHz unless provider says
   *               otherwise).
   * @param language  Expected language of the audio.
   */
  transcribe(audio: Buffer, language: LanguageCode): Promise<SttResult>;
}
