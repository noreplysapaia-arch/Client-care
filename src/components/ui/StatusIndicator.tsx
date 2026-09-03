import React from 'react';

export interface StatusIndicatorProps {
  status: 'active' | 'online' | 'paused' | 'training' | 'listening' | 'thinking' | 'speaking' | 'completed' | 'failed';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  size = 'md',
  pulse = true,
}) => {
  const configs = {
    active: { color: 'bg-emerald-400', ring: 'bg-emerald-400/30', text: 'text-emerald-400', defaultLabel: 'Active' },
    online: { color: 'bg-emerald-400', ring: 'bg-emerald-400/30', text: 'text-emerald-400', defaultLabel: 'Online' },
    paused: { color: 'bg-amber-400', ring: 'bg-amber-400/30', text: 'text-amber-400', defaultLabel: 'Paused' },
    training: { color: 'bg-purple-400', ring: 'bg-purple-400/30', text: 'text-purple-400', defaultLabel: 'Training' },
    listening: { color: 'bg-cyan-400', ring: 'bg-cyan-400/30', text: 'text-cyan-400', defaultLabel: 'Listening...' },
    thinking: { color: 'bg-violet-400', ring: 'bg-violet-400/30', text: 'text-violet-400', defaultLabel: 'Thinking...' },
    speaking: { color: 'bg-blue-400', ring: 'bg-blue-400/30', text: 'text-blue-400', defaultLabel: 'Speaking...' },
    completed: { color: 'bg-emerald-400', ring: 'bg-emerald-400/30', text: 'text-emerald-400', defaultLabel: 'Completed' },
    failed: { color: 'bg-rose-400', ring: 'bg-rose-400/30', text: 'text-rose-400', defaultLabel: 'Failed' },
  };

  const config = configs[status] || configs.active;
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  const textClass = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className="inline-flex items-center gap-2">
      <span className="relative flex items-center justify-center">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${config.ring}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${config.color}`} />
      </span>
      {(label || config.defaultLabel) && (
        <span className={`font-medium tracking-wide ${config.text} ${textClass}`}>
          {label ?? config.defaultLabel}
        </span>
      )}
    </div>
  );
};
