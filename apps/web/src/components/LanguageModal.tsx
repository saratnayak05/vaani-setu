import React, { useState } from 'react';
import { ALL_LANGUAGES, RECENT_LANGUAGES, PINNED_LANGUAGES } from '../data/languages';
import type { LanguageMeta } from '../types';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCode: string;
  onSelectLanguage: (code: string) => void;
  targetRole: 'source' | 'target';
  autoDetect: boolean;
  onToggleAutoDetect: (v: boolean) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedCode,
  onSelectLanguage,
  targetRole,
  autoDetect,
  onToggleAutoDetect,
}) => {
  const [search, setSearch] = useState('');
  const [bilingualMode, setBilingualMode] = useState<'auto' | 'manual'>('auto');

  if (!isOpen) return null;

  const filtered = ALL_LANGUAGES.filter((lang) => {
    const q = search.toLowerCase();
    return (
      lang.englishName.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.family.toLowerCase().includes(q) ||
      lang.script.toLowerCase().includes(q)
    );
  });

  const recentList = ALL_LANGUAGES.filter((l) => RECENT_LANGUAGES.includes(l.code));
  const pinnedList = ALL_LANGUAGES.filter((l) => PINNED_LANGUAGES.includes(l.code));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm transition-opacity">
      <div
        className="w-full max-w-md max-h-[90vh] flex flex-col bg-white dark:bg-ink-900 rounded-t-3xl sm:rounded-3xl border border-neutral-200 dark:border-ink-700/80 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-ink-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              Choose Language
              <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-600 dark:text-saffron-400 font-medium">
                {targetRole === 'source' ? 'Speaker 1 (Source)' : 'Speaker 2 (Target)'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual Auto / Manual toggle */}
            <div className="inline-flex p-0.5 rounded-full bg-neutral-100 dark:bg-ink-800 text-[11px] font-semibold">
              <button
                onClick={() => setBilingualMode('auto')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  bilingualMode === 'auto'
                    ? 'bg-saffron-500 text-black shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Bilingual Auto
              </button>
              <button
                onClick={() => setBilingualMode('manual')}
                className={`px-2.5 py-0.5 rounded-full transition-all ${
                  bilingualMode === 'manual'
                    ? 'bg-saffron-500 text-black shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Manual
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-ink-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-3.5 border-b border-neutral-100 dark:border-ink-800">
          <div className="relative">
            <svg className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language or script..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-neutral-100 dark:bg-ink-800 border border-neutral-200 dark:border-ink-700/80 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-saffron-500"
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
          {/* Recent Recitations */}
          {!search && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                  Recent Recitations
                </span>
                <span className="text-[10px] text-neutral-400 font-medium">Last used</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {recentList.map((lang) => {
                  const isSel = selectedCode === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSel
                          ? 'bg-saffron-500/15 border-saffron-500 text-saffron-600 dark:text-saffron-400 font-bold shadow-sm'
                          : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/70 hover:border-saffron-500/50 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="text-base font-bold font-indic mb-0.5">{lang.nativeName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{lang.englishName}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pinned Scripts / Favorites */}
          {!search && (
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-2">
                ★ Favorites & Pinned
              </span>
              <div className="grid grid-cols-3 gap-2">
                {pinnedList.map((lang) => {
                  const isSel = selectedCode === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        onClose();
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSel
                          ? 'bg-saffron-500/15 border-saffron-500 text-saffron-600 dark:text-saffron-400 font-bold shadow-sm'
                          : 'bg-neutral-50 dark:bg-ink-850 border-neutral-200 dark:border-ink-700/70 hover:border-saffron-500/50 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="text-base font-bold font-indic mb-0.5">{lang.nativeName}</div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">{lang.englishName}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All Acoustic Channels */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                All Acoustic Channels
              </span>
              <span className="text-[10px] text-saffron-500 font-medium">
                {filtered.length} Available
              </span>
            </div>

            {/* Auto Detect toggle item */}
            <div
              onClick={() => onToggleAutoDetect(!autoDetect)}
              className="p-3 mb-2 rounded-xl border border-saffron-500/30 bg-saffron-500/5 dark:bg-saffron-500/10 flex items-center justify-between cursor-pointer hover:bg-saffron-500/15 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center text-black font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white">
                    Auto-Detect Acoustic
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    Intelligent voice signature switch
                  </div>
                </div>
              </div>
              <div
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  autoDetect ? 'bg-saffron-500' : 'bg-neutral-300 dark:bg-ink-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    autoDetect ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* Languages List */}
            <div className="space-y-1.5">
              {filtered.map((lang: LanguageMeta) => {
                const isSelected = selectedCode === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-saffron-500/15 border-saffron-500 text-neutral-900 dark:text-white shadow-sm'
                        : 'bg-white dark:bg-ink-850 border-neutral-200 dark:border-ink-700/60 hover:border-saffron-500/40 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-bold font-indic min-w-[3.5rem]">
                        {lang.nativeName}
                      </span>
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>{lang.englishName}</span>
                          {lang.beta && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-semibold uppercase">
                              Beta
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {lang.family} • {lang.speakers}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-saffron-500 bg-saffron-500 text-black'
                          : 'border-neutral-400 dark:border-ink-600'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
