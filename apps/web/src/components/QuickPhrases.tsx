import React from 'react';
import { QUICK_PHRASES } from '../data/translations';

interface QuickPhrasesProps {
  onSelectPhrase: (key: string, promptText: string) => void;
  activeKey?: string;
}

export const QuickPhrases: React.FC<QuickPhrasesProps> = ({
  onSelectPhrase,
  activeKey,
}) => {
  return (
    <div className="w-full flex flex-col gap-1.5 py-1">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
          Helpful Inquiries
        </span>
        <span className="text-[10px] text-saffron-600 dark:text-saffron-400 font-medium">
          Tap to speak
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {QUICK_PHRASES.map((phrase) => {
          const isSelected = activeKey === phrase.key;
          return (
            <button
              key={phrase.key}
              onClick={() => onSelectPhrase(phrase.key, phrase.englishPrompt)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border ${
                isSelected
                  ? 'bg-saffron-500 text-black border-saffron-400 font-semibold shadow-glow-saffron'
                  : 'bg-white/90 dark:bg-ink-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-ink-800 hover:border-saffron-500/40 hover:bg-neutral-50 dark:hover:bg-ink-850'
              }`}
            >
              {phrase.englishPrompt}
            </button>
          );
        })}
      </div>
    </div>
  );
};
