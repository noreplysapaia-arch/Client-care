import React from 'react';

interface VoiceWaveformProps {
  state?: 'idle' | 'listening' | 'speaking' | 'thinking';
  bars?: number;
  height?: number;
  className?: string;
  color?: 'blue' | 'cyan' | 'violet' | 'emerald';
  audioLevel?: number; // 0.0 to 1.0 real-time audio volume
  frequencyData?: Uint8Array | number[]; // Real frequency spectrum data
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({
  state = 'speaking',
  bars = 28,
  height = 36,
  className = '',
  color = 'cyan',
  audioLevel,
  frequencyData,
}) => {
  const colorMap = {
    blue: 'bg-gradient-to-t from-blue-600 to-indigo-400',
    cyan: 'bg-gradient-to-t from-cyan-500 to-blue-400',
    violet: 'bg-gradient-to-t from-purple-500 to-violet-400',
    emerald: 'bg-gradient-to-t from-emerald-500 to-teal-300',
  };

  const hasLiveAudio = typeof audioLevel === 'number' && audioLevel > 0.01;

  return (
    <div
      className={`flex items-center justify-center gap-[3px] select-none ${className}`}
      style={{ height: `${height}px` }}
      aria-label={`Voice status: ${state}`}
    >
      {Array.from({ length: bars }).map((_, idx) => {
        // If live frequency/level data is provided
        if (hasLiveAudio && frequencyData && frequencyData.length > 0) {
          const sampleIndex = Math.floor((idx / bars) * frequencyData.length);
          const rawVal = frequencyData[sampleIndex] || 0;
          const normalized = Math.max(12, Math.min(100, (rawVal / 255) * 100 * 1.3));

          return (
            <div
              key={idx}
              className={`w-[3px] rounded-full transition-all duration-75 ${colorMap[color]}`}
              style={{
                height: `${normalized}%`,
                opacity: 0.95,
              }}
            />
          );
        }

        if (hasLiveAudio && audioLevel !== undefined) {
          const centerDistance = Math.abs(idx - bars / 2) / (bars / 2);
          const bellCurve = 1 - centerDistance * 0.45;
          const livePercent = Math.max(12, Math.min(100, audioLevel * 100 * bellCurve * 1.5));

          return (
            <div
              key={idx}
              className={`w-[3px] rounded-full transition-all duration-100 ${colorMap[color]}`}
              style={{
                height: `${livePercent}%`,
                opacity: 0.95,
              }}
            />
          );
        }

        // Procedural rhythmic animation fallback
        const centerDistance = Math.abs(idx - bars / 2) / (bars / 2);
        const baseFactor = 1 - centerDistance * 0.4;
        
        let minH = 15;
        let maxH = 95;
        let speed = 1.0;

        if (state === 'idle') {
          minH = 10;
          maxH = 20;
          speed = 2.4;
        } else if (state === 'listening') {
          minH = 20;
          maxH = 55;
          speed = 1.4;
        } else if (state === 'thinking') {
          minH = 25;
          maxH = 70;
          speed = 0.8;
        } else {
          // speaking
          minH = 20;
          maxH = 100;
          speed = 0.9;
        }

        const animDelay = (idx % 7) * 0.12;
        const barHeightPercent = Math.max(12, Math.min(100, Math.sin((idx / bars) * Math.PI) * maxH * baseFactor));

        return (
          <div
            key={idx}
            className={`w-[3px] rounded-full transition-all duration-200 ${colorMap[color]}`}
            style={{
              height: state === 'idle' ? '15%' : `${barHeightPercent}%`,
              animation:
                state !== 'idle'
                  ? `pulse-subtle ${speed}s ease-in-out infinite alternate ${animDelay}s`
                  : 'none',
              opacity: state === 'idle' ? 0.35 : 0.9,
            }}
          />
        );
      })}
    </div>
  );
};
