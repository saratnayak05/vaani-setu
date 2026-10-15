import React, { useState } from 'react';

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  langName: string;
}

export const TextInputModal: React.FC<TextInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  langName,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSubmit(inputText.trim());
    setInputText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-ink-900 rounded-2xl border border-neutral-200 dark:border-ink-700/80 shadow-2xl p-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Type Input</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
              {langName}
            </span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            autoFocus
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Type in ${langName} or phonetic English...`}
            className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-ink-800 border border-neutral-200 dark:border-ink-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-saffron-500 text-sm"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-ink-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-saffron-500 text-black hover:bg-saffron-400 disabled:opacity-40 transition-colors shadow-glow-saffron"
            >
              Translate & Synthesize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
