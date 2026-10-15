// ---------------------------------------------------------------------------
// Translate provider interface — abstracts text translation services.
// ---------------------------------------------------------------------------

import type { LanguageCode } from '@vaani-setu/shared';

/** Result returned by a translation provider. */
export interface TranslateResult {
  /** Translated text in the target language. */
  translatedText: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
}

/**
 * Translates text between languages.
 *
 * Every concrete provider (Mock, Sarvam, …) must implement this interface.
 */
export interface TranslateProvider {
  readonly name: string;

  /**
   * Translate text from one language to another.
   *
   * @param text    Source text to translate.
   * @param source  BCP-47 code of the source language.
   * @param target  BCP-47 code of the target language.
   */
  translate(
    text: string,
    source: LanguageCode,
    target: LanguageCode,
  ): Promise<TranslateResult>;
}
