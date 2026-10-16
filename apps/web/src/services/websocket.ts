import type { BackendLatency } from './api';

export type SocketStatus = 'connected' | 'connecting' | 'disconnected';

export interface SocketEvents {
  onStatusChange?: (status: SocketStatus) => void;
  onTranslation?: (text: string, targetLang: string) => void;
  onAudio?: (base64Audio: string, mimeType: string) => void;
  onLatency?: (latency: BackendLatency) => void;
  onTranscript?: (transcript: string) => void;
  onError?: (err: string) => void;
}

export class VaaniWebSocketClient {
  private ws: WebSocket | null = null;
  private status: SocketStatus = 'disconnected';
  private events: SocketEvents = {};
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private currentSource = 'od-IN';
  private currentTarget = 'ta-IN';

  constructor(events: SocketEvents = {}) {
    this.events = events;
  }

  connect(sourceLang = 'od-IN', targetLang = 'ta-IN') {
    this.currentSource = sourceLang;
    this.currentTarget = targetLang;

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.setStatus('connecting');

    try {
      this.ws = new WebSocket('ws://localhost:3001');

      this.ws.onopen = () => {
        this.setStatus('connected');
        this.sendSessionStart(this.currentSource, this.currentTarget);
      };

      this.ws.onclose = () => {
        this.setStatus('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.setStatus('disconnected');
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch {
          // Ignore JSON parse error
        }
      };
    } catch {
      this.setStatus('disconnected');
      this.scheduleReconnect();
    }
  }

  private setStatus(status: SocketStatus) {
    this.status = status;
    if (this.events.onStatusChange) {
      this.events.onStatusChange(status);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(this.currentSource, this.currentTarget);
    }, 4000);
  }

  sendSessionStart(source: string, target: string) {
    this.currentSource = source;
    this.currentTarget = target;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'start_session',
          sourceLanguage: source,
          targetLanguage: target,
        })
      );
    }
  }

  sendSwapLanguages() {
    const tmp = this.currentSource;
    this.currentSource = this.currentTarget;
    this.currentTarget = tmp;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'swap_languages' }));
    }
  }

  sendTextTranslate(text: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'text_translate',
          utteranceId: `utt-${Date.now()}`,
          text,
        })
      );
      return true;
    }
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleServerMessage(msg: any) {
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'translation':
        if (this.events.onTranslation) {
          this.events.onTranslation(msg.text, msg.targetLanguage);
        }
        break;

      case 'tts_audio':
        if (this.events.onAudio) {
          this.events.onAudio(msg.audio, msg.mimeType || 'audio/wav');
        }
        break;

      case 'latency':
        if (this.events.onLatency) {
          this.events.onLatency({
            sttMs: msg.sttMs || 0,
            translateMs: msg.translateMs || 0,
            ttsMs: msg.ttsMs || 0,
            totalMs: msg.totalMs || 0,
          });
        }
        break;

      case 'final_transcript':
        if (this.events.onTranscript) {
          this.events.onTranscript(msg.text);
        }
        break;

      case 'error':
        if (this.events.onError) {
          this.events.onError(msg.message || 'Error from server');
        }
        break;
    }
  }

  getStatus(): SocketStatus {
    return this.status;
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
