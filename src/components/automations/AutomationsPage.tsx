import React, { useState } from 'react';
import {
  GitBranch,
  Plus,
  Play,
  CheckCircle2,
  PhoneCall,
  Calendar,
  Database,
  Clock,
  Sparkles,
  ArrowDown,
  Trash2,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { AutomationWorkflow, WorkflowStep } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface AutomationsPageProps {
  workflows: AutomationWorkflow[];
  onToggleWorkflow: (id: string) => void;
  onOpenVoiceDemo: () => void;
}

export const AutomationsPage: React.FC<AutomationsPageProps> = ({
  workflows,
  onToggleWorkflow,
  onOpenVoiceDemo,
}) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow>(workflows[0]);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState<boolean>(false);
  const [newStepType, setNewStepType] = useState<WorkflowStep['type']>('ai_call');
  const [newStepLabel, setNewStepLabel] = useState<string>('');
  const [newStepDesc, setNewStepDesc] = useState<string>('');

  const nodeIcons = {
    trigger: Clock,
    ai_call: PhoneCall,
    condition: Sparkles,
    action: Database,
    delay: Clock,
  };

  const nodeColors = {
    trigger: 'bg-blue-500/10 border-blue-500/40 text-blue-400',
    ai_call: 'bg-indigo-500/10 border-indigo-500/40 text-indigo-400',
    condition: 'bg-purple-500/10 border-purple-500/40 text-purple-400',
    action: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
    delay: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepLabel) return;

    const newStep: WorkflowStep = {
      id: `st_${Date.now()}`,
      type: newStepType,
      label: newStepLabel,
      description: newStepDesc || 'Automated node execution',
    };

    setSelectedWorkflow((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));

    setIsAddStepModalOpen(false);
    setNewStepLabel('');
    setNewStepDesc('');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Workflow Automations
            </h1>
            <Badge variant="violet" size="md">
              {workflows.length} Active Autopilots
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual orchestrations connecting inbound webhooks, AI phone calls, sentiment filters, and CRM sync.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setIsAddStepModalOpen(true)}
          icon={Plus}
        >
          Add Workflow Node
        </Button>
      </div>

      {/* Main Builder View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Workflow Selector */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Deployed Autopilots
          </span>

          <div className="space-y-3">
            {workflows.map((wf) => {
              const isSelected = selectedWorkflow.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'card-surface border-white/[0.08] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {wf.title}
                    </h4>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWorkflow(wf.id);
                      }}
                      className="text-slate-400 hover:text-white"
                    >
                      {wf.active ? (
                        <span className="text-emerald-400 font-semibold text-[10px]">ACTIVE</span>
                      ) : (
                        <span className="text-slate-500 font-semibold text-[10px]">PAUSED</span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {wf.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                    <span>{wf.executionsCount} runs</span>
                    <span className="text-emerald-400 font-semibold">{wf.successRate}% success</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Node Canvas (2 cols) */}
        <div className="lg:col-span-2 card-surface rounded-2xl p-6 sm:p-8 border border-white/[0.1] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <div>
                <h3 className="text-base font-bold text-white">{selectedWorkflow.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedWorkflow.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddStepModalOpen(true)}
                icon={Plus}
              >
                Insert Step
              </Button>
            </div>

            {/* Visual Node Chain */}
            <div className="flex flex-col items-center gap-3 py-4 max-w-xl mx-auto">
              {selectedWorkflow.steps.map((step, idx) => {
                const Icon = nodeIcons[step.type] || Database;
                const colorClass = nodeColors[step.type] || nodeColors.action;
                const isBranch = step.branch;

                return (
                  <React.Fragment key={step.id}>
                    {idx > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-6 bg-gradient-to-b from-blue-500/50 to-indigo-500/50" />
                        <ArrowDown className="w-3 h-3 text-slate-500 -mt-1" />
                      </div>
                    )}

                    <div
                      className={`w-full p-4 rounded-2xl border shadow-lg relative group transition-all hover:scale-[1.01] ${colorClass}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.08]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                                {step.type.replace('_', ' ')}
                              </span>
                              {isBranch && (
                                <span
                                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                    isBranch === 'yes'
                                      ? 'bg-emerald-500/20 text-emerald-300'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  Branch: {isBranch}
                                </span>
                              )}
                            </div>
                            <h5 className="text-xs font-bold text-white mt-0.5">{step.label}</h5>
                            <p className="text-[11px] text-slate-300 mt-0.5">{step.description}</p>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
            <span>
              Connected to: <strong>Pramanik Group Webhooks & SIP Trunks</strong>
            </span>
            <Button variant="primary" size="sm" onClick={onOpenVoiceDemo}>
              Simulate Trigger Now
            </Button>
          </div>
        </div>
      </div>

      {/* ADD NODE MODAL */}
      <Modal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        title="Add Automation Node"
        subtitle="Insert a logic rule, AI phone action, or CRM dispatch into the flow"
        maxWidth="md"
      >
        <form onSubmit={handleAddStep} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Node Type
            </label>
            <select
              value={newStepType}
              onChange={(e) => setNewStepType(e.target.value as any)}
              className="w-full bg-[#080B14] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ai_call">AI Voice Call (Sarah / Alex)</option>
              <option value="condition">Decision / Intent Condition</option>
              <option value="action">CRM & Webhook Action</option>
              <option value="delay">Time Delay (Wait X Seconds/Minutes)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Node Label
            </label>
            <input
              type="text"
              required
              value={newStepLabel}
              onChange={(e) => setNewStepLabel(e.target.value)}
              placeholder="e.g. Inbound Receptionist Greeting"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description & Parameters
            </label>
            <textarea
              rows={2}
              value={newStepDesc}
              onChange={(e) => setNewStepDesc(e.target.value)}
              placeholder="e.g. Triggers within 30 seconds of lead submission and checks calendar availability"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddStepModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Add Node to Sequence
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
