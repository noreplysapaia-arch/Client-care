import React, { useState, useEffect } from 'react';
import {
  Plus,
  PhoneCall,
  Database,
  Clock,
  Sparkles,
  ArrowDown,
  Trash2,
} from 'lucide-react';
import { AutomationWorkflow, WorkflowStep } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface AutomationsPageProps {
  workflows: AutomationWorkflow[];
  onToggleWorkflow: (id: string) => void;
  onAddWorkflow?: (wf: AutomationWorkflow) => void;
  onUpdateWorkflow?: (id: string, data: Partial<AutomationWorkflow>) => void;
  onDeleteWorkflow?: (id: string) => void;
  onOpenVoiceDemo: () => void;
}

export const AutomationsPage: React.FC<AutomationsPageProps> = ({
  workflows,
  onToggleWorkflow,
  onAddWorkflow,
  onUpdateWorkflow,
  onDeleteWorkflow,
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(
    workflows[0]?.id || ''
  );
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState<boolean>(false);
  const [isCreateWfModalOpen, setIsCreateWfModalOpen] = useState<boolean>(false);

  // New step form
  const [newStepType, setNewStepType] = useState<WorkflowStep['type']>('ai_call');
  const [newStepLabel, setNewStepLabel] = useState<string>('');
  const [newStepDesc, setNewStepDesc] = useState<string>('');

  // New workflow form
  const [newWfTitle, setNewWfTitle] = useState<string>('');
  const [newWfDesc, setNewWfDesc] = useState<string>('');
  const [newWfTrigger, setNewWfTrigger] = useState<string>('Incoming Call Completed');

  // Keep selected workflow reference updated from real-time workflows
  useEffect(() => {
    if (!selectedWorkflowId && workflows.length > 0) {
      setSelectedWorkflowId(workflows[0].id);
    }
  }, [workflows, selectedWorkflowId]);

  const selectedWorkflow =
    workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];

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
    if (!newStepLabel || !selectedWorkflow) return;

    const newStep: WorkflowStep = {
      id: `st_${Date.now()}`,
      type: newStepType,
      label: newStepLabel,
      description: newStepDesc || 'Automated node execution',
    };

    const updatedSteps = [...(selectedWorkflow.steps || []), newStep];
    if (onUpdateWorkflow) {
      onUpdateWorkflow(selectedWorkflow.id, { steps: updatedSteps });
    }

    setIsAddStepModalOpen(false);
    setNewStepLabel('');
    setNewStepDesc('');
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWfTitle) return;

    const newWf: AutomationWorkflow = {
      id: `wf_${Date.now()}`,
      title: newWfTitle,
      description: newWfDesc || 'Custom autopilot workflow for client communication and telemetry',
      active: true,
      trigger: newWfTrigger,
      executionsCount: 0,
      successRate: 100,
      steps: [
        {
          id: `st_${Date.now()}_1`,
          type: 'trigger',
          label: newWfTrigger,
          description: 'Initial event trigger',
        },
        {
          id: `st_${Date.now()}_2`,
          type: 'ai_call',
          label: 'AI Call Assistant Engagement',
          description: 'Dispatches autonomous voice agent to qualify and triage',
        },
      ],
    };

    if (onAddWorkflow) onAddWorkflow(newWf);
    setSelectedWorkflowId(newWf.id);
    setIsCreateWfModalOpen(false);
    setNewWfTitle('');
    setNewWfDesc('');
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
              {workflows.length} Real-Time Autopilots
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual orchestrations connecting inbound webhooks, AI phone calls, sentiment filters, and Firestore sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsCreateWfModalOpen(true)}
            icon={Plus}
          >
            New Autopilot
          </Button>
          {selectedWorkflow && (
            <Button
              variant="gradient"
              size="md"
              onClick={() => setIsAddStepModalOpen(true)}
              icon={Plus}
            >
              Add Node
            </Button>
          )}
        </div>
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
              const isSelected = selectedWorkflow?.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflowId(wf.id)}
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
                      className="px-2 py-0.5 rounded-full border text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      {wf.active ? (
                        <span className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10">ACTIVE</span>
                      ) : (
                        <span className="text-slate-500 border-slate-600/30 bg-slate-500/10">PAUSED</span>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {wf.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
                    <span>{wf.executionsCount} runs</span>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-semibold">{wf.successRate}% success</span>
                      {onDeleteWorkflow && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete workflow "${wf.title}"?`)) {
                              onDeleteWorkflow(wf.id);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                          title="Delete Workflow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Visual Node Canvas (2 cols) */}
        {selectedWorkflow ? (
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
                {selectedWorkflow.steps?.map((step, idx) => {
                  const Icon = nodeIcons[step.type] || Database;
                  const colorClass = nodeColors[step.type] || nodeColors.action;

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
                              </div>
                              <h5 className="text-xs font-bold text-white mt-0.5">{step.label}</h5>
                              <p className="text-[11px] text-slate-300 mt-0.5">{step.description}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const updatedSteps = selectedWorkflow.steps.filter((s) => s.id !== step.id);
                              if (onUpdateWorkflow) {
                                onUpdateWorkflow(selectedWorkflow.id, { steps: updatedSteps });
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-rose-300 transition-opacity cursor-pointer"
                            title="Remove Step"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
              <span>Trigger: <strong className="text-white">{selectedWorkflow.trigger}</strong></span>
              <span className="text-emerald-400 font-semibold">Firestore Synced</span>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 card-surface rounded-2xl p-12 text-center text-slate-400">
            Select or create a workflow to view its automation chain.
          </div>
        )}
      </div>

      {/* INSERT STEP MODAL */}
      <Modal
        isOpen={isAddStepModalOpen}
        onClose={() => setIsAddStepModalOpen(false)}
        title="Insert Automation Node"
        subtitle="Add a logic condition, AI Voice call, or database trigger to this flow"
        maxWidth="md"
      >
        <form onSubmit={handleAddStep} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Node Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: 'ai_call', label: 'AI Phone Call' },
                { type: 'condition', label: 'Filter Rule' },
                { type: 'action', label: 'CRM Sync' },
                { type: 'delay', label: 'Time Delay' },
                { type: 'trigger', label: 'Webhook' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.type}
                  onClick={() => setNewStepType(t.type as any)}
                  className={`p-2.5 rounded-xl border text-center font-semibold text-[11px] transition-all cursor-pointer ${
                    newStepType === t.type
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Step Label
            </label>
            <input
              type="text"
              required
              value={newStepLabel}
              onChange={(e) => setNewStepLabel(e.target.value)}
              placeholder="e.g. Schedule AI Follow-Up Call"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Execution Description
            </label>
            <textarea
              rows={2}
              value={newStepDesc}
              onChange={(e) => setNewStepDesc(e.target.value)}
              placeholder="e.g. Dials customer phone after 10 minutes if proposal not opened"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddStepModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Save Step to Firestore
            </Button>
          </div>
        </form>
      </Modal>

      {/* CREATE WORKFLOW MODAL */}
      <Modal
        isOpen={isCreateWfModalOpen}
        onClose={() => setIsCreateWfModalOpen(false)}
        title="Create Autopilot Workflow"
        subtitle="Design a new multi-step automation connected to Firestore"
        maxWidth="md"
      >
        <form onSubmit={handleCreateWorkflow} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Workflow Title
            </label>
            <input
              type="text"
              required
              value={newWfTitle}
              onChange={(e) => setNewWfTitle(e.target.value)}
              placeholder="e.g. VIP Inbound Speed-to-Lead"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Trigger Event
            </label>
            <select
              value={newWfTrigger}
              onChange={(e) => setNewWfTrigger(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Incoming Call Completed" className="bg-[#0b0f19]">Incoming Call Completed</option>
              <option value="New Lead Enrolled in CRM" className="bg-[#0b0f19]">New Lead Enrolled in CRM</option>
              <option value="Appointment Scheduled" className="bg-[#0b0f19]">Appointment Scheduled</option>
              <option value="Negative Sentiment Detected" className="bg-[#0b0f19]">Negative Sentiment Detected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              value={newWfDesc}
              onChange={(e) => setNewWfDesc(e.target.value)}
              placeholder="e.g. Automatically follows up with high value leads within 60 seconds"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsCreateWfModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Create in Firestore
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
