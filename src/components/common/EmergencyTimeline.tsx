import React from 'react';
import { EmergencyTimelineEvent, EmergencyTimelineStep, TIMELINE_STEP_LABELS } from '../../types/bedlink';
import {
  AlertCircle,
  MapPin,
  Ambulance,
  Building2,
  Check,
  X,
  Navigation,
  CircleDot,
  HandMetal,
  CheckCircle2,
} from 'lucide-react';

const STEP_ICONS: Record<EmergencyTimelineStep, React.ComponentType<{ className?: string }>> = {
  sos_triggered: AlertCircle,
  location_acquired: MapPin,
  ambulance_assigned: Ambulance,
  hospital_selected: Building2,
  hospital_accepted: Check,
  hospital_rejected: X,
  ambulance_en_route: Navigation,
  ambulance_arrived: CircleDot,
  patient_handed_over: HandMetal,
  emergency_completed: CheckCircle2,
};

const STEP_COLORS: Record<EmergencyTimelineStep, { bg: string; icon: string; line: string }> = {
  sos_triggered: { bg: 'bg-rose-100', icon: 'text-rose-600', line: 'bg-rose-300' },
  location_acquired: { bg: 'bg-neutral-200', icon: 'text-neutral-800', line: 'bg-neutral-300' },
  ambulance_assigned: { bg: 'bg-neutral-200', icon: 'text-neutral-800', line: 'bg-neutral-300' },
  hospital_selected: { bg: 'bg-amber-100', icon: 'text-amber-800', line: 'bg-amber-300' },
  hospital_accepted: { bg: 'bg-emerald-100', icon: 'text-emerald-700', line: 'bg-emerald-300' },
  hospital_rejected: { bg: 'bg-rose-100', icon: 'text-rose-600', line: 'bg-rose-300' },
  ambulance_en_route: { bg: 'bg-neutral-200', icon: 'text-neutral-800', line: 'bg-neutral-300' },
  ambulance_arrived: { bg: 'bg-emerald-100', icon: 'text-emerald-700', line: 'bg-emerald-300' },
  patient_handed_over: { bg: 'bg-emerald-100', icon: 'text-emerald-700', line: 'bg-emerald-300' },
  emergency_completed: { bg: 'bg-emerald-100', icon: 'text-emerald-700', line: 'bg-emerald-300' },
};

// The full ordered sequence of possible steps
const FULL_SEQUENCE: EmergencyTimelineStep[] = [
  'sos_triggered',
  'location_acquired',
  'ambulance_assigned',
  'hospital_selected',
  'hospital_accepted',
  'ambulance_en_route',
  'ambulance_arrived',
  'patient_handed_over',
  'emergency_completed',
];

interface EmergencyTimelineProps {
  events: EmergencyTimelineEvent[];
  compact?: boolean;
}

export const EmergencyTimeline: React.FC<EmergencyTimelineProps> = ({ events, compact = false }) => {
  const completedSteps = new Set(events.map((e) => e.step));
  const eventMap = new Map(events.map((e) => [e.step, e]));

  // Find current step index
  let currentStepIndex = -1;
  for (let i = FULL_SEQUENCE.length - 1; i >= 0; i--) {
    if (completedSteps.has(FULL_SEQUENCE[i])) {
      currentStepIndex = i;
      break;
    }
  }

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {FULL_SEQUENCE.map((step, idx) => {
          const isCompleted = completedSteps.has(step);
          const isCurrent = idx === currentStepIndex;
          const colors = STEP_COLORS[step];
          const Icon = STEP_ICONS[step];

          return (
            <React.Fragment key={step}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCompleted
                    ? `${colors.bg}`
                    : 'bg-slate-100'
                } ${isCurrent ? 'ring-2 ring-offset-1 ring-neutral-900' : ''}`}
                title={TIMELINE_STEP_LABELS[step]}
              >
                <Icon className={`w-3.5 h-3.5 ${isCompleted ? colors.icon : 'text-slate-300'}`} />
              </div>
              {idx < FULL_SEQUENCE.length - 1 && (
                <div className={`w-3 h-0.5 ${isCompleted && idx < currentStepIndex ? colors.line : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative">
      {FULL_SEQUENCE.map((step, idx) => {
        const isCompleted = completedSteps.has(step);
        const isCurrent = idx === currentStepIndex;
        const isPending = idx > currentStepIndex;
        const event = eventMap.get(step);
        const colors = STEP_COLORS[step];
        const Icon = STEP_ICONS[step];
        const isLast = idx === FULL_SEQUENCE.length - 1;

        // Check if hospital_rejected should be shown
        if (step === 'hospital_accepted' && completedSteps.has('hospital_rejected') && !completedSteps.has('hospital_accepted')) {
          return null;
        }

        return (
          <div key={step} className="flex gap-3">
            {/* Icon column */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  isCompleted
                    ? `${colors.bg} border-transparent`
                    : isCurrent
                    ? 'bg-white border-neutral-900 animate-subtle-pulse'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCompleted ? colors.icon : isPending ? 'text-slate-300' : 'text-slate-400'}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 h-6 my-0.5 ${isCompleted && !isPending ? colors.line : 'bg-slate-200'}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 ${isPending ? 'opacity-40' : ''}`}>
              <p className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                {TIMELINE_STEP_LABELS[step]}
              </p>
              {event && (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-500 font-mono">{formatTime(event.timestamp)}</span>
                  {event.detail && (
                    <span className="text-[11px] text-slate-600">&middot; {event.detail}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
