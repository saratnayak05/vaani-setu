// ---------------------------------------------------------------------------
// Language registry for Vaani Setu
// Codes follow BCP-47 as used by the Sarvam AI API.
// Only languages supported by *all three* services (STT, Translate, TTS) are
// included. The first four are the launch languages; the rest are marked beta.
// ---------------------------------------------------------------------------

/** All language codes supported by the pipeline. */
export const LANGUAGE_CODES = [
  'od-IN',
  'ta-IN',
  'hi-IN',
  'en-IN',
  'bn-IN',
  'te-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'gu-IN',
  'pa-IN',
] as const;

/** A BCP-47 language code from the supported set. */
export type LanguageCode = (typeof LANGUAGE_CODES)[number];

/** Metadata about a single language. */
export interface Language {
  /** BCP-47 code used in Sarvam API requests. */
  code: LanguageCode;
  /** Name written in the language's own script. */
  nativeName: string;
  /** English display name. */
  englishName: string;
  /** Unicode script name — used to select the right Noto Sans font. */
  script: string;
  /** True if not fully tested in the pipeline yet. */
  beta: boolean;
}

/**
 * Canonical list of supported languages.
 *
 * Order matters: the first four are the "launch" set shown by default in the
 * UI language picker.
 */
export const LANGUAGES: readonly Language[] = [
  { code: 'od-IN', nativeName: 'ଓଡ଼ିଆ',     englishName: 'Odia',      script: 'Oriya',      beta: false },
  { code: 'ta-IN', nativeName: 'தமிழ்',      englishName: 'Tamil',     script: 'Tamil',      beta: false },
  { code: 'hi-IN', nativeName: 'हिन्दी',      englishName: 'Hindi',     script: 'Devanagari', beta: false },
  { code: 'en-IN', nativeName: 'English',     englishName: 'English',   script: 'Latin',      beta: false },
  { code: 'bn-IN', nativeName: 'বাংলা',       englishName: 'Bengali',   script: 'Bengali',    beta: true  },
  { code: 'te-IN', nativeName: 'తెలుగు',      englishName: 'Telugu',    script: 'Telugu',     beta: true  },
  { code: 'kn-IN', nativeName: 'ಕನ್ನಡ',       englishName: 'Kannada',   script: 'Kannada',    beta: true  },
  { code: 'ml-IN', nativeName: 'മലയാളം',     englishName: 'Malayalam', script: 'Malayalam',  beta: true  },
  { code: 'mr-IN', nativeName: 'मराठी',       englishName: 'Marathi',   script: 'Devanagari', beta: true  },
  { code: 'gu-IN', nativeName: 'ગુજરાતી',     englishName: 'Gujarati',  script: 'Gujarati',   beta: true  },
  { code: 'pa-IN', nativeName: 'ਪੰਜਾਬੀ',      englishName: 'Punjabi',   script: 'Gurmukhi',   beta: true  },
];

/** Look up a language by its BCP-47 code. Throws on unknown codes. */
export function getLanguage(code: LanguageCode): Language {
  const lang = LANGUAGES.find((l) => l.code === code);
  if (!lang) {
    throw new Error(`Unknown language code: ${code}`);
  }
  return lang;
}

/** Type-guard: is the value a known language code? */
export function isLanguageCode(value: unknown): value is LanguageCode {
  return (
    typeof value === 'string' &&
    (LANGUAGE_CODES as readonly string[]).includes(value)
  );
}
