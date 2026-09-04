import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  Volume2,
  VolumeX,
  ChevronDown,
  CheckCircle2,
  MessageSquare,
  Send,
  Headphones,
  Search,
} from 'lucide-react';
import { Conversation } from '@elevenlabs/client';
import { playBangladeshiRingback, RingbackController } from '../../services/ringbackToneService';
import {
  banglaVoice,
  BANGLA_VOICES,
  BanglaVoicePersona,
  getBanglaAIResponse,
} from '../../services/banglaVoiceService';
import { voiceFoundation } from '../../services/voiceFoundation';
import { VoiceWaveform } from '../ui/VoiceWaveform';
import { addCall } from '../../services/firebase';
import { AICall } from '../../types';
import { COUNTRIES, DEFAULT_COUNTRY, CountryCode } from '../../data/countryCodes';

// ElevenLabs Agent Configuration
const ELEVENLABS_AGENT_ID =
  (import.meta.env.VITE_ELEVENLABS_AGENT_ID as string) ||
  'agent_5601m1p2507mf4e83sthvkkepmbx';

interface BanglaLiveCallWidgetProps {
  initialName?: string;
  initialPhone?: string;
  initialEmail?: string;
  initialWebsite?: string;
  onCallEnded?: () => void;
  variant?: 'card' | 'hero' | 'floating';
  className?: string;
}

export const BanglaLiveCallWidget: React.FC<BanglaLiveCallWidgetProps> = ({
  initialName = '',
  initialPhone = '',
  initialEmail = '',
  initialWebsite = '',
  onCallEnded,
  className = '',
}) => {
  // Form input states
  const [fullName, setFullName] = useState<string>(initialName);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [email, setEmail] = useState<string>(initialEmail);
  const [website, setWebsite] = useState<string>(initialWebsite);

  // Country code selector state (defaults to Bangladesh +880)
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    if (isCountryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Construct full phone number with country dial code
  const getFullPhoneNumber = () => {
    if (!phone.trim()) return '';
    let cleaned = phone.trim();
    if (selectedCountry.code === 'BD' && cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    return `${selectedCountry.dialCode} ${cleaned}`;
  };

  // Filtered countries for the dropdown
  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Call status: 'idle' -> 'ringing' -> 'connected' -> 'idle'
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);

  // Audio controls
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [interimSpokenText, setInterimSpokenText] = useState<string>('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micFrequencyData, setMicFrequencyData] = useState<Uint8Array | undefined>(undefined);

  // Bangladeshi Ringback & ElevenLabs Session references
  const ringbackRef = useRef<RingbackController | null>(null);
  const elevenLabsSessionRef = useRef<any>(null);

  // Selected persona
  const [selectedVoice, setSelectedVoice] = useState<BanglaVoicePersona>(BANGLA_VOICES[0]);
  const [showVoicePicker, setShowVoicePicker] = useState<boolean>(false);

  // Conversation transcript
  const [transcript, setTranscript] = useState<
    { id: string; speaker: 'ai' | 'user'; text: string; time: string }[]
  >([]);
  const [customInputText, setCustomInputText] = useState<string>('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Clean up ringback and ElevenLabs session on component unmount
  useEffect(() => {
    return () => {
      if (ringbackRef.current) {
        ringbackRef.current.stop();
        ringbackRef.current = null;
      }
      if (elevenLabsSessionRef.current) {
        elevenLabsSessionRef.current.endSession().catch(() => {});
        elevenLabsSessionRef.current = null;
      }
      banglaVoice.stopSpeaking();
      voiceFoundation.stopListening();
      voiceFoundation.stopMicMonitoring();
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Call duration counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Trigger AI Speech Output (used for local replay or fallback)
  const speakAI = (text: string) => {
    if (!isSpeakerOn) return;

    setIsSpeaking(true);
    banglaVoice.playBanglaSpeech(
      text,
      selectedVoice.id,
      () => {
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
      },
      () => {
        setIsSpeaking(false);
      }
    );
  };

  // Start Call Handler
  const handleStartCall = async () => {
    if (callStatus !== 'idle') return;

    // 1. Transition UI status to "ringing"
    setCallStatus('ringing');

    // 2. Play realistic Bangladeshi mobile operator dual-tone ringback ("টুট...টুট...")
    if (ringbackRef.current) {
      ringbackRef.current.stop();
    }
    ringbackRef.current = playBangladeshiRingback();

    try {
      const cleanName = fullName.trim().split(' ')[0] || 'there';

      // 3. Connect ElevenLabs Conversational AI Agent
      const session = await Conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        dynamicVariables: {
          user_name: fullName.trim() || 'Valued Caller',
          phone_number: getFullPhoneNumber() || '',
          email: email.trim() || '',
          company: website.trim() || '',
        },
        onConnect: ({ conversationId }) => {
          console.log('ElevenLabs connected with session ID:', conversationId);
          // Dual-tone ringback stops immediately upon connection
          if (ringbackRef.current) {
            ringbackRef.current.stop();
            ringbackRef.current = null;
          }
          setCallStatus('connected');
          banglaVoice.playConnectedChime();

          const greetingText = `Hello ${cleanName}! Thank you for calling Client Care AI. My name is ${selectedVoice.name}. How can I assist your business with customer support and sales automation today?`;
          setTranscript((prev) =>
            prev.length === 0
              ? [
                  {
                    id: `msg_${Date.now()}`,
                    speaker: 'ai' as const,
                    text: greetingText,
                    time: '00:01',
                  },
                ]
              : prev
          );
        },
        onDisconnect: (details) => {
          console.log('ElevenLabs disconnected:', details);
          // Ringback stops on disconnect so it never gets stuck
          if (ringbackRef.current) {
            ringbackRef.current.stop();
            ringbackRef.current = null;
          }
          elevenLabsSessionRef.current = null;
          handleEndCall();
        },
        onError: (message, context) => {
          console.error('ElevenLabs session error:', message, context);
          // Ringback stops on error so it never gets stuck
          if (ringbackRef.current) {
            ringbackRef.current.stop();
            ringbackRef.current = null;
          }
          elevenLabsSessionRef.current = null;
          setCallStatus('idle');
        },
        onMessage: (payload) => {
          if (payload && payload.message) {
            const role = payload.source === 'user' || payload.role === 'user' ? 'user' : 'ai';
            setTranscript((prev) => [
              ...prev,
              {
                id: `msg_${Date.now()}_${Math.random()}`,
                speaker: role,
                text: payload.message,
                time: formatTime(callDuration),
              },
            ]);
          }
        },
        onModeChange: ({ mode }) => {
          setIsSpeaking(mode === 'speaking');
          setIsListeningMic(mode === 'listening');
        },
      });

      elevenLabsSessionRef.current = session;
    } catch (error) {
      console.warn('ElevenLabs connection error:', error);
      // Ringback stops immediately on error
      if (ringbackRef.current) {
        ringbackRef.current.stop();
        ringbackRef.current = null;
      }
      setCallStatus('idle');
    }
  };

  // End Call Handler
  const handleEndCall = async () => {
    // 1. Ensure ringback tone is stopped
    if (ringbackRef.current) {
      ringbackRef.current.stop();
      ringbackRef.current = null;
    }

    // 2. Terminate active ElevenLabs conversation session
    if (elevenLabsSessionRef.current) {
      try {
        await elevenLabsSessionRef.current.endSession();
      } catch (err) {
        console.debug('Error closing ElevenLabs session:', err);
      }
      elevenLabsSessionRef.current = null;
    }

    banglaVoice.stopSpeaking();
    voiceFoundation.stopListening();
    voiceFoundation.stopMicMonitoring();
    banglaVoice.playEndCallTone();

    // Automatically persist completed call session to Firestore
    if (transcript.length > 1) {
      const callRecord: AICall = {
        id: `call_${Date.now()}`,
        customerName: fullName.trim() || 'Inbound Caller',
        customerCompany: website.trim() || 'Client Inquiry',
        customerPhone: getFullPhoneNumber() || selectedCountry.dialCode,
        aiEmployeeName: selectedVoice.name,
        aiEmployeeRole: selectedVoice.role,
        duration: formatTime(callDuration) || '00:45',
        durationSec: callDuration || 45,
        status: 'completed',
        sentiment: 'positive',
        intent: transcript[1]?.text?.slice(0, 100) || 'Live Voice AI Session',
        leadScore: 88,
        summary: `Autonomous live voice interaction handled by ${selectedVoice.name}. Caller inquired about service capabilities.`,
        nextAction: 'Sync transcript to CRM & send confirmation recap',
        timestamp: 'Just now',
        recordingUrl: 'https://cdn.clientcare.ai/recordings/live-session.mp3',
        transcript: transcript.map((t) => ({
          speaker: t.speaker === 'ai' ? 'ai' : 'customer',
          text: t.text,
          time: t.time,
        })),
      };
      addCall(callRecord).catch((e) => console.warn('Logged call sync notice:', e));
    }

    setCallStatus('idle');
    setIsSpeaking(false);
    setIsListeningMic(false);
    setInterimSpokenText('');
    setMicAudioLevel(0);
    setMicFrequencyData(undefined);
    if (onCallEnded) onCallEnded();
  };

  // User sends text or spoken question
  const handleUserMessage = (messageText?: string) => {
    const text = (messageText || customInputText).trim();
    if (!text || callStatus !== 'connected') return;

    banglaVoice.stopSpeaking();

    const newTime = formatTime(callDuration);
    const userMsgId = `user_${Date.now()}`;
    const updatedTranscript = [
      ...transcript,
      { id: userMsgId, speaker: 'user' as const, text, time: newTime },
    ];
    setTranscript(updatedTranscript);
    setCustomInputText('');

    // If ElevenLabs session is active, forward text input to conversational agent
    if (elevenLabsSessionRef.current) {
      try {
        elevenLabsSessionRef.current.sendUserMessage(text);
        return;
      } catch (e) {
        console.debug('Forwarded message to ElevenLabs:', e);
      }
    }

    // Fallback contextual AI response
    const cleanName = fullName.split(' ')[0] || 'Friend';
    const aiAnswer = getBanglaAIResponse(text, cleanName, selectedVoice.id);

    setTimeout(() => {
      const aiTime = formatTime(callDuration + 1);
      const aiMsgId = `ai_${Date.now()}`;
      setTranscript((prev) => [
        ...prev,
        { id: aiMsgId, speaker: 'ai' as const, text: aiAnswer, time: aiTime },
      ]);
      speakAI(aiAnswer);
    }, 550);
  };

  // Browser Speech Recognition & Mic toggle
  const toggleMicrophone = async () => {
    if (callStatus !== 'connected') {
      handleStartCall();
      return;
    }

    if (elevenLabsSessionRef.current) {
      const nextListening = !isListeningMic;
      try {
        elevenLabsSessionRef.current.setMicMuted(!nextListening);
        setIsListeningMic(nextListening);
      } catch (e) {
        console.debug('Failed to toggle mic in ElevenLabs:', e);
      }
      return;
    }

    if (isListeningMic) {
      voiceFoundation.stopListening();
      voiceFoundation.stopMicMonitoring();
      setIsListeningMic(false);
      setInterimSpokenText('');
      setMicAudioLevel(0);
      setMicFrequencyData(undefined);
      return;
    }

    banglaVoice.stopSpeaking();

    // Start mic monitoring for live waveform feedback
    await voiceFoundation.startMicMonitoring((level, spectrum) => {
      setMicAudioLevel(level);
      setMicFrequencyData(spectrum);
    });

    const started = voiceFoundation.startListening({
      lang: 'en-US',
      interimResults: true,
      onStart: () => {
        setIsListeningMic(true);
      },
      onInterim: (text) => {
        setInterimSpokenText(text);
      },
      onFinal: (spokenText) => {
        setIsListeningMic(false);
        setInterimSpokenText('');
        voiceFoundation.stopMicMonitoring();
        setMicAudioLevel(0);
        setMicFrequencyData(undefined);
        handleUserMessage(spokenText);
      },
      onError: () => {
        setIsListeningMic(false);
        setInterimSpokenText('');
        voiceFoundation.stopMicMonitoring();
        setMicAudioLevel(0);
        setMicFrequencyData(undefined);
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

  // Quick Prompt Chips in English
  const quickPrompts = [
    { label: 'Pricing & Plans', text: 'What are your pricing plans and features?' },
    { label: 'CRM Integration', text: 'How does Client Care handle lead capture and CRM workflows?' },
    { label: 'Multi-Channel Support', text: 'Does this handle incoming phone calls, website chat, and social messaging?' },
    { label: 'Schedule a Demo', text: 'I would like to schedule a live demo consultation.' },
  ];

  return (
    <div
      className={`relative w-full max-w-md mx-auto rounded-3xl bg-[#090D18]/95 border border-white/[0.14] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-5 sm:p-6 overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls (Speaker & Voice Selection) */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        {/* Speaker mute toggle */}
        <button
          onClick={() => {
            const nextState = !isSpeakerOn;
            setIsSpeakerOn(nextState);
            if (!nextState) banglaVoice.stopSpeaking();
          }}
          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={isSpeakerOn ? 'Mute Audio' : 'Unmute Audio'}
        >
          {isSpeakerOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Voice Persona Selector */}
        <div className="relative">
          <button
            onClick={() => setShowVoicePicker(!showVoicePicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-200 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Voice: {selectedVoice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showVoicePicker && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F1424] border border-white/[0.12] p-2 shadow-2xl z-30 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Select Voice Persona
              </div>
              {BANGLA_VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVoice(v);
                    setShowVoicePicker(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${
                    selectedVoice.id === v.id
                      ? 'bg-blue-600/30 text-white border border-blue-500/40'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <img src={v.avatar} alt={v.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white leading-none">{v.name}</p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{v.descBn}</p>
                  </div>
                  {selectedVoice.id === v.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Central AI Avatar with Responsive Concentric Waveform Rings */}
      <div className="relative flex flex-col items-center justify-center my-3">
        {/* Concentric Pulsing Audio Ring Effect */}
        <div className="relative flex items-center justify-center">
          {callStatus === 'connected' && (
            <>
              <div
                className={`absolute w-36 h-36 rounded-full border-2 border-cyan-500/30 transition-all duration-700 pointer-events-none ${
                  isSpeaking ? 'scale-125 opacity-80 animate-ping' : 'scale-105 opacity-30'
                }`}
              />
              <div
                className={`absolute w-30 h-30 rounded-full border border-blue-500/40 transition-all duration-500 pointer-events-none ${
                  isSpeaking ? 'scale-115 opacity-100' : 'scale-100 opacity-40'
                }`}
              />
            </>
          )}

          {callStatus === 'ringing' && (
            <>
              <div className="absolute w-36 h-36 rounded-full border-2 border-amber-400/40 animate-ping pointer-events-none" />
              <div className="absolute w-32 h-32 rounded-full border border-amber-500/60 animate-pulse pointer-events-none" />
            </>
          )}

          {/* AI Avatar Image */}
          <div className="relative z-10 w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 shadow-xl">
            <img
              src={selectedVoice.avatar}
              alt={selectedVoice.name}
              className="w-full h-full rounded-full object-cover"
            />

            {/* Live activity indicator badge */}
            <div
              className={`absolute bottom-0 right-1 w-5 h-5 rounded-full border-2 border-[#090D18] flex items-center justify-center ${
                callStatus === 'connected'
                  ? 'bg-emerald-500'
                  : callStatus === 'ringing'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            >
              {callStatus === 'connected' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              {callStatus === 'ringing' && <span className="w-1.5 h-1.5 rounded-full bg-amber-900 animate-ping" />}
            </div>
          </div>
        </div>

        {/* AI Employee Title and Real-time Voice Waveform */}
        <div className="text-center mt-3">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
            <span>{selectedVoice.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium">
              Voice AI Agent
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {callStatus === 'connected' ? (
              <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                In Call ({formatTime(callDuration)})
              </span>
            ) : callStatus === 'ringing' ? (
              <span className="text-amber-400 font-medium flex items-center justify-center gap-1.5 animate-pulse">
                <Phone className="w-3.5 h-3.5 animate-bounce" />
                Ringing... (টুট... টুট...)
              </span>
            ) : (
              'Test Live Voice Call'
            )}
          </p>
        </div>

        {/* Visualizer Waveform Bar */}
        {callStatus === 'connected' && (
          <div className="w-full px-6 mt-2 flex flex-col items-center">
            <VoiceWaveform
              state={isSpeaking ? 'speaking' : isListeningMic ? 'listening' : 'thinking'}
              color={isSpeaking ? 'cyan' : 'emerald'}
              bars={24}
              height={28}
              audioLevel={isListeningMic ? micAudioLevel : undefined}
              frequencyData={isListeningMic ? micFrequencyData : undefined}
            />
            {isListeningMic && interimSpokenText && (
              <p className="text-[11px] text-emerald-400 font-mono mt-1.5 animate-pulse text-center">
                "{interimSpokenText}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Input Fields */}
      <div className="space-y-2.5 my-4">
        {/* Name input */}
        <div className="relative">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="Name"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Phone number input with Country Code selector */}
        <div className="relative flex items-center gap-2" ref={countryDropdownRef}>
          {/* Country Code Trigger Button */}
          <div className="relative">
            <button
              type="button"
              disabled={callStatus !== 'idle'}
              onClick={() => setIsCountryDropdownOpen((prev) => !prev)}
              className="h-10 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-xs sm:text-sm text-white flex items-center gap-1.5 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75 cursor-pointer whitespace-nowrap"
              title="Select country dial code"
            >
              <span className="text-base">{selectedCountry.flag}</span>
              <span className="font-semibold font-mono text-slate-200">{selectedCountry.dialCode}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isCountryDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Scrollable Country Selector Dropdown */}
            {isCountryDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 sm:w-72 max-h-60 overflow-y-auto rounded-xl bg-[#090D18] border border-white/[0.15] shadow-2xl z-50 p-2 backdrop-blur-xl">
                {/* Search country input */}
                <div className="sticky top-0 bg-[#090D18] pb-1.5 mb-1 border-b border-white/[0.08] z-10">
                  <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08]">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search country..."
                      className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Scrollable Country List */}
                <div className="space-y-0.5">
                  {filteredCountries.map((c) => {
                    const isSelected = selectedCountry.code === c.code;
                    return (
                      <button
                        key={`${c.code}-${c.dialCode}`}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryDropdownOpen(false);
                          setCountrySearch('');
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/30 text-white border border-blue-500/40 font-medium'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="text-base shrink-0">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <span className="font-mono text-[11px] text-cyan-400 shrink-0 font-medium">
                          {c.dialCode}
                        </span>
                      </button>
                    );
                  })}
                  {filteredCountries.length === 0 && (
                    <div className="py-4 text-center text-xs text-slate-500">
                      No country found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Number input */}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="Phone"
            className="flex-1 min-w-0 h-10 px-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="Email"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Website / Company input */}
        <div className="relative">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="Website"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>
      </div>

      {/* Main Call Action Buttons */}
      <div className="flex items-center gap-2 mt-4">
        {/* Mic Toggle Button */}
        <button
          onClick={toggleMicrophone}
          disabled={callStatus === 'idle'}
          className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-center cursor-pointer ${
            isListeningMic
              ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
              : callStatus === 'connected'
              ? 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border-white/[0.15]'
              : 'bg-white/[0.03] text-slate-600 border-white/[0.06] cursor-not-allowed'
          }`}
          title={isListeningMic ? 'Microphone active (Listening)' : 'Speak into microphone'}
        >
          {isListeningMic ? <Mic className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-slate-300" />}
        </button>

        {/* Primary Start / End Call Button */}
        {callStatus === 'idle' ? (
          <button
            onClick={handleStartCall}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-400 text-white text-sm font-bold shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
            <span>Start Call</span>
          </button>
        ) : callStatus === 'ringing' ? (
          <button
            onClick={handleEndCall}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-red-600 hover:from-amber-500 hover:via-rose-500 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-amber-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <PhoneOff className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>Cancel Call</span>
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <PhoneOff className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>End Call</span>
          </button>
        )}

        {/* Audio Headset Badge */}
        <div className="px-3 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-cyan-400">
          <Headphones className="w-4 h-4" />
        </div>
      </div>

      {/* Dynamic Status Text Below Button */}
      <div className="text-center mt-3">
        <p className="text-xs font-semibold">
          {callStatus === 'idle' && (
            <span className="text-slate-400">Click Start Call to speak with the AI assistant</span>
          )}
          {callStatus === 'ringing' && (
            <span className="text-amber-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Ringing... (টুট... টুট...)
            </span>
          )}
          {callStatus === 'connected' && (
            <span className="text-emerald-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          )}
        </p>
      </div>

      {/* Live Conversation Transcript Drawer */}
      {transcript.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Live Call Transcript
            </span>
            {isSpeaking && (
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                Voice Playing 🔊
              </span>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 text-xs">
            {transcript.map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl ${
                  item.speaker === 'ai'
                    ? 'bg-blue-950/40 border border-blue-500/20 text-slate-200'
                    : 'bg-white/[0.06] border border-white/[0.08] text-white ml-6'
                }`}
              >
                <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {item.speaker === 'ai' ? selectedVoice.name : 'You'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{item.time}</span>
                    {item.speaker === 'ai' && (
                      <button
                        onClick={() => speakAI(item.text)}
                        className="p-1 hover:text-cyan-300 transition-colors cursor-pointer"
                        title="Replay Audio"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="leading-relaxed">{item.text}</p>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Quick Questions Suggestions Chips */}
          {callStatus === 'connected' && (
            <div className="mt-3">
              <div className="text-[10px] text-slate-400 mb-1.5 font-medium">Quick questions:</div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserMessage(q.text)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 transition-all text-left cursor-pointer"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Custom Text Question Input for noisy environments */}
              <div className="flex items-center gap-1.5 mt-2.5">
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => setCustomInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserMessage()}
                  placeholder="Type a question or response..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleUserMessage()}
                  disabled={!customInputText.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Branding */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Powered By:{' '}
          <strong className="text-cyan-400 font-semibold">Client Care by Pramanik Group</strong>
        </p>
      </div>
    </div>
  );
};
