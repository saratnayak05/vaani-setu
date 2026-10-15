import React, { useState } from 'react';
import type { AppSettings, VoiceGender, SpeechSpeed } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onTestVoice: (gender: VoiceGender, speed: SpeechSpeed) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTestVoice,
}) => {
  const [playingVoice, setPlayingVoice] = useState<VoiceGender | null>(null);

  if (!isOpen) return null;

  const handlePlayVoice = (gender: VoiceGender) => {
    setPlayingVoice(gender);
    onTestVoice(gender, settings.speechSpeed);
    setTimeout(() => {
      setPlayingVoice(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg h-full sm:h-auto max-h-[92vh] flex flex-col bg-white dark:bg-ink-900 rounded-none sm:rounded-3xl border border-neutral-200 dark:border-ink-700/80 shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-ink-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-ink-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-ink-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Back"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                Dialect Settings
              </h2>
              <p className="text-xs text-saffron-600 dark:text-saffron-400 font-medium">
                Acoustic Engine Pro • Fine-tune bilingual synthesis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-saffron-500 text-black hover:bg-saffron-400 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Appearance & Theme */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Appearance & Theme
              </span>
              <span className="text-[10px] text-neutral-400">Live preview</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Dark Ink Card */}
              <button
                onClick={() => onUpdateSettings({ theme: 'dark' })}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  settings.theme === 'dark'
                    ? 'bg-ink-950 border-saffron-500 ring-2 ring-saffron-500/30'
                    : 'bg-ink-950/40 border-neutral-700/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
                    <span className="text-xs font-bold text-white">Dark Ink</span>
                  </div>
                  {settings.theme === 'dark' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-saffron-500 text-black font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-400 leading-snug">
                  Calm high-contrast for prolonged acoustic focus
                </div>
              </button>

              {/* Light Saffron Card */}
              <button
                onClick={() => onUpdateSettings({ theme: 'light' })}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  settings.theme === 'light'
                    ? 'bg-parchment-50 border-saffron-500 ring-2 ring-saffron-500/30 shadow-md'
                    : 'bg-neutral-100 border-neutral-300 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-bold text-neutral-900">Saffron Glow</span>
                  </div>
                  {settings.theme === 'light' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-saffron-500 text-black font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-neutral-600 leading-snug">
                  Warm parchment tones with crisp daytime contrast
                </div>
              </button>
            </div>
          </div>

          {/* Interface Language */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Interface Language
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Bilingual UI</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: 'od-IN', native: 'ଓଡ଼ିଆ', name: 'Odia' },
                { code: 'ta-IN', native: 'தமிழ்', name: 'Tamil' },
                { code: 'en-IN', native: 'English', name: 'English' },
                { code: 'hi-IN', native: 'हिन्दी', name: 'Hindi' },
                { code: 'bn-IN', native: 'বাংলা', name: 'Bengali' },
              ].map((lang) => {
                const isSel = settings.interfaceLang === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => onUpdateSettings({ interfaceLang: lang.code })}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                      isSel
                        ? 'bg-saffron-500/15 border-saffron-500 text-neutral-900 dark:text-white font-bold'
                        : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/60 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-indic font-bold">{lang.native}</div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{lang.name}</div>
                    </div>
                    {isSel && (
                      <span className="w-2 h-2 rounded-full bg-saffron-500"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Voice Preference */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Voice Preference
              </span>
              <span className="text-[10px] text-saffron-500 font-medium">
                Sarvam Neural TTS
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Female Voice */}
              <div
                onClick={() => onUpdateSettings({ voiceGender: 'female' })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  settings.voiceGender === 'female'
                    ? 'bg-saffron-500/10 border-saffron-500 ring-1 ring-saffron-500/40'
                    : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center font-bold text-xs">
                      ♀
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>Female Voice</span>
                        {settings.voiceGender === 'female' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-saffron-500 text-black font-bold">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice('female');
                    }}
                    className={`p-2 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                      playingVoice === 'female'
                        ? 'bg-saffron-500 text-black'
                        : 'bg-neutral-200 dark:bg-ink-700 text-neutral-800 dark:text-neutral-200 hover:bg-saffron-500 hover:text-black'
                    }`}
                    title="Play voice preview"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Sample</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Natural, melodic tone with dialect pitch accuracy
                </p>

                {/* Animated waveform preview */}
                <div className="flex items-center gap-1 h-3 px-1">
                  {[40, 75, 100, 60, 30, 80, 95, 50, 70, 90, 45, 65, 85, 30, 70].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        settings.voiceGender === 'female'
                          ? 'bg-saffron-500'
                          : 'bg-neutral-300 dark:bg-ink-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Male Voice */}
              <div
                onClick={() => onUpdateSettings({ voiceGender: 'male' })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  settings.voiceGender === 'male'
                    ? 'bg-saffron-500/10 border-saffron-500 ring-1 ring-saffron-500/40'
                    : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">
                      ♂
                    </div>
                    <div>
                      <div className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>Male Voice</span>
                        {settings.voiceGender === 'male' && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-saffron-500 text-black font-bold">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayVoice('male');
                    }}
                    className={`p-2 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                      playingVoice === 'male'
                        ? 'bg-saffron-500 text-black'
                        : 'bg-neutral-200 dark:bg-ink-700 text-neutral-800 dark:text-neutral-200 hover:bg-saffron-500 hover:text-black'
                    }`}
                    title="Play voice preview"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span>Sample</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                  Deep, warm resonant tone with balanced acoustic warmth
                </p>

                {/* Waveform preview */}
                <div className="flex items-center gap-1 h-3 px-1">
                  {[20, 50, 70, 90, 80, 60, 100, 75, 45, 85, 90, 60, 40, 70, 50].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all ${
                        settings.voiceGender === 'male'
                          ? 'bg-saffron-500'
                          : 'bg-neutral-300 dark:bg-ink-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Speech Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Speech Speed
              </span>
              <span className="text-xs font-bold text-saffron-500">
                {settings.speechSpeed} ({settings.speechSpeed === '1.0x' ? 'Natural' : settings.speechSpeed === '0.75x' ? 'Articulated' : 'Brisk'})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { speed: '0.75x' as SpeechSpeed, label: '0.75x', desc: 'Articulated' },
                { speed: '1.0x' as SpeechSpeed, label: '1.0x', desc: 'Conversational' },
                { speed: '1.25x' as SpeechSpeed, label: '1.25x', desc: 'Brisk' },
              ].map((item) => {
                const isSel = settings.speechSpeed === item.speed;
                return (
                  <button
                    key={item.speed}
                    onClick={() => onUpdateSettings({ speechSpeed: item.speed })}
                    className={`py-2 px-3 rounded-xl border text-center transition-all ${
                      isSel
                        ? 'bg-saffron-500 text-black border-saffron-400 font-bold shadow-sm'
                        : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/60 text-neutral-700 dark:text-neutral-300 hover:border-saffron-500/40'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className={`text-[10px] ${isSel ? 'text-black/80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offline & Latency Status */}
          <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-ink-950 border border-neutral-200 dark:border-ink-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-glow-saffron"></span>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">
                  Neural Models Cached
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Bilingual Weights Verified
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-200 dark:border-ink-850 text-xs">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[10px]">Acoustic Model</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">FastConformer-X</span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block text-[10px]">Buffer Cache</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">164 MB (Optimal)</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
              <span>Engine Core</span>
              <span className="font-mono text-neutral-700 dark:text-neutral-300">v2.4 (Bridge Core)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
