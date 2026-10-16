import React from 'react';
import { getLanguageByCode } from '../data/languages';
import type { TranslationMode } from '../types';

interface HeaderProps {
  sourceLang: string;
  targetLang: string;
  onOpenLanguagePicker: (target: 'source' | 'target') => void;
  onSwapLanguages: () => void;
  mode: TranslationMode;
  onModeChange: (m: TranslationMode) => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  tableMode: boolean;
  onToggleTableMode: () => void;
  backendOnline?: boolean;
  backendMode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  sourceLang,
  targetLang,
  onOpenLanguagePicker,
  onSwapLanguages,
  mode,
  onModeChange,
  onOpenSettings,
  theme,
  onToggleTheme,
  tableMode,
  onToggleTableMode,
  backendOnline = false,
  backendMode,
}) => {
  const src = getLanguageByCode(sourceLang);
  const tgt = getLanguageByCode(targetLang);

  return (
    <header className="w-full flex flex-col gap-3 pb-2 pt-1 border-b border-white/5 dark:border-white/10 select-none">
      {/* Top row */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 dark:text-neutral-300"
            title="Dialect & Engine Settings"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-semibold tracking-wide text-neutral-900 dark:text-white flex items-center gap-1.5">
              Vaani Setu <span className="text-saffron-500 font-medium">Live</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
                title={backendOnline ? `Backend Connected (${backendMode || 'Active'})` : 'Local Standalone Mode'}
              ></span>
            </h1>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full uppercase tracking-wider font-semibold ${
                backendOnline
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
              }`}
            >
              {backendOnline ? 'API Connected' : 'Standalone'}
            </span>
          </div>
        </div>

        {/* Right actions: Table Face-to-Face, Theme, Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleTableMode}
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
              tableMode
                ? 'bg-saffron-500 text-black font-semibold shadow-glow-saffron'
                : 'bg-neutral-200 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-ink-700'
            }`}
            title="Turn 180° Face-to-Face Mode (Split screen for table talk)"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">180° Table</span>
          </button>

          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-full bg-neutral-200 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-ink-700 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-saffron-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" strokeWidth="2" />
                <path strokeWidth="2" strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-full bg-neutral-200 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-ink-700 transition-colors"
            title="Dialect Settings"
            aria-label="Settings"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Language pair bar matching reference */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Source Language Button */}
        <button
          onClick={() => onOpenLanguagePicker('source')}
          className="flex-1 py-2 px-3 rounded-xl bg-white/70 dark:bg-ink-900 border border-neutral-300 dark:border-ink-700/80 hover:border-saffron-500/50 flex items-center justify-between transition-all group shadow-sm text-left"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Channel A
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span>
              <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {src.nativeName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                ({src.englishName})
              </span>
            </div>
          </div>
          <svg className="w-4 h-4 text-neutral-400 group-hover:text-saffron-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Swap Button */}
        <button
          onClick={onSwapLanguages}
          className="p-2.5 rounded-full bg-saffron-500/10 dark:bg-ink-800 text-saffron-600 dark:text-saffron-400 border border-saffron-500/30 hover:bg-saffron-500 hover:text-black transition-all shadow-sm active:scale-95"
          title="Swap Languages"
          aria-label="Swap source and target languages"
        >
          <svg className="w-4 h-4 transition-transform active:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Target Language Button */}
        <button
          onClick={() => onOpenLanguagePicker('target')}
          className="flex-1 py-2 px-3 rounded-xl bg-white/70 dark:bg-ink-900 border border-neutral-300 dark:border-ink-700/80 hover:border-saffron-500/50 flex items-center justify-between transition-all group shadow-sm text-left"
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-neutral-500 dark:text-neutral-400 tracking-wider">
              Channel B
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500"></span>
              <span className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                {tgt.nativeName}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                ({tgt.englishName})
              </span>
            </div>
          </div>
          <svg className="w-4 h-4 text-neutral-400 group-hover:text-saffron-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Mode toggle pills: Text | Voice | Both */}
      <div className="flex justify-center">
        <div className="inline-flex p-0.5 rounded-full bg-neutral-200/90 dark:bg-ink-900/90 border border-neutral-300/80 dark:border-ink-700/60 shadow-inner">
          {(['text', 'voice', 'both'] as TranslationMode[]).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`px-4 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                mode === m
                  ? 'bg-saffron-500 text-black shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
