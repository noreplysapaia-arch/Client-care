import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Users,
  Layers,
  CreditCard,
  Key,
  Shield,
  CheckCircle2,
  ExternalLink,
  Plus,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SettingsPageProps {
  user: UserProfile;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<
    'company' | 'phones' | 'integrations' | 'billing' | 'api'
  >('company');

  const [companyName, setCompanyName] = useState<string>(user.companyName);
  const [parentOrg, setParentOrg] = useState<string>(user.parentOrg);
  const [apiKeyCopied, setApiKeyCopied] = useState<boolean>(false);

  const handleCopyKey = () => {
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.06]">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Organization Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage Pramanik Group brand credentials, telecom numbers, CRM connections, and API keys.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-3">
        {[
          { key: 'company', label: 'Company Profile', icon: Building2 },
          { key: 'phones', label: 'Phone Numbers & SIP', icon: Phone },
          { key: 'integrations', label: 'Integrations & CRMs', icon: Layers },
          { key: 'billing', label: 'Subscription & Limits', icon: CreditCard },
          { key: 'api', label: 'API Keys & Webhooks', icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: COMPANY */}
      {activeTab === 'company' && (
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl max-w-3xl space-y-5">
          <h3 className="text-base font-bold text-white">Brand & Organization Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent Organization
              </label>
              <input
                type="text"
                value={parentOrg}
                onChange={(e) => setParentOrg(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Primary Administrator
            </label>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <span className="font-bold text-white block">{user.name}</span>
                <span className="text-slate-400 text-[11px]">{user.email} • Super Admin</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <Button
              variant="gradient"
              size="sm"
              onClick={() => alert('Organization profile saved successfully.')}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PHONE NUMBERS */}
      {activeTab === 'phones' && (
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl max-w-4xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Assigned Telephony Numbers</h3>
              <p className="text-xs text-slate-400">PSTN & SIP endpoints routed to AI voice employees</p>
            </div>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => alert('Contacting Twilio/Telnyx carrier to provision new toll-free number.')}
              icon={Plus}
            >
              Provision New Number
            </Button>
          </div>

          <div className="space-y-3">
            {[
              { number: '+1 (800) 412-8820', name: 'Main Inbound Sales Line', agent: 'Sarah (Sales Assistant)', status: 'Configured', channel: 'Inbound Voice' },
              { number: '+1 (800) 412-8821', name: 'Client Support Hotline', agent: 'Alex (Support Agent)', status: 'Configured', channel: 'Inbound Support' },
              { number: '+1 (800) 412-8822', name: 'Front Reception Line', agent: 'Nora (Receptionist)', status: 'Configured', channel: 'Reception Routing' },
            ].map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{p.number}</span>
                    <Badge variant="blue" size="sm">{p.status}</Badge>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{p.name}</p>
                </div>

                <div className="flex items-center gap-4 text-slate-300">
                  <span>Routing to: <strong className="text-blue-400">{p.agent}</strong></span>
                  <span className="text-slate-400 text-[11px]">{p.channel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl max-w-4xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">External Integrations</h3>
            <p className="text-xs text-slate-400">Available connectors for CRM synchronization and calendar availability</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'HubSpot CRM', type: 'CRM Pipeline', desc: 'Sync qualified leads, scores, and call transcripts.', connected: false },
              { name: 'Google Calendar', type: 'Scheduling', desc: 'Check slot availability and schedule demos.', connected: false },
              { name: 'Salesforce', type: 'Enterprise CRM', desc: 'Custom object mapping & opportunity updates.', connected: false },
              { name: 'Microsoft Outlook 365', type: 'Scheduling', desc: 'Corporate calendar availability checking.', connected: false },
              { name: 'Zoho CRM', type: 'CRM Suite', desc: 'Lead generation and task automation.', connected: false },
              { name: 'Slack Alerts', type: 'Notifications', desc: 'Push notifications on caller escalation.', connected: false },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <Badge variant="slate" size="sm">Available</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-white/[0.04] flex justify-end">
                  <button
                    onClick={() => alert(`${item.name} integration configuration will be available in connected environment.`)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    Configure Connector &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BILLING */}
      {activeTab === 'billing' && (
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Active Plan & Subscription</h3>
              <p className="text-xs text-slate-400">Pramanik Group Enterprise Tier</p>
            </div>
            <Badge variant="cyan" size="md">Growth Plan ($149/mo)</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">AI Calling Minutes</span>
              <span className="text-lg font-bold text-white">1,420 / 3,000</span>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '47%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">AI Employees</span>
              <span className="text-lg font-bold text-white">6 / 10 Active</span>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '60%' }} />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Knowledge Chunks</span>
              <span className="text-lg font-bold text-white">212 / 1,000</span>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '21%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Next Billing Date: October 1, 2026</span>
              <span className="text-slate-400 text-[11px]">Billed to Mastercard ending in •••• 8291</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('Opening Stripe Customer Portal.')}>
              Manage Billing
            </Button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: API */}
      {activeTab === 'api' && (
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl max-w-3xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">API Keys & Inbound Webhooks</h3>
            <p className="text-xs text-slate-400">Trigger speed-to-lead calls programmatically or sync call transcripts</p>
          </div>

          <div className="space-y-2 text-xs">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Secret API Key (Production)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                readOnly
                value="cc_live_pramanik_94f8a12e87bcd200192e4"
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none"
              />
              <Button variant="outline" size="sm" onClick={handleCopyKey} icon={apiKeyCopied ? Check : Copy}>
                {apiKeyCopied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="space-y-2 text-xs pt-2">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Speed-to-Lead Webhook URL
            </label>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono text-[11px] text-blue-300 select-all">
              https://api.clientcare.ai/v1/webhooks/speed-to-lead/org_pramanik_9d0e
            </div>
            <p className="text-[11px] text-slate-400">
              Send a JSON POST payload with <code>name</code>, <code>phone</code>, and <code>company</code> to initiate an AI callback under 60 seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
