import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  Globe,
  Radio,
  User,
  Mail,
  Send,
} from 'lucide-react';
import {
  banglaVoice,
  BANGLA_VOICES,
  BanglaVoicePersona,
  getBanglaAIResponse,
} from '../../services/banglaVoiceService';
import { voiceFoundation } from '../../services/voiceFoundation';
import { VoiceWaveform } from '../ui/VoiceWaveform';

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
  initialName = 'Md Sajid Alibab 2026',
  initialPhone = '0177790126',
  initialEmail = 'sajidpramanik2026@gmail.com',
  initialWebsite = 'facebook.com',
  onCallEnded,
  variant = 'hero',
  className = '',
}) => {
  // Form input states (exactly matching the user's video)
  const [fullName, setFullName] = useState<string>(initialName);
  const [phone, setPhone] = useState<string>(initialPhone);
  const [email, setEmail] = useState<string>(initialEmail);
  const [website, setWebsite] = useState<string>(initialWebsite);

  // Call status
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState<number>(0);

  // Audio controls
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [interimSpokenText, setInterimSpokenText] = useState<string>('');
  const [micAudioLevel, setMicAudioLevel] = useState<number>(0);
  const [micFrequencyData, setMicFrequencyData] = useState<Uint8Array | undefined>(undefined);

  // Selected persona
  const [selectedVoice, setSelectedVoice] = useState<BanglaVoicePersona>(BANGLA_VOICES[0]);
  const [showVoicePicker, setShowVoicePicker] = useState<boolean>(false);

  // Conversation transcript
  const [transcript, setTranscript] = useState<
    { id: string; speaker: 'ai' | 'user'; text: string; time: string }[]
  >([]);
  const [customInputText, setCustomInputText] = useState<string>('');
  const transcriptEndRef = useRef<HTMLDivElement>(null);

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

  // Trigger Bangla AI Speech Output
  const speakBangla = (text: string) => {
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

    setCallStatus('connecting');

    // 1. Play realistic telecom dialing ringtone
    await banglaVoice.playRingbackTone(1800);

    // 2. Connect call and play chime
    banglaVoice.playConnectedChime();
    setCallStatus('connected');

    // Extract first name for personalized Bengali greeting
    const cleanName = fullName.split(' ')[0] || 'সাজিদ ভাই';

    const greetingText = `আসসালামু আলাইকুম ${cleanName}! আমি ক্লায়েন্ট কেয়ার এআই থেকে ${selectedVoice.nameBn} বলছি। কেমন আছেন আপনি? আমাদের এআই কলার কীভাবে আপনার বিজনেসের কাস্টমার সাপোর্ট ও সেলস সহজ করবে, তা জানাতে কলটি শুরু করেছি। আপনি কি আপনার ফেসবুক পেজ বা বিজনেস সম্পর্কে কিছু জানতে চান?`;

    const initialEntry = {
      id: `msg_${Date.now()}`,
      speaker: 'ai' as const,
      text: greetingText,
      time: '00:01',
    };

    setTranscript([initialEntry]);

    // Speak the real Bangla voice aloud!
    speakBangla(greetingText);
  };

  // End Call Handler
  const handleEndCall = () => {
    banglaVoice.stopSpeaking();
    voiceFoundation.stopListening();
    voiceFoundation.stopMicMonitoring();
    banglaVoice.playEndCallTone();
    setCallStatus('idle');
    setIsSpeaking(false);
    setIsListeningMic(false);
    setInterimSpokenText('');
    setMicAudioLevel(0);
    setMicFrequencyData(undefined);
    if (onCallEnded) onCallEnded();
  };

  // User sends text or spoken question in Bangla
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

    // Generate intelligent contextual Bangla AI response
    const cleanName = fullName.split(' ')[0] || 'সাজিদ ভাই';
    const aiAnswer = getBanglaAIResponse(text, cleanName, selectedVoice.id);

    setTimeout(() => {
      const aiTime = formatTime(callDuration + 1);
      const aiMsgId = `ai_${Date.now()}`;
      setTranscript((prev) => [
        ...prev,
        { id: aiMsgId, speaker: 'ai' as const, text: aiAnswer, time: aiTime },
      ]);
      speakBangla(aiAnswer);
    }, 550);
  };

  // Browser Speech Recognition for Bengali (`bn-BD`) via voiceFoundation
  const toggleMicrophone = async () => {
    if (callStatus !== 'connected') {
      handleStartCall();
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
      lang: 'bn-BD',
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
      alert('আপনার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট পাওয়া যায়নি। আপনি নিচের টেক্সট বাটনগুলো ব্যবহার করতে পারেন!');
    }
  };

  // Quick Prompt Chips in Bangla
  const quickPrompts = [
    { label: 'প্যাকেজের মূল্য কত?', text: 'আপনাদের প্যাকেজের দাম ও সুযোগ-সুবিধা কত?' },
    { label: 'ফেসবুক পেজে অর্ডার নেওয়া যাবে?', text: 'আমার ফেসবুক পেজের কাস্টমারদের অর্ডার নিতে পারবে কি?' },
    { label: 'বাংলায় কথা কীভাবে বলো?', text: 'তুমি কি সম্পূর্ণ খাঁটি বাংলায় কথা বলতে পারো?' },
    { label: 'ডেমো মিটিং বুক করুন', text: 'আমি একজন মানুষের সাথে ডেমো মিটিং করতে চাই।' },
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
          className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
          title={isSpeakerOn ? 'শব্দ বন্ধ করুন (Mute)' : 'শব্দ চালু করুন (Unmute)'}
        >
          {isSpeakerOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Voice Persona Selector */}
        <div className="relative">
          <button
            onClick={() => setShowVoicePicker(!showVoicePicker)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ভয়েস: {selectedVoice.nameBn}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showVoicePicker && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0F1424] border border-white/[0.12] p-2 shadow-2xl z-30 space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                বাংলা ভয়েস সিলেক্ট করুন
              </div>
              {BANGLA_VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setSelectedVoice(v);
                    setShowVoicePicker(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center gap-2.5 transition-colors ${
                    selectedVoice.id === v.id
                      ? 'bg-blue-600/30 text-white border border-blue-500/40'
                      : 'text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  <img src={v.avatar} alt={v.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white leading-none">{v.nameBn} ({v.name})</p>
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
        {/* Concentric Pulsing Audio Ring Effect (matching the video) */}
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

          {callStatus === 'connecting' && (
            <div className="absolute w-32 h-32 rounded-full border-2 border-amber-500/50 animate-spin border-t-transparent pointer-events-none" />
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
                  : callStatus === 'connecting'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-500'
              }`}
            >
              {callStatus === 'connected' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
            </div>
          </div>
        </div>

        {/* AI Employee Title and Real-time Voice Waveform */}
        <div className="text-center mt-3">
          <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
            <span>{selectedVoice.nameBn}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 font-medium">
              বাংলা ভয়েস এআই
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {callStatus === 'connected' ? (
              <span className="text-emerald-400 font-medium flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                কথা চলছে ({formatTime(callDuration)})
              </span>
            ) : callStatus === 'connecting' ? (
              <span className="text-amber-400 font-medium">কল কানেক্ট হচ্ছে...</span>
            ) : (
              'লাইভ ভয়েস কল টেস্ট করুন'
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

      {/* Input Fields (Exact structure shown in user video) */}
      <div className="space-y-2.5 my-4">
        {/* Name input */}
        <div className="relative">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="আপনার নাম"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Phone number input with Bangladesh country code */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-slate-300 select-none">
            <span>🇧🇩</span>
            <span className="font-semibold text-slate-200">+880</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="017XXXXXXXX"
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="আপনার ইমেইল"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>

        {/* Website / Social Platform input */}
        <div className="relative">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            disabled={callStatus !== 'idle'}
            placeholder="facebook.com / ওয়েবসাইট"
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-75"
          />
        </div>
      </div>

      {/* Main Call Action Buttons (Matching user video layout) */}
      <div className="flex items-center gap-2 mt-4">
        {/* Mic Toggle Button */}
        <button
          onClick={toggleMicrophone}
          disabled={callStatus === 'idle'}
          className={`p-3 rounded-2xl border transition-all duration-200 flex items-center justify-center ${
            isListeningMic
              ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
              : callStatus === 'connected'
              ? 'bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border-white/[0.15]'
              : 'bg-white/[0.03] text-slate-600 border-white/[0.06] cursor-not-allowed'
          }`}
          title={isListeningMic ? 'মাইক্রোফোন চালু আছে (শুনছি)' : 'মাইক চালু করে বাংলায় কথা বলুন'}
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
            <span>Start Call (কল শুরু করুন)</span>
          </button>
        ) : (
          <button
            onClick={handleEndCall}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-rose-600/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <PhoneOff className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
            <span>End Call (কল শেষ করুন)</span>
          </button>
        )}

        {/* Bangladesh Flag / Locale Badge */}
        <div className="px-3 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-sm">
          <span>🇧🇩</span>
        </div>
      </div>

      {/* Dynamic Status Text Below Button (Matching video) */}
      <div className="text-center mt-3">
        <p className="text-xs font-semibold">
          {callStatus === 'idle' && (
            <span className="text-slate-400">কল করতে বাটনে চাপ দিন (বাংলায় কথা বলবে)</span>
          )}
          {callStatus === 'connecting' && (
            <span className="text-amber-400 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Connecting...
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

      {/* Live Conversation Transcript Drawer (Shown when call is active or had messages) */}
      {transcript.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              লাইভ বাংলা কথোপকথন
            </span>
            {isSpeaking && (
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-medium">
                ভয়েস প্লে হচ্ছে 🔊
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
                    {item.speaker === 'ai' ? selectedVoice.nameBn : 'আপনি'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{item.time}</span>
                    {item.speaker === 'ai' && (
                      <button
                        onClick={() => speakBangla(item.text)}
                        className="p-1 hover:text-cyan-300 transition-colors"
                        title="পুনরায় শুনুন"
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

          {/* Quick Questions Suggestions Chips in Bangla */}
          {callStatus === 'connected' && (
            <div className="mt-3">
              <div className="text-[10px] text-slate-400 mb-1.5 font-medium">ক্লিক করে প্রশ্ন করুন:</div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUserMessage(q.text)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-200 transition-all text-left"
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
                  placeholder="বাংলায় লিখেও প্রশ্ন করতে পারেন..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleUserMessage()}
                  disabled={!customInputText.trim()}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Branding (Matching video "Powered By: PowerinAi") */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Powered By:{' '}
          <strong className="text-white">PowerinAi</strong> &{' '}
          <strong className="text-cyan-400 font-semibold">Client Care (Pramanik Group)</strong>
        </p>
      </div>
    </div>
  );
};
