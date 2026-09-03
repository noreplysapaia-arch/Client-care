import React from 'react';
import {
  Users,
  PhoneCall,
  UserCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity,
  CheckCircle2,
  Phone,
  BarChart,
  MessageSquare,
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { AIEmployee, Lead, AICall, AppView } from '../../types';
import { StatusIndicator } from '../ui/StatusIndicator';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface DashboardHomeProps {
  agents: AIEmployee[];
  leads: Lead[];
  calls: AICall[];
  onNavigate: (view: AppView) => void;
  onOpenVoiceDemo: () => void;
  onSelectCall: (call: AICall) => void;
  onTestAgent: (agent: AIEmployee) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  agents,
  leads,
  calls,
  onNavigate,
  onOpenVoiceDemo,
  onSelectCall,
  onTestAgent,
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good evening, Sajid.
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              System Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here's what's happening with your business today across Pramanik Group client channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('calls')}
            icon={PhoneCall}
          >
            All AI Calls
          </Button>
          <Button
            variant="gradient"
            size="sm"
            onClick={onOpenVoiceDemo}
            icon={Sparkles}
          >
            Test Live Voice
          </Button>
        </div>
      </div>

      {/* TOP 4 KEY SAAS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <MetricCard
          label="Total Leads"
          value="1,284"
          change="+18.4%"
          isPositive={true}
          period="vs last 30d"
          icon={Users}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <MetricCard
          label="AI Calls Automated"
          value="356"
          change="+24.1%"
          isPositive={true}
          period="this week"
          icon={PhoneCall}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
        <MetricCard
          label="Qualified Leads"
          value="87"
          change="+12.8%"
          isPositive={true}
          period="high intent"
          icon={UserCheck}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
        <MetricCard
          label="Appointments Booked"
          value="43"
          change="+31.5%"
          isPositive={true}
          period="zero human touch"
          icon={Calendar}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
      </div>

      {/* SECOND ROW: AI CALLS OVERVIEW & LEADS BY SOURCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Calls Overview & Hourly Activity (2 cols) */}
        <div className="lg:col-span-2 card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">AI Calling Activity (Last 7 Days)</h3>
              <p className="text-xs text-slate-400">Total 356 automated phone sessions • 97.4% completion rate</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">Avg 2m 14s</Badge>
            </div>
          </div>

          {/* Clean custom SVG chart representation */}
          <div className="h-48 w-full flex items-end justify-between gap-3 pt-4 px-2 pb-2">
            {[
              { day: 'Mon', calls: 42, height: '48%' },
              { day: 'Tue', calls: 58, height: '66%' },
              { day: 'Wed', calls: 51, height: '58%' },
              { day: 'Thu', calls: 69, height: '82%' },
              { day: 'Fri', calls: 76, height: '92%' },
              { day: 'Sat', calls: 32, height: '36%' },
              { day: 'Sun', calls: 28, height: '32%' },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  {bar.calls}
                </div>
                <div className="w-full max-w-[42px] bg-slate-800/80 rounded-t-lg overflow-hidden relative flex items-end" style={{ height: bar.height }}>
                  <div className="w-full h-full bg-gradient-to-t from-blue-600 via-indigo-600 to-cyan-400 group-hover:brightness-125 transition-all rounded-t-lg" />
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Inbound Calls (62%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Outbound Speed-to-Lead (38%)</span>
              </span>
            </div>
            <button
              onClick={() => onNavigate('calls')}
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
            >
              <span>Explore Logs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Leads by Source (1 col) */}
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <h3 className="text-sm font-bold text-white">Leads by Source</h3>
              <span className="text-xs text-slate-400">This Month</span>
            </div>

            <div className="space-y-3.5">
              {[
                { source: 'Website Inbound Call', percent: 42, count: 540, color: 'bg-blue-500' },
                { source: 'Speed-to-Lead Webhook', percent: 28, count: 359, color: 'bg-cyan-400' },
                { source: 'Google Ads Inbound', percent: 16, count: 205, color: 'bg-indigo-500' },
                { source: 'Direct Referral', percent: 14, count: 180, color: 'bg-violet-400' },
              ].map((src, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{src.source}</span>
                    <span className="text-slate-400 font-semibold">{src.count} ({src.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className={`${src.color} h-full rounded-full`} style={{ width: `${src.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <button
              onClick={() => onNavigate('crm')}
              className="w-full py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 text-center transition-colors"
            >
              Open Lead Pipeline &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* THIRD ROW: YOUR AI EMPLOYEES & RECENT CONVERSATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Your AI Employees (1 col) */}
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Your AI Employees</h3>
                <Badge variant="blue" size="sm">6 Active</Badge>
              </div>
              <button
                onClick={() => onNavigate('agents')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium"
              >
                Manage &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {agents.slice(0, 4).map((agent) => (
                <div
                  key={agent.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                      <p className="text-[11px] text-slate-400">{agent.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onTestAgent(agent)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 text-[11px] font-semibold border border-blue-500/30 transition-colors"
                  >
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] mt-4">
            <button
              onClick={() => onNavigate('agent-builder')}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-xs font-semibold text-blue-300 hover:text-white text-center transition-all"
            >
              + Create New Employee
            </button>
          </div>
        </div>

        {/* Recent Conversations & Call Summary Feed (2 cols) */}
        <div className="lg:col-span-2 card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Recent AI Call Transcripts & Outcomes</h3>
              <Badge variant="emerald" size="sm">Real-Time Ingestion</Badge>
            </div>
            <button
              onClick={() => onNavigate('calls')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View All Calls &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {calls.slice(0, 3).map((call) => (
              <div
                key={call.id}
                onClick={() => onSelectCall(call)}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-blue-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                        {call.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">({call.customerCompany})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="cyan" size="sm">Intent: {call.leadScore}/100</Badge>
                    <span className="text-slate-500 font-mono text-[11px]">{call.duration}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  "{call.summary}"
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/[0.04]">
                  <span className="text-slate-400">
                    Handled by <strong className="text-slate-200">{call.aiEmployeeName}</strong> ({call.aiEmployeeRole})
                  </span>
                  <span className="text-blue-400 font-medium flex items-center gap-1">
                    <span>Inspect Transcript</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
