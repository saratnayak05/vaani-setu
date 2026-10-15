import React from 'react';

interface MicControllerProps {
  isRecording: boolean;
  isProcessing: boolean;
  onToggleRecording: () => void;
  onOpenTextInput: () => void;
  onSwapTurn: () => void;
  latencySeconds: number;
}

export const MicController: React.FC<MicControllerProps> = ({
  isRecording,
  isProcessing,
  onToggleRecording,
  onOpenTextInput,
  onSwapTurn,
  latencySeconds,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-3 pt-2 pb-3">
      {/* 3 Action Buttons row */}
      <div className="w-full flex items-center justify-around max-w-xs px-2">
        {/* Left: Keyboard input */}
        <button
          onClick={onOpenTextInput}
          className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-white dark:bg-ink-900 border border-neutral-300 dark:border-ink-700/80 text-neutral-600 dark:text-neutral-300 hover:text-saffron-500 hover:border-saffron-500/50 transition-all shadow-sm active:scale-95"
          title="Type text directly"
          aria-label="Text input mode"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] font-semibold mt-0.5">Type</span>
        </button>

        {/* Center: Glowing Saffron Microphone Button */}
        <div className="relative flex items-center justify-center">
          {/* Pulsing ring waves when recording */}
          {isRecording && (
            <>
              <div className="absolute w-24 h-24 rounded-full bg-saffron-500/30 animate-ping pointer-events-none"></div>
              <div className="absolute w-20 h-20 rounded-full bg-saffron-400/40 animate-pulse pointer-events-none"></div>
            </>
          )}

          <button
            onClick={onToggleRecording}
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 relative z-10 active:scale-90 ${
              isRecording
                ? 'bg-rose-500 text-white shadow-lg ring-4 ring-rose-400/40'
                : isProcessing
                ? 'bg-amber-400 text-black animate-pulse shadow-glow-saffron'
                : 'bg-gradient-to-tr from-saffron-600 to-saffron-400 text-black shadow-glow-saffron-lg hover:brightness-105'
            }`}
            title={isRecording ? 'Tap to stop recording' : 'Tap to speak'}
            aria-label="Microphone"
          >
            {isRecording ? (
              // Live sound wave bars
              <div className="flex items-center gap-1 h-7">
                <span className="w-1 bg-white rounded-full h-3 animate-pulse"></span>
                <span className="w-1 bg-white rounded-full h-6 animate-pulse delay-75"></span>
                <span className="w-1.5 bg-white rounded-full h-8 animate-pulse delay-150"></span>
                <span className="w-1 bg-white rounded-full h-5 animate-pulse delay-100"></span>
                <span className="w-1 bg-white rounded-full h-3 animate-pulse delay-200"></span>
              </div>
            ) : isProcessing ? (
              <svg className="w-7 h-7 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-neutral-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Right: Swap turn */}
        <button
          onClick={onSwapTurn}
          className="w-12 h-12 rounded-full flex flex-col items-center justify-center bg-white dark:bg-ink-900 border border-neutral-300 dark:border-ink-700/80 text-neutral-600 dark:text-neutral-300 hover:text-saffron-500 hover:border-saffron-500/50 transition-all shadow-sm active:scale-95"
          title="Swap Speaker Turn"
          aria-label="Turn taking switch"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <span className="text-[9px] font-semibold mt-0.5">Turn</span>
        </button>
      </div>

      {/* Latency badge */}
      <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Measured Latency: <strong className="text-neutral-800 dark:text-neutral-200">{latencySeconds.toFixed(2)}s</strong></span>
      </div>
    </div>
  );
};
