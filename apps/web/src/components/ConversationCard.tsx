import React, { useState } from 'react';
import type { ConversationTurn } from '../types';
import { getLanguageByCode } from '../data/languages';

interface ConversationCardProps {
  turn1: ConversationTurn;
  turn2: ConversationTurn;
  onPlayAudio: (turn: ConversationTurn) => void;
  isAudioPlaying1?: boolean;
  isAudioPlaying2?: boolean;
  tableMode?: boolean;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  turn1,
  turn2,
  onPlayAudio,
  isAudioPlaying1,
  isAudioPlaying2,
  tableMode = false,
}) => {
  const lang1 = getLanguageByCode(turn1.langCode);
  const lang2 = getLanguageByCode(turn2.langCode);

  const [copied1, setCopied1] = useState(false);
  const [copied2, setCopied2] = useState(false);
  const [flip180Card2, setFlip180Card2] = useState(false);

  const handleCopy = (text: string, setFn: (v: boolean) => void) => {
    navigator.clipboard?.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3.5 w-full my-auto py-2">
      {/* Speaker 1 Card (Local Speaker) */}
      <div
        className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 relative border ${
          tableMode ? 'rotate-180' : ''
        } bg-white dark:bg-ink-900/90 border-neutral-200 dark:border-ink-700/80 shadow-md dark:shadow-card-dark`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-saffron-500 shadow-glow-saffron"></span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              LOCAL SPEAKER • {lang1.englishName}
            </span>
          </div>
          <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">
            {turn1.timestamp}
          </span>
        </div>

        {/* Native script text */}
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-neutral-900 dark:text-white leading-relaxed mb-1.5 font-indic">
          {turn1.nativeText}
        </div>

        {/* Romanized phonetic transcript */}
        <div className="text-xs sm:text-sm font-medium italic text-neutral-600 dark:text-neutral-400 mb-3">
          "{turn1.phoneticText}"
        </div>

        {/* Action icons bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-ink-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayAudio(turn1)}
              className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isAudioPlaying1
                  ? 'bg-saffron-500 text-black shadow-glow-saffron'
                  : 'bg-neutral-100 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-ink-700'
              }`}
              title="Play audio playback"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>{isAudioPlaying1 ? 'Playing...' : 'Tap to listen'}</span>
            </button>

            <button
              onClick={() => handleCopy(turn1.nativeText, setCopied1)}
              className="p-2 rounded-full bg-neutral-100 dark:bg-ink-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Copy text"
            >
              {copied1 ? (
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
            Direct STT
          </span>
        </div>
      </div>

      {/* Acoustic Bridge Indicator */}
      <div className="flex items-center justify-center gap-3 px-4 py-0.5">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent"></div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-600 dark:text-saffron-400 text-[11px] font-semibold tracking-wide">
          <span className="inline-block animate-pulse">⚡</span>
          <span>Dual Acoustic Interpolation</span>
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent"></div>
      </div>

      {/* Speaker 2 Card (Remote Speaker - Target Language) */}
      <div
        className={`w-full rounded-2xl p-4 sm:p-5 transition-all duration-300 relative border ${
          flip180Card2 ? 'rotate-180' : ''
        } bg-white dark:bg-ink-900/90 border-neutral-200 dark:border-ink-700/80 shadow-md dark:shadow-card-dark`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-glow-saffron"></span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              REMOTE SPEAKER • {lang2.englishName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFlip180Card2(!flip180Card2)}
              className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-neutral-100 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:text-saffron-500 flex items-center gap-1"
              title="Flip 180° for person facing you across table"
            >
              <span>Turn 180°</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Native script text */}
        <div className="text-xl sm:text-2xl font-bold tracking-wide text-neutral-900 dark:text-white leading-relaxed mb-1.5 font-indic">
          {turn2.nativeText}
        </div>

        {/* Romanized phonetic transcript */}
        <div className="text-xs sm:text-sm font-medium italic text-neutral-600 dark:text-neutral-400 mb-3">
          "{turn2.phoneticText}"
        </div>

        {/* Action icons bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-ink-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlayAudio(turn2)}
              className={`p-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold ${
                isAudioPlaying2
                  ? 'bg-saffron-500 text-black shadow-glow-saffron'
                  : 'bg-neutral-100 dark:bg-ink-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-ink-700'
              }`}
              title="Play audio playback"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <span>{isAudioPlaying2 ? 'Synthesizing...' : 'Tap to replay'}</span>
            </button>

            <button
              onClick={() => handleCopy(turn2.nativeText, setCopied2)}
              className="p-2 rounded-full bg-neutral-100 dark:bg-ink-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              title="Copy text"
            >
              {copied2 ? (
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-mono text-saffron-500/90 bg-saffron-500/10 px-2 py-0.5 rounded-full border border-saffron-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{turn2.latencySeconds.toFixed(2)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
