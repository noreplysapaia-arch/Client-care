import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Sparkles,
  MessageSquare,
  RefreshCw,
  Send,
  Sliders,
  CheckCircle2,
  Activity,
  ChevronUp,
} from 'lucide-react';
import { AIEmployee } from '../../types';
import { VoiceWaveform } from '../ui/VoiceWaveform';
import { StatusIndicator } from '../ui/StatusIndicator';
import {
  voiceFoundation,
  VoiceDiagnostic,
} from '../../services/voiceFoundation';

interface VoiceTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: AIEmployee;
}

export const VoiceTestModal: React.FC<VoiceTestModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  const [callDuration, setCallDuration] = useState<number>(0);
  const [aiState, setAiState] = useState<'listening' | 'thinking' | 'speaking'>('speaking');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speakerEnabled, setSpeakerEnabled] = useState<boolean>(true);
  const [userInput, setUserInput] = useState<string>('');
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micFrequencyData, setMicFrequencyData] = useState<Uint8Array | undefined>(undefined);

  // Settings drawer & voice controls
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [diagnostics, setDiagnostics] = useState<VoiceDiagnostic | null>(null);

  // Initial greeting helper
  const getInitialGreeting = () => {
    return `Hello! Thank you for calling Client Care by Pramanik Group. My name is ${agent.name}, your ${agent.role}. How can I assist your business today?`;
  };

  const [transcript, setTranscript] = useState<{ speaker: 'ai' | 'customer'; text: string; time: string }[]>([
    {
      speaker: 'ai',
      time: '00:01',
      text: getInitialGreeting(),
    },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Format call duration MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Load diagnostics & available browser voices
  useEffect(() => {
    voiceFoundation.getDiagnostics().then((diag) => {
      setDiagnostics(diag);
    });

    const unsubscribe = voiceFoundation.subscribe((st) => {
      setAvailableVoices(st.voices);
      if (!selectedVoiceName && st.selectedVoiceName) {
        setSelectedVoiceName(st.selectedVoiceName);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, interimTranscript]);

  // Call duration timer
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      return;
    }

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Speech Output via browser voice foundation
  const speakText = (text: string) => {
    if (!speakerEnabled) return;

    setAiState('speaking');
    voiceFoundation.speak({
      text,
      lang: 'en-US',
      voiceName: selectedVoiceName || undefined,
      rate: speechRate,
      pitch: speechPitch,
      onStart: () => {
        setAiState('speaking');
      },
      onEnd: () => {
        setAiState('listening');
      },
      onError: () => {
        setAiState('listening');
      },
    });
  };

  // Initial greeting trigger on open
  useEffect(() => {
    if (isOpen) {
      voiceFoundation.playConnectedChime();
      const greeting = getInitialGreeting();
      setTranscript([
        {
          speaker: 'ai',
          time: '00:01',
          text: greeting,
        },
      ]);
      speakText(greeting);
    } else {
      voiceFoundation.stopSpeaking();
      voiceFoundation.stopListening();
      voiceFoundation.stopMicMonitoring();
      setIsListeningMic(false);
      setInterimTranscript('');
    }
  }, [isOpen, agent]);

  // Handle user response
  const handleSendMessage = (textToSend?: string) => {
    const message = (textToSend || userInput).trim();
    if (!message) return;

    // Barge-in: immediately stop AI speaking
    voiceFoundation.stopSpeaking();

    const newTime = formatTime(callDuration);
    setTranscript((prev) => [...prev, { speaker: 'customer', text: message, time: newTime }]);
    setUserInput('');
    setInterimTranscript('');
    setAiState('thinking');

    // Generate contextual agent response
    setTimeout(() => {
      let aiReply = '';
      const lower = message.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('package')) {
        aiReply = `Our packages start with a completely free MVP tier to explore. For commercial production with dedicated telephone numbers and unlimited voice minutes, our Growth plan starts at $149 per month. What is your estimated monthly call volume?`;
      } else if (
        lower.includes('demo') ||
        lower.includes('meeting') ||
        lower.includes('schedule') ||
        lower.includes('book')
      ) {
        aiReply = `I would be glad to book that for you right now! I have availability tomorrow at 11:00 AM Eastern, or Thursday at 2:00 PM. Which works best for your schedule?`;
      } else if (
        lower.includes('security') ||
        lower.includes('privacy') ||
        lower.includes('safe') ||
        lower.includes('pramanik')
      ) {
        aiReply = `Client Care is designed with strong data privacy controls, encryption in transit and at rest, and zero data sharing for public AI training.`;
      } else if (
        lower.includes('crm') ||
        lower.includes('integrate') ||
        lower.includes('salesforce') ||
        lower.includes('hubspot')
      ) {
        aiReply = `Client Care includes a built-in CRM and lead tracker, with webhook support planned for external platforms.`;
      } else {
        aiReply = `Understood. As your ${agent.role}, I can manage discovery, qualification, and automated follow-ups across all your customer touchpoints. Would you like me to send a summary to your email or book a live walkthrough?`;
      }

      setTranscript((prev) => [
        ...prev,
        { speaker: 'ai', text: aiReply, time: formatTime(callDuration + 2) },
      ]);
      speakText(aiReply);
    }, 650);
  };

  // Toggle Live Microphone Recognition
  const toggleMicrophoneInput = async () => {
    if (isListeningMic) {
      voiceFoundation.stopListening();
      voiceFoundation.stopMicMonitoring();
      setIsListeningMic(false);
      setInterimTranscript('');
      setMicAudioLevel(0);
      setMicFrequencyData(undefined);
      return;
    }

    // Barge-in: cut off AI immediately when user presses mic
    voiceFoundation.stopSpeaking();

    // Start live microphone level monitoring for true waveform reaction
    await voiceFoundation.startMicMonitoring((level, spectrum) => {
      setMicAudioLevel(level);
      setMicFrequencyData(spectrum);
    });

    const started = voiceFoundation.startListening({
      lang: 'en-US',
      interimResults: true,
      onStart: () => {
        setIsListeningMic(true);
        setAiState('listening');
      },
      onInterim: (text) => {
        setInterimTranscript(text);
      },
      onFinal: (spokenText) => {
        setIsListeningMic(false);
        setInterimTranscript('');
        voiceFoundation.stopMicMonitoring();
        setMicAudioLevel(0);
        setMicFrequencyData(undefined);
        handleSendMessage(spokenText);
      },
      onError: (_msg, code) => {
        setIsListeningMic(false);
        setInterimTranscript('');
        voiceFoundation.stopMicMonitoring();
        setMicAudioLevel(0);
        setMicFrequencyData(undefined);
        if (code === 'not-allowed') {
          alert('Microphone permission is required. Please allow microphone access in your browser.');
        }
      },
      onEnd: () => {
        setIsListeningMic(false);
        voiceFoundation.stopMicMonitoring();
        setMicAudioLevel(0);
        setMicFrequencyData(undefined);
      },
    });

    if (!started) {
      alert('Speech recognition is not available in your browser. You can type messages below!');
    }
  };

  // End Call Handler
  const handleEndCall = () => {
    voiceFoundation.stopSpeaking();
    voiceFoundation.stopListening();
    voiceFoundation.stopMicMonitoring();
    voiceFoundation.playEndCallTone();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04060B]/90 backdrop-blur-xl overflow-hidden animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[860px] card-surface rounded-3xl border border-white/[0.12] shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Voice Console Interface */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-7 border-b md:border-b-0 md:border-r border-white/[0.08] relative bg-gradient-to-b from-[#0B0F1D]/90 to-[#070A14]/95 overflow-y-auto">
          {/* Top Engine Diagnostics */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Browser Voice Foundation
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Call Timer */}
                <div className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
                  {formatTime(callDuration)}
                </div>

                {/* Voice Settings Toggle */}
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-xl border transition-all ${
                    showSettings
                      ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                      : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                  title="Voice Engine Settings"
                >
                  <Sliders className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Diagnostics Micro Bar */}
            <div className="flex flex-wrap items-center gap-2 py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Web Speech Synthesis
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Speech Recognition
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-400" /> Web Audio Analyser
              </span>
              {diagnostics && diagnostics.voiceCount > 0 && (
                <span className="ml-auto text-[10px] text-slate-500 font-mono">
                  {diagnostics.voiceCount} voices
                </span>
              )}
            </div>
          </div>

          {/* Collapsible Voice Settings Drawer */}
          {showSettings && (
            <div className="my-3 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.1] space-y-3.5 text-xs text-slate-300 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" /> Voice Synthesis Tuning
                </h5>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* Browser Voice Selector */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Installed Browser Voice</label>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => {
                    setSelectedVoiceName(e.target.value);
                    voiceFoundation.setSelectedVoice(e.target.value);
                  }}
                  className="w-full bg-[#070A14] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Default Recommended Voice</option>
                  {availableVoices.map((v, i) => (
                    <option key={i} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed & Pitch Sliders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Speed / Rate</span>
                    <span className="font-mono text-white">{speechRate.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.3"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Pitch</span>
                    <span className="font-mono text-white">{speechPitch.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.05"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() =>
                    speakText('This is a real browser voice test from Client Care AI.')
                  }
                  className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white font-medium text-[11px] transition-colors cursor-pointer"
                >
                  🔊 Test Audio Sample
                </button>
              </div>
            </div>
          )}

          {/* Center Agent Visual & Waveform */}
          <div className="flex flex-col items-center justify-center text-center my-auto py-4">
            <div className="relative mb-4">
              <div
                className={`absolute -inset-3 rounded-full bg-blue-500/20 blur-md transition-all duration-300 ${
                  aiState === 'speaking' || isListeningMic ? 'scale-110 opacity-100' : 'scale-95 opacity-30'
                }`}
              />
              <img
                src={agent.avatar}
                alt={agent.name}
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-blue-500/40 shadow-2xl"
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full ring-4 ring-[#080B14] flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {agent.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 mb-2.5">
              {agent.role} • Client Care
            </p>

            <div className="mb-4">
              <StatusIndicator
                status={isListeningMic ? 'listening' : aiState === 'thinking' ? 'thinking' : aiState === 'speaking' ? 'speaking' : 'idle'}
                label={
                  isListeningMic
                    ? 'Listening to your microphone...'
                    : aiState === 'thinking'
                    ? 'AI Thinking...'
                    : aiState === 'speaking'
                    ? 'Speaking...'
                    : 'Ready'
                }
                size="md"
              />
            </div>

            {/* Dynamic Waveform with Real Audio Level Support */}
            <div className="w-full max-w-sm px-4 py-3 rounded-2xl bg-[#05070D]/80 border border-white/[0.06] flex flex-col items-center justify-center">
              <VoiceWaveform
                state={isListeningMic ? 'listening' : aiState}
                bars={32}
                height={40}
                color={isListeningMic ? 'emerald' : 'cyan'}
                audioLevel={isListeningMic ? micAudioLevel : undefined}
                frequencyData={isListeningMic ? micFrequencyData : undefined}
              />
              {isListeningMic && micAudioLevel > 0.05 && (
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, micAudioLevel * 200)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Real-time Interim Spoken Words Banner */}
            {isListeningMic && interimTranscript && (
              <div className="mt-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs italic animate-pulse max-w-sm">
                "{interimTranscript}"
              </div>
            )}
          </div>

          {/* Bottom Telephony Controls */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-2.5">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {/* Mute Button */}
              <button
                onClick={() => {
                  const nextMuted = !isMuted;
                  setIsMuted(nextMuted);
                  voiceFoundation.playMuteClick(nextMuted);
                }}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-white/[0.05] border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1]'
                }`}
                title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Speaker Toggle */}
              <button
                onClick={() => {
                  const nextSpeaker = !speakerEnabled;
                  setSpeakerEnabled(nextSpeaker);
                  if (!nextSpeaker) voiceFoundation.stopSpeaking();
                }}
                className={`p-3.5 rounded-2xl border transition-all ${
                  !speakerEnabled
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-white/[0.05] border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1]'
                }`}
                title={speakerEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {speakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>

              {/* Live Microphone Toggle */}
              <button
                onClick={toggleMicrophoneInput}
                className={`px-5 py-3.5 rounded-2xl border flex items-center gap-2 text-xs font-bold transition-all shadow-lg cursor-pointer ${
                  isListeningMic
                    ? 'bg-red-600 text-white border-red-400 animate-pulse shadow-red-600/40'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-cyan-400/30 shadow-blue-600/30'
                }`}
              >
                <Mic className="w-4 h-4" />
                <span>
                  {isListeningMic ? 'Listening... (Click to Finish)' : 'Speak into Mic 🎙️'}
                </span>
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/30 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[11px] text-center text-slate-400">
              Native Web Speech & Web Audio Foundation Active
            </p>
          </div>
        </div>

        {/* Right Side: Live Verbatim Transcript */}
        <div className="w-full md:w-[420px] flex flex-col bg-[#060810] p-5 sm:p-6 justify-between border-t md:border-t-0 md:border-l border-white/[0.08]">
          <div className="pb-3.5 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white">Live Call Transcript</h4>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              Real-Time
            </span>
          </div>

          {/* Transcript stream */}
          <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3 max-h-[380px] md:max-h-none">
            {transcript.map((item, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  item.speaker === 'ai'
                    ? 'bg-blue-950/30 border border-blue-500/20 text-slate-200 mr-4'
                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-300 ml-4'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-1 font-semibold">
                  <span className={item.speaker === 'ai' ? 'text-blue-400' : 'text-slate-400'}>
                    {item.speaker === 'ai' ? `${agent.name} (AI)` : 'You (Customer)'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono">{item.time}</span>
                    {item.speaker === 'ai' && (
                      <button
                        onClick={() => speakText(item.text)}
                        className="text-cyan-400 hover:text-cyan-300 p-0.5 cursor-pointer"
                        title="Replay Audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <p>{item.text}</p>
              </div>
            ))}

            {/* Interim live preview bubble */}
            {isListeningMic && interimTranscript && (
              <div className="p-3 rounded-2xl text-xs bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 ml-4 animate-pulse">
                <div className="text-[10px] text-emerald-400 font-semibold mb-1">
                  Transcribing voice...
                </div>
                <p>"{interimTranscript}"</p>
              </div>
            )}

            <div ref={transcriptEndRef} />
          </div>

          {/* Text input alternative to voice */}
          <div className="pt-3 border-t border-white/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a response to test..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
              <button
                type="submit"
                disabled={!userInput.trim()}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-all flex-shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
              <span>Quick tests: "pricing", "book meeting", "security"</span>
              <button
                onClick={() => setTranscript([transcript[0]])}
                className="text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
