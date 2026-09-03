import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  period?: string;
  icon: LucideIcon;
  iconColor?: string;
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  period = 'vs last 30d',
  icon: Icon,
  iconColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  subtext,
}) => {
  return (
    <div className="card-surface rounded-2xl p-5 border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 relative group overflow-hidden">
      {/* Subtle top ambient glow on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-slate-400 tracking-wide uppercase">
          {label}
        </span>
        <div className={`p-2 rounded-xl border ${iconColor} flex-shrink-0`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
          {value}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>{subtext || period}</span>
      </div>
    </div>
  );
};
