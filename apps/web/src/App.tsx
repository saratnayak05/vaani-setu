import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ConversationCard } from './components/ConversationCard';
import { QuickPhrases } from './components/QuickPhrases';
import { MicController } from './components/MicController';
import { LanguageModal } from './components/LanguageModal';
import { SettingsModal } from './components/SettingsModal';
import { TextInputModal } from './components/TextInputModal';
import type { AppSettings, ConversationTurn, TranslationMode, VoiceGender, SpeechSpeed } from './types';
import { getLanguageByCode } from './data/languages';
import { QUICK_PHRASES, translateText } from './data/translations';

export const App: React.FC = () => {
  // Theme & Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'dark',
    mode: 'both',
    interfaceLang: 'od-IN',
    voiceGender: 'female',
    speechSpeed: '1.0x',
    autoDetectAcoustic: true,
    tableFaceToFaceMode: false,
  });

  // Language pair (defaults match the screenshot: Odia <-> Tamil)
  const [sourceLang, setSourceLang] = useState<string>('od-IN');
  const [targetLang, setTargetLang] = useState<string>('ta-IN');

  // Modals
  const [langPickerTarget, setLangPickerTarget] = useState<'source' | 'target' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTextInputOpen, setIsTextInputOpen] = useState(false);

  // Active quick phrase
  const [activePhraseKey, setActivePhraseKey] = useState<string>('bus_stand');

  // Recording & playback state
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAudioPlaying1, setIsAudioPlaying1] = useState(false);
  const [isAudioPlaying2, setIsAudioPlaying2] = useState(false);
  const [latencySeconds, setLatencySeconds] = useState(0.31);

  // Audio Context ref for rich synthesis
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Active conversation turns matching screenshot
  const [turn1, setTurn1] = useState<ConversationTurn>({
    id: 'turn-1',
    speaker: 'speaker1',
    langCode: 'od-IN',
    nativeText: 'କୁ ବସ୍ ଷ୍ଟାଣ୍ଡ କେଉଁଠାରେ ଅଛି?',
    phoneticText: 'Bus stand kouthare achhi?',
    timestamp: '10:42 AM',
    latencySeconds: 0.12,
  });

  const [turn2, setTurn2] = useState<ConversationTurn>({
    id: 'turn-2',
    speaker: 'speaker2',
    langCode: 'ta-IN',
    nativeText: 'பேருந்து நிலையம் எங்கே உள்ளது?',
    phoneticText: 'Perunthu nilaiyam enge ullathu?',
    timestamp: '10:42 AM',
    latencySeconds: 0.31,
  });

  // Keep theme class in sync with document root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  // Audio synthesis helper
  const playSynthesizedAudio = (text: string, langCode: string, onDone?: () => void) => {
    if (!('speechSynthesis' in window)) {
      playFallbackTone();
      if (onDone) setTimeout(onDone, 800);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;

      // Rate from speechSpeed
      const speedMap: Record<SpeechSpeed, number> = {
        '0.75x': 0.75,
        '1.0x': 1.0,
        '1.25x': 1.25,
      };
      utterance.rate = speedMap[settings.speechSpeed] || 1.0;

      // Pitch from gender
      utterance.pitch = settings.voiceGender === 'female' ? 1.2 : 0.85;

      utterance.onend = () => {
        if (onDone) onDone();
      };
      utterance.onerror = () => {
        playFallbackTone();
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      playFallbackTone();
      if (onDone) setTimeout(onDone, 800);
    }
  };

  const playFallbackTone = () => {
    try {
      const ctx = audioCtxRef.current || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(settings.voiceGender === 'female' ? 520 : 330, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  };

  // Play audio for a card
  const handlePlayAudio = (turn: ConversationTurn) => {
    if (turn.speaker === 'speaker1') {
      setIsAudioPlaying1(true);
      playSynthesizedAudio(turn.nativeText, turn.langCode, () => {
        setIsAudioPlaying1(false);
      });
    } else {
      setIsAudioPlaying2(true);
      playSynthesizedAudio(turn.nativeText, turn.langCode, () => {
        setIsAudioPlaying2(false);
      });
    }
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    const prevSrc = sourceLang;
    const prevTgt = targetLang;
    setSourceLang(prevTgt);
    setTargetLang(prevSrc);

    // Swap content in turns
    setTurn1((prev) => ({
      ...prev,
      langCode: prevTgt,
      nativeText: turn2.nativeText,
      phoneticText: turn2.phoneticText,
    }));

    setTurn2((prev) => ({
      ...prev,
      langCode: prevSrc,
      nativeText: turn1.nativeText,
      phoneticText: turn1.phoneticText,
    }));
  };

  // Swap Speakers / Turn Taking
  const handleSwapTurn = () => {
    handleSwapLanguages();
  };

  // Select Quick Phrase
  const handleSelectPhrase = (key: string) => {
    setActivePhraseKey(key);
    const phrase = QUICK_PHRASES.find((p) => p.key === key);
    if (!phrase) return;

    const t1 = phrase.translations[sourceLang] || phrase.translations['od-IN'] || {
      native: phrase.englishPrompt,
      phonetic: phrase.englishPrompt,
    };
    const t2 = phrase.translations[targetLang] || phrase.translations['ta-IN'] || {
      native: phrase.englishPrompt,
      phonetic: phrase.englishPrompt,
    };

    const newLatency = Number((0.26 + Math.random() * 0.12).toFixed(2));
    setLatencySeconds(newLatency);

    setTurn1({
      id: `turn-${Date.now()}-1`,
      speaker: 'speaker1',
      langCode: sourceLang,
      nativeText: t1.native,
      phoneticText: t1.phonetic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latencySeconds: 0.11,
    });

    setTurn2({
      id: `turn-${Date.now()}-2`,
      speaker: 'speaker2',
      langCode: targetLang,
      nativeText: t2.native,
      phoneticText: t2.phonetic,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latencySeconds: newLatency,
    });

    // If voice mode or both mode is enabled, play the translation
    if (settings.mode !== 'text') {
      setIsAudioPlaying2(true);
      playSynthesizedAudio(t2.native, targetLang, () => {
        setIsAudioPlaying2(false);
      });
    }
  };

  // Manual Text Input Submission
  const handleTextSubmit = (customText: string) => {
    setIsProcessing(true);
    const translated = translateText(customText, sourceLang, targetLang);
    const newLatency = Number((0.28 + Math.random() * 0.1).toFixed(2));
    setLatencySeconds(newLatency);

    setTimeout(() => {
      setIsProcessing(false);
      setTurn1({
        id: `turn-${Date.now()}-1`,
        speaker: 'speaker1',
        langCode: sourceLang,
        nativeText: customText,
        phoneticText: customText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencySeconds: 0.1,
      });

      setTurn2({
        id: `turn-${Date.now()}-2`,
        speaker: 'speaker2',
        langCode: targetLang,
        nativeText: translated.native,
        phoneticText: translated.phonetic,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latencySeconds: newLatency,
      });

      if (settings.mode !== 'text') {
        setIsAudioPlaying2(true);
        playSynthesizedAudio(translated.native, targetLang, () => {
          setIsAudioPlaying2(false);
        });
      }
    }, 450);
  };

  // Microphone toggle with browser SpeechRecognition or simulation
  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);

      const phrases = QUICK_PHRASES;
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      handleSelectPhrase(randomPhrase.key);
      setIsProcessing(false);
      return;
    }

    // Start recording
    setIsRecording(true);

    // Check if webkitSpeechRecognition is available
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (SpeechRecognition as any)();
        recognition.lang = sourceLang;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          setIsRecording(false);
          handleTextSubmit(spoken);
        };

        recognition.onerror = () => {
          // If error or cancelled, simulate smooth fallback
          setTimeout(() => {
            setIsRecording(false);
            const randomPhrase = QUICK_PHRASES[Math.floor(Math.random() * QUICK_PHRASES.length)];
            handleSelectPhrase(randomPhrase.key);
          }, 2000);
        };

        recognition.start();
        return;
      } catch {
        // Recognition fallback
      }
    }

    // Default simulated listening for 2.2 seconds
    setTimeout(() => {
      setIsRecording(false);
      const randomPhrase = QUICK_PHRASES[Math.floor(Math.random() * QUICK_PHRASES.length)];
      handleSelectPhrase(randomPhrase.key);
    }, 2200);
  };

  // Test voice in settings
  const handleTestVoice = (gender: VoiceGender, speed: SpeechSpeed) => {
    const sampleText =
      gender === 'female'
        ? 'ନମସ୍କାର, ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିପାରିବି କି?'
        : 'வணக்கம், நான் உங்களுக்கு உதவலாமா?';
    const lang = gender === 'female' ? 'od-IN' : 'ta-IN';

    if (!('speechSynthesis' in window)) {
      playFallbackTone();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(sampleText);
      u.lang = lang;
      const speedMap: Record<SpeechSpeed, number> = {
        '0.75x': 0.75,
        '1.0x': 1.0,
        '1.25x': 1.25,
      };
      u.rate = speedMap[speed] || 1.0;
      u.pitch = gender === 'female' ? 1.2 : 0.85;
      window.speechSynthesis.speak(u);
    } catch {
      playFallbackTone();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between transition-colors duration-300 ${
        settings.theme === 'dark'
          ? 'bg-ink-950 text-white selection:bg-saffron-500 selection:text-black'
          : 'bg-parchment-50 text-neutral-900 selection:bg-saffron-500 selection:text-black'
      }`}
    >
      {/* Container simulating mobile frame or elegant full-width centered card */}
      <main className="w-full max-w-md min-h-screen flex flex-col justify-between px-3 sm:px-4 py-2 sm:py-3 relative">
        {/* Top Header */}
        <Header
          sourceLang={sourceLang}
          targetLang={targetLang}
          onOpenLanguagePicker={(target) => setLangPickerTarget(target)}
          onSwapLanguages={handleSwapLanguages}
          mode={settings.mode}
          onModeChange={(m) => setSettings({ ...settings, mode: m })}
          onOpenSettings={() => setIsSettingsOpen(true)}
          theme={settings.theme}
          onToggleTheme={() =>
            setSettings({
              ...settings,
              theme: settings.theme === 'dark' ? 'light' : 'dark',
            })
          }
          tableMode={settings.tableFaceToFaceMode}
          onToggleTableMode={() =>
            setSettings({
              ...settings,
              tableFaceToFaceMode: !settings.tableFaceToFaceMode,
            })
          }
        />

        {/* Live Conversation Display */}
        <ConversationCard
          turn1={turn1}
          turn2={turn2}
          onPlayAudio={handlePlayAudio}
          isAudioPlaying1={isAudioPlaying1}
          isAudioPlaying2={isAudioPlaying2}
          tableMode={settings.tableFaceToFaceMode}
        />

        {/* Bottom Section: Quick Inquiries & Glowing Acoustic Controller */}
        <div className="w-full flex flex-col gap-2">
          <QuickPhrases
            onSelectPhrase={handleSelectPhrase}
            activeKey={activePhraseKey}
          />

          <MicController
            isRecording={isRecording}
            isProcessing={isProcessing}
            onToggleRecording={handleToggleRecording}
            onOpenTextInput={() => setIsTextInputOpen(true)}
            onSwapTurn={handleSwapTurn}
            latencySeconds={latencySeconds}
          />
        </div>
      </main>

      {/* Language Picker Bottom Sheet Modal */}
      <LanguageModal
        isOpen={langPickerTarget !== null}
        onClose={() => setLangPickerTarget(null)}
        selectedCode={langPickerTarget === 'source' ? sourceLang : targetLang}
        onSelectLanguage={(code) => {
          if (langPickerTarget === 'source') {
            setSourceLang(code);
            setTurn1((prev) => ({ ...prev, langCode: code }));
          } else {
            setTargetLang(code);
            setTurn2((prev) => ({ ...prev, langCode: code }));
          }
        }}
        targetRole={langPickerTarget || 'source'}
        autoDetect={settings.autoDetectAcoustic}
        onToggleAutoDetect={(val) =>
          setSettings({ ...settings, autoDetectAcoustic: val })
        }
      />

      {/* Dialect Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) =>
          setSettings((prev) => ({ ...prev, ...newVals }))
        }
        onTestVoice={handleTestVoice}
      />

      {/* Keyboard Text Input Modal */}
      <TextInputModal
        isOpen={isTextInputOpen}
        onClose={() => setIsTextInputOpen(false)}
        onSubmit={handleTextSubmit}
        langName={getLanguageByCode(sourceLang).englishName}
      />
    </div>
  );
};

export default App;
