// ---------------------------------------------------------------------------
// Server configuration — loaded from environment variables or .env file.
// ---------------------------------------------------------------------------

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Built-in zero-dependency .env loader for workspace root
try {
  const envPath = resolve(__dirname, '../../../.env');
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/(^['"]|['"]$)/g, '');
        if (key && !(key in process.env)) {
          process.env[key] = val;
        }
      }
    }
  }
} catch {
  // Ignore env read errors and use process.env defaults
}

export const serverConfig = {
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  sarvamApiKey: process.env['SARVAM_API_KEY'] ?? '',
  get useMockProviders(): boolean {
    return this.sarvamApiKey.trim() === '';
  },
  rateLimit: {
    /** Window length in milliseconds. */
    windowMs: 60_000,
    /** Max HTTP requests per window per IP. */
    maxHttpRequests: 60,
    /** Max WebSocket messages per window per connection. */
    maxWsMessages: 200,
  },
} as const;
