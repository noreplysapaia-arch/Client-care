import React, { useState } from 'react';
import {
  Sparkles,
  PhoneCall,
  Bot,
  Users,
  GitBranch,
  Database,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  ChevronDown,
  Building2,
  Stethoscope,
  Briefcase,
  Home,
  ShoppingBag,
  Hotel,
  Play,
  Volume2,
  FileText,
  Clock,
  Zap,
} from 'lucide-react';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { HeroAssistantDemo } from './HeroAssistantDemo';
import { initialAIEmployees } from '../../data/mockData';
import { AIEmployee } from '../../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenVoiceDemo: () => void;
  onTestAgent: (agent: AIEmployee) => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenVoiceDemo,
  onTestAgent,
  onLogin,
}) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'sales' | 'support' | 'reception'>('sales');

  const faqs = [
    {
      q: 'How do Client Care AI Employees sound compared to real human agents?',
      a: 'Client Care deploys conversational neural voice synthesis tuned specifically for conversational tone, inflection, and natural pauses. Callers experience smooth, interruption-friendly dialogue that feels natural, eliminating the awkward pauses typical of legacy IVRs.',
    },
    {
      q: 'How does the AI know my specific business policies, prices, and catalog?',
      a: 'You simply upload your existing documents—PDFs, product sheets, pricing guides, website URLs, or support articles. Client Care splits and indexes them into semantic vector chunks. When an inquiry arises, the AI grounds its answer strictly in your verified documentation.',
    },
    {
      q: 'Can Client Care integrate with our existing CRM, phone lines, and calendars?',
      a: 'Client Care is designed with an extensible API and webhook architecture planned to support integrations with platforms like Google Calendar, Outlook, HubSpot, and Salesforce. In addition to browser-based voice testing, our architecture is designed to support telephony routing.',
    },
    {
      q: 'What happens when a customer has an emergency or wants a human manager?',
      a: 'Every AI employee has customizable escalation rules. If a caller requests a human supervisor, reports an urgent incident, or if sentiment drops below your safety threshold, the call is designed to transfer to your designated phone number with an audio briefing.',
    },
    {
      q: 'How does Client Care approach data privacy and security?',
      a: 'Client Care is engineered with a security-conscious architecture featuring encryption in transit and at rest, role-based access control, and zero prompt data sharing for public AI training.',
    },
    {
      q: 'How much does it cost to get started?',
      a: 'You can build, customize, and test your first AI Employee completely free with our browser demo environment. There are no credit card requirements to explore the platform and test full voice and CRM capabilities.',
    },
  ];

  const industries = [
    {
      icon: Home,
      title: 'Real Estate & Property',
      desc: '24/7 phone receptionists that pre-qualify buyer budgets, schedule private viewings, and capture after-hours buyer inquiries.',
    },
    {
      icon: Stethoscope,
      title: 'Healthcare & Clinics',
      desc: 'Intake coordinators that handle appointment bookings, reminders, and patient triage with zero hold times.',
    },
    {
      icon: ShoppingBag,
      title: 'E-Commerce & Retail',
      desc: 'Order tracking specialists, proactive cart abandonment callbacks, and instant customer support resolution across timezones.',
    },
    {
      icon: Briefcase,
      title: 'Financial & Legal Services',
      desc: 'Discreet client intake screening, initial consultation bookings, and automated compliance follow-ups.',
    },
    {
      icon: Hotel,
      title: 'Hospitality & Travel',
      desc: 'Multilingual guest concierge agents handling reservations, room upgrades, and local guidance over phone and chat.',
    },
    {
      icon: Building2,
      title: 'Logistics & Dispatch',
      desc: 'Instant driver check-ins, gate code distribution, and shipment delay notifications with direct CRM dispatch integration.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border-b border-white/[0.06] py-2 px-4 text-center">
        <p className="text-xs text-slate-300 font-medium inline-flex items-center gap-2">
          <Badge variant="blue" size="sm">Platform Preview</Badge>
          <span>Client Care Platform by <strong>Pramanik Group</strong> — Interactive AI Operating System</span>
          <button
            onClick={onOpenVoiceDemo}
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold ml-1 cursor-pointer"
          >
            Try Live Demo &rarr;
          </button>
        </p>
      </div>

      {/* Primary Sticky Header / Navigation */}
      <header className="sticky top-0 z-40 bg-[#07090e]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Logo size="md" clickable onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#ai-team" className="hover:text-white transition-colors">AI Team</a>
            <a href="#voice-ai" className="hover:text-white transition-colors">Voice AI</a>
            <a href="#crm" className="hover:text-white transition-colors">CRM & Leads</a>
            <a href="#automation" className="hover:text-white transition-colors">Automation</a>
            <a href="#knowledge" className="hover:text-white transition-colors">Knowledge Base</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              Sign In
            </button>
            <Button
              variant="gradient"
              size="md"
              onClick={onGetStarted}
              icon={ArrowRight}
            >
              Launch Platform
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Subtle geometric lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-cyan-950/80 border border-cyan-500/30 text-xs font-semibold text-cyan-300 mb-5 backdrop-blur-md shadow-lg shadow-cyan-950/40">
              <span className="text-base">🇧🇩</span>
              <span className="tracking-wide">Solution In Bangladesh</span>
              <span className="text-slate-500">•</span>
              <span className="text-white">Powered by AI Designed to Scale Your Business</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Your Business Deserves an <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">AI Team</span>.
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-4 font-normal">
              সম্পূর্ণ খাঁটি ও ন্যাচারাল <strong className="text-cyan-300 font-semibold">রিয়েল বাংলা ভয়েসে</strong> ২৪/৭ কাস্টমার কল রিসিভ, ফেসবুক পেজ অর্ডার কনফার্ম ও সেলস অটোমেশন সিস্টেম।
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
              Client Care by Pramanik Group helps businesses automate customer care, calling, lead qualification, and daily CRM operations with intelligent voice AI employees.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
              <Button
                variant="gradient"
                size="lg"
                onClick={onGetStarted}
                icon={ArrowRight}
                className="w-full sm:w-auto"
              >
                Build Your AI Employee
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenVoiceDemo}
                icon={PhoneCall}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                Talk to Client Care
              </Button>
            </div>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free to explore</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual */}
          <HeroAssistantDemo
            onOpenVoiceTest={onOpenVoiceDemo}
            onOpenDashboard={onGetStarted}
          />
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES */}
      <section className="py-12 border-y border-white/[0.08] bg-[#0A0D18]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <p className="text-base sm:text-lg font-bold text-white tracking-tight">AI-Powered</p>
              <p className="text-xs text-slate-400 font-medium">Customer Conversations</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <p className="text-base sm:text-lg font-bold text-white tracking-tight">Real-Time Voice</p>
              <p className="text-xs text-slate-400 font-medium">Conversational Audio</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <p className="text-base sm:text-lg font-bold text-white tracking-tight">Reliable Operation</p>
              <p className="text-xs text-slate-400 font-medium">Built for Business Automation</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
              <p className="text-base sm:text-lg font-bold text-white tracking-tight">Security-Conscious</p>
              <p className="text-xs text-slate-400 font-medium">Data Privacy Architecture</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI EMPLOYEES SECTION */}
      <section id="ai-team" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <Badge variant="violet" className="mb-3">Pre-Trained Roles</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Meet Your AI Team.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
                Deploy specialized AI personnel trained for high-converting sales, empathetic front-desk triage, and accurate technical support.
              </p>
            </div>
            <Button variant="outline" size="md" onClick={onGetStarted}>
              Build Custom Employee &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialAIEmployees.map((agent) => (
              <div
                key={agent.id}
                className="card-surface rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={agent.avatar}
                          alt={agent.name}
                          className="w-13 h-13 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#080B14]" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">{agent.role}</p>
                      </div>
                    </div>
                    <Badge variant="slate" size="sm">Active</Badge>
                  </div>

                  <div className="mb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                      Primary Capability
                    </span>
                    <p className="text-xs font-medium text-slate-200">{agent.capability}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-5">
                    {agent.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="text-[11px] text-slate-400 font-medium">
                    <span>Ready for business workflows</span>
                  </div>
                  <button
                    onClick={() => onTestAgent(agent)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>Test Agent</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI VOICE SECTION */}
      <section id="voice-ai" className="py-24 bg-[#0A0E1A] border-y border-white/[0.08] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="cyan" className="mb-3">Conversational Voice AI</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Conversations That Feel Human.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Client Care provides realistic, low-latency conversational voice technology designed for commercial phone operations. The AI listens actively, understands accents, respects conversational interruptions, and speaks naturally.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <PhoneCall className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Inbound & Outbound</h4>
                  <p className="text-[11px] text-slate-400">Handle customer inquiries or dial speed-to-lead follow-ups automatically.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Volume2 className="w-5 h-5 text-cyan-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Real-Time Voice</h4>
                  <p className="text-[11px] text-slate-400">Natural conversational pacing with interruption detection and clean synthesis.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <FileText className="w-5 h-5 text-indigo-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Instant Transcripts</h4>
                  <p className="text-[11px] text-slate-400">Full verbatim transcriptions with speaker turns and timestamp tags.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Zap className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">AI Call Summaries</h4>
                  <p className="text-[11px] text-slate-400">Extracts lead intent, sentiment analysis, and next action items into CRM.</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="gradient" size="md" onClick={onOpenVoiceDemo} icon={PhoneCall}>
                  Start Browser Voice Call
                </Button>
                <span className="text-xs text-slate-500">No software install or telephony required</span>
              </div>
            </div>

            {/* Visual Voice Console Preview */}
            <div className="relative">
              <div className="card-surface rounded-2xl p-6 border border-white/[0.12] shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Voice AI"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-cyan-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">Live Phone Stream</span>
                        <Badge variant="emerald" size="sm">Interactive Demo</Badge>
                      </div>
                      <span className="text-[11px] text-slate-400">Caller: +1 (415) 883-9921 • Duration: 02:14</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-cyan-400">HD Voice</span>
                  </div>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="bg-[#05070D] p-3 rounded-xl border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block mb-1">Caller (Eleanor Vance)</span>
                    <p className="text-xs text-slate-300">"We need to route dispatch emergencies to our night-shift supervisor if the line is busy."</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-950/60 to-indigo-950/60 p-3.5 rounded-xl border border-blue-500/30">
                    <div className="flex items-center justify-between text-[10px] text-blue-300 mb-1">
                      <span className="font-semibold">Sarah (Client Care AI)</span>
                      <span>Speaking</span>
                    </div>
                    <p className="text-xs text-slate-100">
                      "I can set up an instant rollover rule so if a driver calls twice within three minutes, it bridges directly to your on-call supervisor."
                    </p>
                  </div>
                </div>

                {/* Simulated Waveform & Intelligence tags */}
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Audio Engine: <strong>Low Latency Neural</strong></span>
                  </div>
                  <Badge variant="cyan" size="sm">Sentiment: Positive</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CRM & LEAD MANAGEMENT PREVIEW */}
      <section id="crm" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="blue" className="mb-3">Built-in Intelligence</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Autonomous CRM & Pipeline
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Every customer conversation automatically updates lead records, logs audio transcripts, calculates buyer intent, and books follow-ups.
            </p>
          </div>

          <div className="card-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-5 bg-white/[0.02] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">Active Pipeline</span>
                <div className="flex items-center gap-1 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold">
                    6 Pipeline Stages
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-400">
                    Lead Lifecycle
                  </span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={onGetStarted}>
                View Full CRM &rarr;
              </Button>
            </div>

            {/* Pipeline Stage Preview */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { stage: 'New', count: 'Inbound Intake', color: 'border-slate-700 bg-slate-900/50' },
                { stage: 'Contacted', count: 'Outreach & Triage', color: 'border-blue-900/50 bg-blue-950/20' },
                { stage: 'Qualified', count: 'Needs Identified', color: 'border-indigo-900/50 bg-indigo-950/20' },
                { stage: 'Proposal', count: 'Solution Review', color: 'border-violet-900/50 bg-violet-950/20' },
                { stage: 'Won', count: 'Agreement Closed', color: 'border-emerald-900/50 bg-emerald-950/20' },
                { stage: 'Nurture', count: 'Scheduled Follow-up', color: 'border-amber-900/50 bg-amber-950/20' },
              ].map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border ${item.color} flex flex-col justify-between`}>
                  <span className="text-xs font-bold text-slate-200">{item.stage}</span>
                  <span className="text-[11px] text-slate-400 mt-2 font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AUTOMATION WORKFLOW BUILDER PREVIEW */}
      <section id="automation" className="py-24 bg-[#090D18] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="violet" className="mb-3">Visual Workflow Engine</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Automate Entire Business Workflows.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Connect incoming leads, AI voice calls, intent conditions, meeting booking, and CRM updates into unified autopilot sequences.
            </p>
          </div>

          {/* Interactive visual workflow layout */}
          <div className="max-w-4xl mx-auto card-surface rounded-2xl p-6 sm:p-8 border border-white/[0.12] shadow-2xl relative">
            <div className="flex flex-col items-center gap-4">
              {/* Step 1: Trigger */}
              <div className="w-full max-w-md p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-center relative shadow-lg">
                <span className="text-[10px] font-bold tracking-wider uppercase text-blue-400 block mb-0.5">Trigger</span>
                <h4 className="text-sm font-bold text-white">New Website Lead Submitted</h4>
                <p className="text-xs text-slate-400 mt-1">Prospect enters phone number via online quote form</p>
              </div>

              {/* Animated connector */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-500" />

              {/* Step 2: AI Call */}
              <div className="w-full max-w-md p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 text-center relative shadow-lg">
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-400 block mb-0.5">AI Action</span>
                <h4 className="text-sm font-bold text-white">Sarah Dials Prospect Within 45 Seconds</h4>
                <p className="text-xs text-slate-400 mt-1">Initiates natural voice qualification & confirms requirement</p>
              </div>

              {/* Animated connector */}
              <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500" />

              {/* Step 3: Condition */}
              <div className="w-full max-w-md p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-center relative shadow-lg">
                <span className="text-[10px] font-bold tracking-wider uppercase text-purple-400 block mb-0.5">Decision Node</span>
                <h4 className="text-sm font-bold text-white">Analyze Intent & Qualification Score</h4>
                <p className="text-xs text-slate-400 mt-1">Is prospect budget &gt; $10k with immediate timeline?</p>
              </div>

              {/* Branching splits */}
              <div className="w-full max-w-xl grid grid-cols-2 gap-4 mt-2">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-0.5">YES &rarr; Book Meeting</span>
                  <p className="text-xs font-semibold text-white">Instant Calendar Booking</p>
                  <p className="text-[11px] text-slate-400 mt-1">Sends calendar invite & updates CRM to 'Qualified'</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-400 block mb-0.5">NO &rarr; Nurture</span>
                  <p className="text-xs font-semibold text-white">SMS Follow-up & Nurture</p>
                  <p className="text-[11px] text-slate-400 mt-1">Sends pricing guide & schedules check-in for next week</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.08] text-center">
              <Button variant="primary" size="md" onClick={onGetStarted} icon={ArrowRight}>
                Customize This Workflow in Builder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* KNOWLEDGE BASE & TRAINING */}
      <section id="knowledge" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="blue" className="mb-3">Company Brain</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ground Your AI in True Company Knowledge.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Never worry about hallucinations. Client Care grounds every word spoken by your AI employees in verified company documentation, SOPs, and pricing policies.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">Upload PDF, DOCX, TXT manuals and pricing sheets</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">Sync live website URLs and developer API docs</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-xs text-slate-300">Embed verified FAQs & objection-handling scripts</span>
                </div>
              </div>

              <Button variant="secondary" size="md" onClick={onGetStarted}>
                Explore Knowledge Manager &rarr;
              </Button>
            </div>

            {/* Knowledge stats card */}
            <div className="card-surface rounded-2xl p-6 border border-white/[0.1] shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Knowledge Base Status</h4>
                  <span className="text-xs text-slate-400">Pramanik Group Master Index</span>
                </div>
                <Badge variant="emerald" size="sm">Indexed & Ready</Badge>
              </div>

              <div className="p-4 rounded-xl bg-[#06080F] border border-white/[0.06] mb-4 flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">Semantic Chunks</span>
                  <span className="text-xs text-slate-400 block">Verified Business Grounding</span>
                </div>
                <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-[100%]" />
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { name: 'Master Product & Feature Catalog 2026.pdf', chunks: 'Document', status: 'Indexed' },
                  { name: 'Pricing Guidelines.pdf', chunks: 'Document', status: 'Indexed' },
                  { name: 'https://docs.pramanikgroup.com/api', chunks: 'Web Sync', status: 'Synced' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] text-xs">
                    <span className="text-slate-300 truncate max-w-[220px]">{doc.name}</span>
                    <span className="text-slate-500">{doc.chunks}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES SECTION */}
      <section className="py-24 bg-[#090C16] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="cyan" className="mb-3">Industry Solutions</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trained for Your Sector.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              From clinic scheduling to real estate inquiries and customer support, Client Care adapts to the specific workflows of your industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <div
                  key={idx}
                  className="card-surface rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.16] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{ind.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING SECTION PREVIEW */}
      <section id="pricing" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="blue" className="mb-3">Transparent Economics</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Start Free, Scale Without Limits.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Operate with $0 budget during initial rollout. Upgrade as your automated call volume expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Tier 1: Free MVP */}
            <div className="card-surface rounded-2xl p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Starter MVP</span>
                <div className="mt-3 mb-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400">/ month free forever</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  Perfect for testing AI employees, building knowledge bases, and running browser voice demos.
                </p>
                <div className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Up to 3 Active AI Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Browser Voice Testing Studio</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>CRM & Lead Pipeline Management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>1,500 Knowledge Base Chunks</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="md" onClick={onGetStarted}>
                Get Started Free
              </Button>
            </div>

            {/* Tier 2: Professional Scale (Highlighted) */}
            <div className="card-surface rounded-2xl p-6 sm:p-8 border-2 border-blue-500/50 shadow-2xl relative flex flex-col justify-between group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Growth SaaS</span>
                <div className="mt-3 mb-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mb-6">
                  For growing businesses requiring real telephone lines, outbound speed-to-lead, and integrations.
                </p>
                <div className="space-y-2.5 text-xs text-slate-200 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Unlimited AI Employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Dedicated Inbound & Outbound Phone Number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>2,500 Voice Calling Minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>Zapier & Custom Webhook Automations</span>
                  </div>
                </div>
              </div>
              <Button variant="gradient" size="md" onClick={onGetStarted}>
                Start 14-Day Trial
              </Button>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="card-surface rounded-2xl p-6 sm:p-8 border border-white/[0.08] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
                <div className="mt-3 mb-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">Custom</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">
                  For high-volume operations, multi-line deployments, custom telephony setup, and priority support.
                </p>
                <div className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pramanik Group Dedicated Architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Custom SIP Trunking & Telephony Routing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Tailored Neural Voice Profiles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dedicated Support & Technical Assistance</span>
                  </div>
                </div>
              </div>
              <Button variant="secondary" size="md" onClick={onGetStarted}>
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-[#090D18] border-t border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Everything you need to know about deploying Client Care AI employees.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="card-surface rounded-xl border border-white/[0.06] overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === index ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-white/[0.04] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-b from-[#0F172A] to-[#070A12] border border-blue-500/30 shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold mb-4 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready for Immediate Deployment</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Your Business Deserves an AI Team.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
              Join forward-thinking companies automating customer care, sales, and calling with Client Care.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="gradient" size="lg" onClick={onGetStarted} icon={ArrowRight}>
                Build Your AI Employee
              </Button>
              <Button variant="secondary" size="lg" onClick={onOpenVoiceDemo} icon={PhoneCall}>
                Talk to Client Care
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#05070D] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <Logo size="md" />
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                AI-powered customer care, sales, calling and business automation platform.
              </p>
              <div className="text-[11px] text-slate-500">
                A Business Platform of <span className="text-slate-300 font-semibold">Pramanik Group</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#ai-team" className="hover:text-white transition-colors">AI Employees</a></li>
                <li><a href="#voice-ai" className="hover:text-white transition-colors">AI Voice</a></li>
                <li><a href="#crm" className="hover:text-white transition-colors">CRM & Pipeline</a></li>
                <li><a href="#automation" className="hover:text-white transition-colors">Automation</a></li>
                <li><a href="#knowledge" className="hover:text-white transition-colors">Knowledge Base</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">About Us</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Pramanik Group</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Careers</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Legal & Trust</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Security & Privacy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Compliance Guidelines</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>&copy; 2026 Client Care. A Business Platform of Pramanik Group. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Business Platform</span>
              <span>Neural Audio</span>
              <span>Cloud Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
