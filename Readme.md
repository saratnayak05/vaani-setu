# 🎙️ VaakAnuvadak (वाक अनुवादक)

> **Real-time Speech-to-Speech Translator for Indian Languages**  
> Speak in Hindi. Hear in Tamil. Instantly.

Built on **Sarvam AI** APIs · **Node.js** · **Express** · **React**

---

## ✨ What It Does

VaakAnuvadak fills the gap that Sarvam AI's individual APIs leave open — it chains **STT → Translate → TTS** into a seamless, zero-typing voice translation experience across 12 Indian languages.

```
🎤 You speak  →  📝 Transcribe  →  🔄 Translate  →  🔊 Play back
   (any lang)     (saaras:v3)      (sarvam-translate)  (bulbul:v3)
```

---

## 🌐 Supported Languages

| Language   | Code    | Language  | Code    | Language  | Code    |
|------------|---------|-----------|---------|-----------|---------|
| Hindi      | `hi-IN` | Tamil     | `ta-IN` | Telugu    | `te-IN` |
| Bengali    | `bn-IN` | Kannada   | `kn-IN` | Malayalam | `ml-IN` |
| Marathi    | `mr-IN` | Gujarati  | `gu-IN` | Punjabi   | `pa-IN` |
| Odia       | `od-IN` | Assamese  | `as-IN` | English   | `en-IN` |

---

## 🏗️ Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Runtime      | Node.js 20 LTS              |
| Backend      | Express.js 4.x              |
| WebSocket    | `ws` npm package            |
| Frontend     | React 18 + Vite             |
| Styling      | Tailwind CSS 3              |
| Audio Input  | MediaRecorder API (browser) |
| HTTP Client  | Axios                       |
| Process Mgmt | PM2                         |
| Deployment   | Docker + Railway / Render   |

---

## 📁 Project Structure

```
vaak-anuvadak/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── translate.js      # POST /api/translate
│   │   │   └── health.js         # GET /api/health
│   │   ├── services/
│   │   │   ├── stt.js            # Sarvam STT wrapper
│   │   │   ├── translate.js      # Sarvam Translate wrapper
│   │   │   └── tts.js            # Sarvam TTS wrapper
│   │   ├── middleware/
│   │   │   ├── rateLimiter.js
│   │   │   └── errorHandler.js
│   │   └── app.js
│   ├── .env                      # 🔒 never commit this
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MicButton.jsx
│   │   │   ├── LanguageSelector.jsx
│   │   │   ├── AudioPlayer.jsx
│   │   │   └── TranscriptCard.jsx
│   │   ├── hooks/
│   │   │   ├── useMediaRecorder.js
│   │   │   └── useSarvamTranslate.js
│   │   └── App.jsx
│   └── vite.config.js
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- A [Sarvam AI API key](https://dashboard.sarvam.ai)

### 1. Clone & Install

```bash
git clone https://github.com/your-org/vaak-anuvadak.git
cd vaak-anuvadak
```

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# backend/.env
SARVAM_API_KEY=your_sarvam_api_key_here
PORT=3001
```

### 3. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

App runs at → `http://localhost:5173`

---

## 🔌 API Reference

### `POST /api/translate`

Accepts audio, returns transcript + translation + audio.

**Request** (`multipart/form-data`):

| Field         | Type   | Required | Description                          |
|---------------|--------|----------|--------------------------------------|
| `audio`       | File   | ✅       | WAV/PCM audio blob (16kHz)           |
| `target_lang` | string | ✅       | e.g. `ta-IN`                         |
| `source_lang` | string | ❌       | e.g. `hi-IN` (default: `auto`)       |
| `voice`       | string | ❌       | Sarvam speaker name (default: `ananya`) |
| `speed`       | float  | ❌       | Playback speed 0.5–2.0 (default: `1.0`) |

**Response (`200 OK`)**:

```json
{
  "transcript":    "आपका स्वागत है",
  "detected_lang": "hi-IN",
  "translation":   "Welcome",
  "audio_base64":  "<base64-encoded WAV>",
  "latency_ms":    2340
}
```

### `GET /api/languages`

Returns supported language list for populating dropdowns.

### `WebSocket /ws/stream` *(Phase 2)*

Real-time streaming STT + translation. Sends partial results as audio chunks arrive.

---

## 🧩 Sarvam AI APIs Used

| API              | Model             | Endpoint                   |
|------------------|-------------------|----------------------------|
| Speech-to-Text   | `saaras:v3`       | `POST /speech-to-text`     |
| Translate        | `sarvam-translate`| `POST /translate`          |
| Text-to-Speech   | `bulbul:v3`       | `POST /text-to-speech`     |
| Language Detect  | Auto              | `POST /text-language-identifier` |

---

## 🗺️ Roadmap

| Phase | Timeline   | Highlights                                        |
|-------|------------|---------------------------------------------------|
| 1 MVP | Weeks 1–3  | Basic STT→Translate→TTS pipeline, REST API, web UI |
| 2     | Weeks 4–6  | WebSocket streaming, auto language detection      |
| 3     | Weeks 7–9  | Conversation history, two-way mode, mobile UI     |
| 4     | Weeks 10–12| Batch/file upload, analytics, public API access   |

---

## 🐳 Docker

```bash
docker-compose up --build
```

Backend → `http://localhost:3001`  
Frontend → `http://localhost:5173`

---

## 🔒 Security Notes

- Sarvam API key is **server-side only** — never exposed to the browser
- All requests go through the Node.js backend as a proxy
- Audio is processed in-memory and **not stored** on disk
- HTTPS enforced in production via `helmet` middleware

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feat/your-feature`
3. Commit — `git commit -m "feat: your feature"`
4. Push & open a Pull Request

---

## 📄 License

MIT © 2025 VaakAnuvadak Contributors

---

> Built with ❤️ for India's 600M+ speakers who deserve technology in their own language.