import React, { useState } from 'react';
import {
  Plus,
  Play,
  Pause,
  Trash2,
  Edit2,
  Sparkles,
  PhoneCall,
  Volume2,
  Clock,
  CheckCircle2,
  BookOpen,
  Filter,
} from 'lucide-react';
import { AIEmployee } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { StatusIndicator } from '../ui/StatusIndicator';

interface AIEmployeesPageProps {
  agents: AIEmployee[];
  onOpenBuilder: () => void;
  onTestAgent: (agent: AIEmployee) => void;
  onToggleStatus: (agentId: string) => void;
  onDeleteAgent: (agentId: string) => void;
}

export const AIEmployeesPage: React.FC<AIEmployeesPageProps> = ({
  agents,
  onOpenBuilder,
  onTestAgent,
  onToggleStatus,
  onDeleteAgent,
}) => {
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredAgents = agents.filter((a) => {
    if (filterRole === 'all') return true;
    return a.role.toLowerCase().includes(filterRole.toLowerCase());
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Employees
            </h1>
            <Badge variant="blue" size="md">
              {agents.length} Total Deployed
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure conversational personas, knowledge base access, extensions, and escalation protocols.
          </p>
        </div>

        <Button variant="gradient" size="md" onClick={onOpenBuilder} icon={Plus}>
          Create AI Employee
        </Button>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'sales', 'support', 'reception', 'appointment', 'lead'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterRole(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filterRole === tab
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {tab === 'all' ? 'All Roles' : tab}
          </button>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => {
          const isActive = agent.status === 'active';
          return (
            <div
              key={agent.id}
              className="card-surface rounded-2xl p-6 border border-white/[0.08] hover:border-white/[0.18] transition-all duration-300 flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full ring-2 ring-[#080B14] ${
                          isActive ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{agent.role}</p>
                      <div className="mt-1">
                        <StatusIndicator
                          status={isActive ? 'active' : 'paused'}
                          label={isActive ? 'Active' : 'Paused'}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06]">
                    {agent.phoneExtension || 'Ext 8801'}
                  </span>
                </div>

                {/* Capability & Details */}
                <div className="space-y-2.5 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 block mb-0.5">
                      Core Objective
                    </span>
                    <p className="text-xs text-slate-300 font-medium leading-relaxed">
                      {agent.capability}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                {/* Attached Knowledge Chunks & Voice */}
                <div className="pt-3 border-t border-white/[0.06] space-y-2 mb-4 text-[11px] text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Voice Engine:</span>
                    </span>
                    <span className="text-slate-300 font-medium truncate max-w-[140px]">
                      {agent.voice.split('(')[0]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Grounding Chunks:</span>
                    </span>
                    <span className="text-slate-300 font-medium">
                      {agent.knowledgeSources.length} Docs Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onTestAgent(agent)}
                  icon={Play}
                  iconPosition="left"
                  className="flex-1"
                >
                  Test Voice
                </Button>

                <button
                  onClick={() => onToggleStatus(agent.id)}
                  className={`p-2 rounded-xl border text-xs transition-all ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                  title={isActive ? 'Pause Agent' : 'Activate Agent'}
                >
                  {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => onDeleteAgent(agent.id)}
                  className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                  title="Remove Agent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
