import React, { useState, useEffect } from 'react';
import { Sparkles, PhoneCall, Volume2, ShieldCheck, ArrowRight, Zap, CheckCircle2, Globe } from 'lucide-react';
import { StatusIndicator } from '../ui/StatusIndicator';
import { VoiceWaveform } from '../ui/VoiceWaveform';
import { BanglaLiveCallWidget } from '../voice/BanglaLiveCallWidget';

interface HeroAssistantDemoProps {
  onOpenVoiceTest?: () => void;
  onOpenDashboard?: () => void;
}

export const HeroAssistantDemo: React.FC<HeroAssistantDemoProps> = ({
  onOpenVoiceTest,
  onOpenDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'bangla' | 'enterprise'>('bangla');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [aiState, setAiState] = useState<'listening' | 'thinking' | 'speaking'>('speaking');

  // Scripted conversational exchange for the live hero demonstration
  const dialogue = [
    {
      speaker: 'customer',
      text: "I'm interested in your enterprise package for our 14 logistics depots.",
      delay: 2600,
    },
    {
      speaker: 'ai',
      text: "Absolutely! May I ask your main bottleneck so I can configure the ideal dispatch and 24/7 driver call routing for your team?",
      delay: 3800,
    },
    {
      speaker: 'customer',
      text: "We lose around 350 driver calls every night after 6 PM.",
      delay: 2800,
    },
    {
      speaker: 'ai',
      text: "Understood. Sarah can answer instantly with zero hold times, provide gate codes via your dispatch API, and sync updates directly into your CRM. Would you like to schedule an executive briefing tomorrow?",
      delay: 4500,
    },
  ];

  useEffect(() => {
    if (activeTab !== 'enterprise') return;
    const timer = setTimeout(() => {
      setActiveStep((prev) => (prev + 1) % dialogue.length);
    }, dialogue[activeStep].delay);

    return () => clearTimeout(timer);
  }, [activeStep, activeTab]);

  useEffect(() => {
    if (activeTab !== 'enterprise') return;
    const current = dialogue[activeStep];
    if (current.speaker === 'customer') {
      setAiState('listening');
    } else {
      setAiState('speaking');
    }
  }, [activeStep, activeTab]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Tab Switcher: Interactive Voice vs Enterprise Global */}
      <div className="flex items-center justify-center mb-4">
        <div className="p-1 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab('bangla')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'bangla'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Interactive Live Voice AI</span>
          </button>
          <button
            onClick={() => setActiveTab('enterprise')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'enterprise'
                ? 'bg-white/[0.12] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Global Automated Demo</span>
          </button>
        </div>
      </div>

      {activeTab === 'bangla' ? (
        <BanglaLiveCallWidget />
      ) : (
        <div className="relative">
          {/* Outer subtle glow */}
          <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-cyan-500/30 blur-xl opacity-60 pointer-events-none" />

          {/* Main glass frame */}
          <div className="relative rounded-2xl bg-[#090D18]/90 border border-white/[0.12] shadow-2xl p-5 sm:p-6 backdrop-blur-xl">
            {/* Header bar of the interactive assistant */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                    alt="Sarah AI Employee"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/40"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#090D18]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">Sarah</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                      Sales Assistant
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusIndicator status="active" label="Online" size="sm" />
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-[11px] text-slate-400">Neural Voice AI</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenVoiceTest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all group"
                >
                  <PhoneCall className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Test Live Voice</span>
                </button>
              </div>
            </div>

            {/* Live Audio Waveform & State Indicator */}
            <div className="bg-[#05070D]/80 rounded-xl p-3 border border-white/[0.06] mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                    Voice AI Stream
                  </span>
                  <StatusIndicator
                    status={aiState === 'listening' ? 'listening' : aiState === 'thinking' ? 'thinking' : 'speaking'}
                    size="sm"
                  />
                </div>
              </div>
              <div className="w-44 sm:w-56 overflow-hidden">
                <VoiceWaveform state={aiState} bars={24} height={28} color="cyan" />
              </div>
            </div>

            {/* Live Conversation Stream */}
            <div className="space-y-3 min-h-[170px] mb-4">
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-xs text-slate-300">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-300">Customer (Eleanor Vance)</span>
                  <span>Inbound Line</span>
                </div>
                <p className="leading-relaxed">
                  "{dialogue[activeStep].speaker === 'customer' ? dialogue[activeStep].text : dialogue[Math.max(0, activeStep - 1)].text}"
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/25 rounded-xl p-3.5 text-xs text-slate-100 relative">
                <div className="flex items-center justify-between text-[10px] text-blue-300 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span className="font-semibold">Sarah (AI Employee)</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Intent: High
                  </span>
                </div>
                <p className="leading-relaxed text-slate-200">
                  "{dialogue[activeStep].speaker === 'ai' ? dialogue[activeStep].text : dialogue[Math.min(dialogue.length - 1, activeStep + 1)].text}"
                </p>
              </div>
            </div>

            {/* Dynamic Automation Node Tracker */}
            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-300">Summary Generated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Intent: Qualified</span>
              </div>
              <button
                onClick={onOpenDashboard}
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 font-medium transition-colors"
              >
                <span>Open in Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
