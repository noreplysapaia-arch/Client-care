import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bot,
  User,
  Sliders,
  Database,
  Volume2,
  ShieldAlert,
  Play,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { AIEmployee } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusIndicator } from '../ui/StatusIndicator';

interface AgentBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newAgent: AIEmployee) => void;
  onTestAgent: (agent: AIEmployee) => void;
}

export const AgentBuilderModal: React.FC<AgentBuilderModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  onTestAgent,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [role, setRole] = useState<string>('Sales Assistant');
  const [name, setName] = useState<string>('Sophia');
  const [avatar, setAvatar] = useState<string>(
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80'
  );
  const [language, setLanguage] = useState<string>('English (US)');
  const [personality, setPersonality] = useState<string>(
    'Consultative, confident, articulate, and empathetic'
  );
  const [voice, setVoice] = useState<string>('Alloy Warm (Low Latency Neural)');
  const [businessGoal, setBusinessGoal] = useState<string>(
    'Qualify inbound high-ticket leads and schedule executive demos within 3 minutes.'
  );
  const [instructions, setInstructions] = useState<string>(
    'Always uncover core pain points before pitching tiers. Never oversell; highlight enterprise security and ROI.'
  );
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([
    'Master Product Catalog',
    'Enterprise Pricing Matrix',
  ]);
  const [escalationRule, setEscalationRule] = useState<string>(
    'Warm-transfer to Sales Director if customer indicates budget over $20,000 ARR or asks for human supervisor.'
  );

  if (!isOpen) return null;

  const totalSteps = 8;

  const stepsList = [
    { num: 1, label: 'Role', desc: 'Select primary function' },
    { num: 2, label: 'Identity', desc: 'Name, avatar & language' },
    { num: 3, label: 'Personality', desc: 'Tone & communication style' },
    { num: 4, label: 'Knowledge', desc: 'Attach training sources' },
    { num: 5, label: 'Voice', desc: 'Audio engine & speed' },
    { num: 6, label: 'Behavior', desc: 'Goals & escalation rules' },
    { num: 7, label: 'Review', desc: 'Inspect live summary' },
    { num: 8, label: 'Deploy', desc: 'Activate phone & web line' },
  ];

  const presetRoles = [
    { title: 'Sales Assistant', desc: 'Lead qualification, objection handling, demo scheduling' },
    { title: 'Customer Support Agent', desc: '24/7 ticket resolution, policy lookup, troubleshooting' },
    { title: 'AI Receptionist', desc: 'Front-desk call screening, staff routing, message logging' },
    { title: 'Speed-to-Lead Qualifier', desc: 'Under-60-second callbacks on webform submissions' },
    { title: 'Appointment Specialist', desc: 'Calendar management, reschedule handling, no-show reduction' },
    { title: 'Retention & Follow-up Agent', desc: 'Post-demo outreach, satisfaction calls, churn defense' },
  ];

  const presetVoices = [
    { name: 'Alloy Warm (Low Latency Neural)', type: 'Female / Executive Natural' },
    { name: 'Echo Crisp (Clear Technical)', type: 'Male / Methodical Reassuring' },
    { name: 'Fable Friendly (Natural Professional)', type: 'Female / Warm Front-Desk' },
    { name: 'Onyx Direct (Authoritative)', type: 'Male / Decisive Business' },
    { name: 'Nova Smooth (Soft Warm)', type: 'Female / Empathetic Coordinator' },
  ];

  const availableDocs = [
    'Master Product Catalog',
    'Enterprise Pricing Matrix',
    'Competitive Battlecards',
    'API Documentation',
    'Troubleshooting Runbooks',
    'Executive Office Calendar',
  ];

  const handleToggleDoc = (doc: string) => {
    setSelectedKnowledge((prev) =>
      prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]
    );
  };

  const handleFinishDeployment = () => {
    const newEmployee: AIEmployee = {
      id: `emp_${Date.now()}`,
      name,
      role,
      avatar,
      badgeColor: 'from-blue-500 to-indigo-500',
      status: 'active',
      capability: role,
      description: `${personality}. Formulated to achieve: ${businessGoal}`,
      language,
      voice,
      personality,
      businessGoal,
      instructions,
      knowledgeSources: selectedKnowledge,
      escalationRule,
      callsCount: 0,
      successRate: 100,
      avgHandlingSec: 120,
      phoneExtension: `+1 (800) 412-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    onCreated(newEmployee);
    onClose();
  };

  const currentConstructedAgent: AIEmployee = {
    id: 'preview_id',
    name,
    role,
    avatar,
    badgeColor: 'from-blue-500 to-indigo-500',
    status: 'active',
    capability: role,
    description: personality,
    language,
    voice,
    personality,
    businessGoal,
    instructions,
    knowledgeSources: selectedKnowledge,
    escalationRule,
    callsCount: 0,
    successRate: 100,
    avgHandlingSec: 120,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#04060B]/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl card-surface rounded-3xl border border-white/[0.12] shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Create AI Employee
              </h3>
              <p className="text-xs text-slate-400">
                Pramanik Group AI Workforce Studio • Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step progress track */}
        <div className="px-6 py-3 bg-[#060810] border-b border-white/[0.06] overflow-x-auto">
          <div className="flex items-center justify-between min-w-[650px] gap-2">
            {stepsList.map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex items-center gap-2 text-left cursor-pointer transition-all ${
                    isActive
                      ? 'text-blue-400 font-bold'
                      : isPast
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-400'
                        : isPast
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-white/[0.04] text-slate-500 border-white/[0.08]'
                    }`}
                  >
                    {isPast ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                  <span className="text-xs whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: ROLE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Select Employee Role</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose a specialized business function. Each role comes pre-trained with standard conversational objectives.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {presetRoles.map((r, i) => (
                  <div
                    key={i}
                    onClick={() => setRole(r.title)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      role === r.title
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{r.title}</span>
                      {role === r.title && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-slate-400">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: IDENTITY */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="text-lg font-bold text-white">Employee Identity</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define the name, avatar, and spoken language for this AI employee.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Sophia, Jordan, Liam"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Spoken Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-[#080B14] border border-white/[0.1] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK & Global)">English (UK & Global)</option>
                    <option value="Spanish (Latin America & Spain)">Spanish (Latin America & Spain)</option>
                    <option value="French (Standard)">French (Standard)</option>
                    <option value="German (Professional)">German (Professional)</option>
                    <option value="Arabic (Standard Business)">Arabic (Standard Business)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Choose Avatar
                </label>
                <div className="flex items-center gap-3">
                  {[
                    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
                  ].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="avatar option"
                      onClick={() => setAvatar(url)}
                      className={`w-12 h-12 rounded-xl object-cover cursor-pointer transition-all ${
                        avatar === url ? 'ring-2 ring-blue-500 scale-105' : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PERSONALITY */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Tone & Personality</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  How should {name} interact with customers during phone and chat conversations?
                </p>
              </div>
              <div className="space-y-3 pt-2">
                {[
                  'Consultative, confident, articulate, and empathetic',
                  'Warm, polite, hospitable, and patient',
                  'Concise, methodical, technical, and precise',
                  'Direct, energetic, courteous, and fast-paced',
                ].map((tone, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPersonality(tone)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      personality === tone
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{tone}</span>
                      {personality === tone && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: KNOWLEDGE SOURCES */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Knowledge Base Grounding</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which verified company documents {name} should reference during calls.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {availableDocs.map((doc, idx) => {
                  const isSelected = selectedKnowledge.includes(doc);
                  return (
                    <div
                      key={idx}
                      onClick={() => handleToggleDoc(doc)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-600/15 border-indigo-500 text-white'
                          : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:border-white/[0.12]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{doc}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Plus className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: VOICE */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Select Neural Voice</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  High quality conversational voice models with natural pacing and responsive synthesis.
                </p>
              </div>
              <div className="space-y-2.5 pt-2">
                {presetVoices.map((v, idx) => (
                  <div
                    key={idx}
                    onClick={() => setVoice(v.name)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      voice === v.name
                        ? 'bg-cyan-600/15 border-cyan-500 text-white'
                        : 'bg-white/[0.03] border-white/[0.06] text-slate-300 hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold block">{v.name}</span>
                        <span className="text-[11px] text-slate-400">{v.type}</span>
                      </div>
                    </div>
                    {voice === v.name && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: BEHAVIOR & ESCALATION */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Business Goal & Escalation Rules</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure success metrics and safety rails for human staff transfer.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Primary Business Objective
                  </label>
                  <textarea
                    rows={2}
                    value={businessGoal}
                    onChange={(e) => setBusinessGoal(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Warm Transfer & Escalation Rule
                  </label>
                  <textarea
                    rows={2}
                    value={escalationRule}
                    onChange={(e) => setEscalationRule(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: REVIEW */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-bold text-white">Review Employee Specification</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm parameters before generating phone extension and deploying to production.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
                  <img src={avatar} alt={name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h5 className="text-sm font-bold text-white">{name}</h5>
                    <p className="text-xs text-slate-400">{role} • {language}</p>
                  </div>
                  <div className="ml-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Play}
                      onClick={() => onTestAgent(currentConstructedAgent)}
                    >
                      Test Voice Now
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block">Voice Engine:</span>
                    <span className="text-slate-200 font-medium">{voice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Knowledge Chunks:</span>
                    <span className="text-slate-200 font-medium">{selectedKnowledge.join(', ')}</span>
                  </div>
                </div>

                <div className="text-xs">
                  <span className="text-slate-500 block">Escalation Trigger:</span>
                  <span className="text-slate-300">{escalationRule}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: DEPLOY */}
          {currentStep === 8 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white tracking-tight">
                {name} is Ready for Deployment!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your new AI employee will be activated with dedicated web endpoints and added to your Pramanik Group organization dashboard.
              </p>
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/20 max-w-sm mx-auto text-xs text-blue-300">
                Extension Assigned: <strong>+1 (800) 412-8820</strong>
              </div>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between">
            <Button
              variant="outline"
              size="md"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              icon={ChevronLeft}
              iconPosition="left"
            >
              Back
            </Button>

            {currentStep < 8 ? (
              <Button
                variant="gradient"
                size="md"
                onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
                icon={ChevronRight}
              >
                Continue
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="md"
                onClick={handleFinishDeployment}
                icon={CheckCircle2}
              >
                Deploy AI Employee
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
