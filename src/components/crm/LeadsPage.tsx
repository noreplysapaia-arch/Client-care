import React, { useState } from 'react';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Lead } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface LeadsPageProps {
  leads: Lead[];
  onAddLead: (lead: Lead) => void;
  onUpdateLeadStatus?: (leadId: string, newStatus: Lead['status']) => void;
  onDeleteLead?: (leadId: string) => void;
  onOpenVoiceDemo: () => void;
}

export const LeadsPage: React.FC<LeadsPageProps> = ({
  leads,
  onAddLead,
  onUpdateLeadStatus,
  onDeleteLead,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  // New Lead form state
  const [newName, setNewName] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newIntent, setNewIntent] = useState<string>('');
  const [newSource, setNewSource] = useState<string>('Inbound Web Call');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.intent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCompany) return;

    const lead: Lead = {
      id: `ld_${Date.now()}`,
      name: newName,
      company: newCompany,
      phone: newPhone || '+1 (555) 019-2831',
      email: newEmail || 'contact@example.com',
      source: newSource,
      aiEmployeeName: 'Sarah',
      status: 'new',
      leadScore: 85,
      intent: newIntent || 'Inbound platform inquiry',
      sentiment: 'positive',
      lastContact: 'Just now',
      nextAction: 'Automated AI Speed-to-Lead Call scheduled in 45s',
      estimatedValue: '$24,000 ARR',
    };

    onAddLead(lead);
    setIsAddModalOpen(false);
    setNewName('');
    setNewCompany('');
    setNewPhone('');
    setNewEmail('');
    setNewIntent('');
  };

  const pipelineStages: { key: Lead['status']; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'contacted', label: 'Contacted' },
    { key: 'qualified', label: 'Qualified' },
    { key: 'proposal', label: 'Proposal' },
    { key: 'won', label: 'Won' },
    { key: 'lost', label: 'Lost' },
  ];

  const getNextStage = (current: Lead['status']): Lead['status'] | null => {
    const order: Lead['status'][] = ['new', 'contacted', 'qualified', 'proposal', 'won'];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Leads & CRM
            </h1>
            <Badge variant="blue" size="md">
              {leads.length} Real-Time Records
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Automated speed-to-lead qualification, buyer intent telemetry, and real-time Firestore pipeline tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle View Mode */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Pipeline Kanban View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="gradient"
            size="md"
            onClick={() => setIsAddModalOpen(true)}
            icon={Plus}
          >
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads by name, company, intent..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'new', 'contacted', 'qualified', 'proposal', 'won', 'lost'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {s === 'all' ? 'All Leads' : s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <div className="card-surface rounded-2xl border border-white/[0.08] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#05070E] border-b border-white/[0.06] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Name & Company</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">AI Employee</th>
                  <th className="py-3.5 px-4">Status / Stage</th>
                  <th className="py-3.5 px-4">Score</th>
                  <th className="py-3.5 px-4">Last Contact</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">{lead.company}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{lead.phone}</div>
                      <div className="text-[11px] text-slate-500">{lead.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-200">
                      {lead.aiEmployeeName}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          onUpdateLeadStatus &&
                          onUpdateLeadStatus(lead.id, e.target.value as Lead['status'])
                        }
                        className="bg-white/[0.05] border border-white/[0.1] text-xs text-white rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500 capitalize"
                      >
                        <option value="new" className="bg-[#0b0f19]">new</option>
                        <option value="contacted" className="bg-[#0b0f19]">contacted</option>
                        <option value="qualified" className="bg-[#0b0f19]">qualified</option>
                        <option value="proposal" className="bg-[#0b0f19]">proposal</option>
                        <option value="won" className="bg-[#0b0f19]">won</option>
                        <option value="lost" className="bg-[#0b0f19]">lost</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-cyan-400 text-sm">{lead.leadScore}</span>
                        <span className="text-[10px] text-slate-500">/100</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {lead.lastContact}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete lead "${lead.name}"?`)) {
                            onDeleteLead && onDeleteLead(lead.id);
                          }
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Lead from Firestore"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN PIPELINE VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.key);
            return (
              <div key={stage.key} className="flex flex-col gap-3 min-w-[220px]">
                <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-xs font-bold text-white capitalize">{stage.label}</span>
                  <span className="text-xs text-slate-400 font-semibold">{stageLeads.length}</span>
                </div>

                <div className="space-y-3 flex-1">
                  {stageLeads.map((lead) => {
                    const next = getNextStage(lead.status);
                    return (
                      <div
                        key={lead.id}
                        className="card-surface rounded-xl p-4 border border-white/[0.08] hover:border-blue-500/40 transition-all space-y-2.5 shadow-md group"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-white">{lead.name}</h4>
                            <p className="text-[10px] text-slate-400">{lead.company}</p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm(`Delete lead "${lead.name}"?`)) {
                                onDeleteLead && onDeleteLead(lead.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-300 line-clamp-2">
                          {lead.intent}
                        </div>

                        <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-400">
                          <span>{lead.aiEmployeeName}</span>
                          {next && onUpdateLeadStatus && (
                            <button
                              onClick={() => onUpdateLeadStatus(lead.id, next)}
                              className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
                              title={`Advance to ${next}`}
                            >
                              <span>Next</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD LEAD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
        subtitle="Manually enroll a prospect or trigger an instant AI speed-to-lead callback"
        maxWidth="md"
      >
        <form onSubmit={handleCreateLead} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Contact Name
            </label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Rachel Adams"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              required
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="e.g. Apex Health Systems"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="+1 (555) 891-2091"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="rachel@apexhealth.com"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Primary Intent or Requirement
            </label>
            <textarea
              rows={2}
              value={newIntent}
              onChange={(e) => setNewIntent(e.target.value)}
              placeholder="e.g. Needs after-hours patient telephone triage"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" size="sm" type="submit">
              Save to Firestore
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
