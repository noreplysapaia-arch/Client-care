import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowUpRight,
  PhoneCall,
  ShieldAlert,
} from 'lucide-react';
import { MetricCard } from '../ui/MetricCard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Operational Analytics
            </h1>
            <Badge variant="cyan" size="md">
              Real-Time Telemetry
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cost savings, intent taxonomy, conversion funnels, and workforce efficiency benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Date Range:</span>
          <select className="bg-[#080B14] border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs text-white">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Quarter</option>
            <option>Year to Date</option>
          </select>
        </div>
      </div>

      {/* Top 4 Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Human Labor Cost Saved"
          value="$14,820"
          change="+28.3%"
          isPositive={true}
          period="vs human reps"
          icon={DollarSign}
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <MetricCard
          label="Lead Qualification Rate"
          value="71.8%"
          change="+9.2%"
          isPositive={true}
          period="industry avg: 28%"
          icon={TrendingUp}
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <MetricCard
          label="Avg AI Phone Call Duration"
          value="2m 14s"
          change="-18s"
          isPositive={true}
          period="faster resolution"
          icon={Clock}
          iconColor="text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
        />
        <MetricCard
          label="Speed-to-Lead Callback"
          value="38 sec"
          change="99.4%"
          isPositive={true}
          period="within 60 seconds"
          icon={PhoneCall}
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customer Call Intents */}
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Customer Intent Taxonomy</h3>
              <p className="text-xs text-slate-400">Classified across 356 phone conversations</p>
            </div>
            <Badge variant="blue" size="sm">Top 5 Drivers</Badge>
          </div>

          <div className="space-y-4">
            {[
              { intent: 'Product Pricing & Tier Clarification', count: 124, pct: 35, color: 'bg-blue-500' },
              { intent: 'Executive Demo Scheduling', count: 98, pct: 28, color: 'bg-cyan-400' },
              { intent: 'Enterprise Security & Privacy Inquiries', count: 54, pct: 15, color: 'bg-indigo-500' },
              { intent: 'Technical Integration / REST API Support', count: 46, pct: 13, color: 'bg-violet-400' },
              { intent: 'General Front-Desk Office Routing', count: 34, pct: 9, color: 'bg-slate-400' },
            ].map((row, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{row.intent}</span>
                  <span className="text-slate-400 font-semibold">{row.count} ({row.pct}%)</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                  <div className={`${row.color} h-full rounded-full`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Quality Score Distribution */}
        <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Lead Intent Score Distribution</h3>
              <p className="text-xs text-slate-400">Algorithmically scored by Sarah & Alex</p>
            </div>
            <Badge variant="emerald" size="sm">High Intent Bias</Badge>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-4 pt-4 px-2">
            {[
              { range: '0-20', count: 12, height: '18%' },
              { range: '21-40', count: 28, height: '32%' },
              { range: '41-60', count: 64, height: '55%' },
              { range: '61-80', count: 142, height: '85%' },
              { range: '81-100', count: 110, height: '74%' },
            ].map((col, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {col.count}
                </div>
                <div
                  className="w-full max-w-[50px] bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end"
                  style={{ height: col.height }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:brightness-125 transition-all rounded-t-lg" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{col.range}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 mt-2">
            <span>Low Intent (0-40)</span>
            <span className="text-cyan-400 font-semibold">Hot Pipeline (81-100): 31% of Total</span>
          </div>
        </div>
      </div>

      {/* BOTTOM ROI COMPARISON */}
      <div className="card-surface rounded-2xl p-6 border border-white/[0.08] shadow-xl">
        <h3 className="text-sm font-bold text-white mb-4">Enterprise Workforce Unit Economics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
            <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
              Traditional Human Call Center Rep
            </span>
            <div className="text-xl font-bold text-slate-300">$32.50 / hour</div>
            <p className="text-slate-400 text-[11px]">
              Limited to 8-hour shifts, sick days, training costs, and high churn rates.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-2">
            <span className="text-blue-400 block font-semibold uppercase tracking-wider text-[10px]">
              Client Care AI Employee
            </span>
            <div className="text-xl font-bold text-cyan-400">$0.18 / min ($1.08 / call)</div>
            <p className="text-slate-300 text-[11px]">
              24/7/365 active, instantaneous response, verified company knowledge, zero ramp-up time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <span className="text-emerald-400 block font-semibold uppercase tracking-wider text-[10px]">
              Net Projected Annual Savings
            </span>
            <div className="text-xl font-bold text-emerald-400">$84,600 / year</div>
            <p className="text-emerald-300 text-[11px]">
              Based on Pramanik Group current volume of 350 weekly customer inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
