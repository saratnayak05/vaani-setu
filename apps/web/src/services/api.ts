export interface BackendLatency {
  sttMs: number;
  translateMs: number;
  ttsMs: number;
  totalMs: number;
}

export interface BackendTranslationResponse {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  audioBase64?: string;
  mimeType?: string;
  latency: BackendLatency;
}

export interface BackendSpeechResponse {
  transcript: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  audioBase64?: string;
  mimeType?: string;
  latency: BackendLatency;
}

const BACKEND_BASE = 'http://localhost:3001';

/**
 * Check if the backend server is reachable and active.
 */
export async function checkBackendHealth(): Promise<{ online: boolean; mode?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(`${BACKEND_BASE}/health`, {
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.ok) {
      const data = await res.json();
      return { online: true, mode: data.mode };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}

/**
 * Translate text using the backend pipeline (STT/Translate/TTS).
 */
export async function translateWithBackend(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<BackendTranslationResponse> {
  const res = await fetch(`${BACKEND_BASE}/api/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      sourceLanguage,
      targetLanguage,
    }),
  });

  if (!res.ok) {
    throw new Error(`Backend translate failed with status ${res.status}`);
  }

  return (await res.json()) as BackendTranslationResponse;
}

/**
 * Play a base64 encoded audio string in the browser.
 */
export function playBase64Audio(base64: string, mimeType = 'audio/wav'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const audio = new Audio(`data:${mimeType};base64,${base64}`);
      audio.onended = () => resolve();
      audio.onerror = (e) => reject(e);
      audio.play().catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}
