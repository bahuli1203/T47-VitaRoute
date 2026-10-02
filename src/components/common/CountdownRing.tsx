import React, { useEffect, useState } from 'react';
import { soundManager } from '../../utils/audio';

interface CountdownRingProps {
  expiresAt: number;
  totalDurationSeconds?: number;
  size?: number;
  strokeWidth?: number;
  onExpire?: () => void;
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  expiresAt,
  totalDurationSeconds = 120,
  size = 120,
  strokeWidth = 8,
  onExpire,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
  });

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setRemainingSeconds(diff);

      if (diff > 0 && diff <= 10) {
        soundManager.playCountdownTick(true);
      } else if (diff > 0 && diff <= 30 && diff % 5 === 0) {
        soundManager.playCountdownTick(false);
      }

      if (diff <= 0 && onExpire) {
        onExpire();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 500);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, remainingSeconds / totalDurationSeconds));
  const strokeDashoffset = circumference - progressRatio * circumference;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  // Strictly functional status colors
  let colorStroke = '#059669'; // emerald-600
  let textColorClass = 'text-slate-900';

  if (remainingSeconds <= 30) {
    colorStroke = '#dc2626'; // red-600
    textColorClass = 'text-red-700';
  } else if (remainingSeconds <= 60) {
    colorStroke = '#d97706'; // amber-600
    textColorClass = 'text-amber-800';
  }

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#e2e8f0" // slate-200
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress stroke */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colorStroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.4s ease-out, stroke 0.3s ease',
          }}
        />
      </svg>

      {/* Digital readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${textColorClass}`}>
          {formattedMinutes}:{formattedSeconds}
        </span>
        <span className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase mt-0.5">
          {remainingSeconds === 0 ? 'Expired' : 'Remaining'}
        </span>
      </div>
    </div>
  );
};
