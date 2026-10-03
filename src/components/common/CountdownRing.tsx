import React, { useEffect, useState } from 'react';
import { soundManager } from '../../utils/audio';

interface CountdownRingProps {
  expiresAt: number;
  totalDurationSeconds?: number;
  size?: number;
  strokeWidth?: number;
  onExpire?: () => void;
  showLabel?: boolean;
  language?: 'en' | 'hi' | 'mr';
}

export const CountdownRing: React.FC<CountdownRingProps> = ({
  expiresAt,
  totalDurationSeconds = 120,
  size = 64,
  strokeWidth = 5,
  onExpire,
  showLabel = false,
  language = 'en',
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

  // Functional status colors
  let colorStroke = '#059669'; // emerald-600
  let textColorClass = 'text-neutral-900';

  if (remainingSeconds <= 30) {
    colorStroke = '#dc2626'; // red-600
    textColorClass = 'text-red-600';
  } else if (remainingSeconds <= 60) {
    colorStroke = '#d97706'; // amber-600
    textColorClass = 'text-amber-700';
  }

  // Label translations
  const labelText =
    remainingSeconds === 0
      ? language === 'hi'
        ? 'समाप्त'
        : language === 'mr'
        ? 'समाप्त'
        : 'Expired'
      : language === 'hi'
      ? 'शेष'
      : language === 'mr'
      ? 'शिल्लक'
      : 'Left';

  // Responsive font sizes so text never overflows the circle
  const isCompact = size <= 70;
  const fontSizeClass = size < 55 ? 'text-[11px]' : size < 80 ? 'text-xs sm:text-sm' : 'text-xl sm:text-2xl';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#f1f5f9"
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

      {/* Digital readout - perfectly centered and never overflowing */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none p-1">
        <span className={`font-mono font-black tracking-tight tabular-nums leading-none ${fontSizeClass} ${textColorClass}`}>
          {formattedMinutes}:{formattedSeconds}
        </span>
        {showLabel && !isCompact && (
          <span className="text-[9px] tracking-wider text-neutral-400 font-bold uppercase mt-1 leading-none">
            {labelText}
          </span>
        )}
      </div>
    </div>
  );
};
