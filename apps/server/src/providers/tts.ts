// ---------------------------------------------------------------------------
// TTS provider interface — abstracts text-to-speech services.
// ---------------------------------------------------------------------------

import type { LanguageCode } from '@vaani-setu/shared';

/** Result returned by a TTS provider. */
export interface TtsResult {
  /** Synthesized audio bytes. */
  audio: Buffer;
  /** MIME type of the audio (e.g. "audio/wav"). */
  mimeType: string;
}

/**
 * Converts text to speech audio.
 *
 * Every concrete provider (Mock, Sarvam, …) must implement this interface.
 */
export interface TtsProvider {
  readonly name: string;

  /**
   * Synthesize speech from text.
   *
   * @param text      Text to speak.
   * @param language  BCP-47 code of the language the text is in.
   */
  synthesize(text: string, language: LanguageCode): Promise<TtsResult>;
}
