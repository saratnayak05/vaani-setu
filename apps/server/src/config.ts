// ---------------------------------------------------------------------------
// Server configuration — loaded from environment variables.
// ---------------------------------------------------------------------------

import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the workspace root (two levels up from apps/server/src/)
config({ path: resolve(__dirname, '../../../.env') });

export const serverConfig = {
  port: parseInt(process.env['PORT'] ?? '3001', 10),
  sarvamApiKey: process.env['SARVAM_API_KEY'] ?? '',
  get useMockProviders(): boolean {
    return this.sarvamApiKey === '';
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
