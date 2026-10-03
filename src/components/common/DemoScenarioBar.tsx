import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import {
  ChevronDown,
  ChevronUp,
  Activity,
  Ambulance,
  Clock,
  AlertTriangle,
  AlertCircle,
} from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const {
    setRole,
    simulateIncomingAmbulance,
    simulateMassSurge,
    decrementBed,
    currentHospital,
  } = useBedLink();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-100 border-b border-slate-200 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <span className="font-semibold text-slate-900">Emergency Operations Demo Testing Controls</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 hidden sm:inline">
            Quick-test workflows across the 4 stages:
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
        >
          <span>{isOpen ? 'Hide Scenarios' : 'Show Demo Scenarios'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-3 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {/* Scenario 0: Citizen SOS */}
          <button
            onClick={() => {
              setRole('patient');
            }}
            className="flex items-center gap-2 p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">1. Citizen SOS</span>
              <span className="text-[11px] text-slate-500 block">1-tap GPS emergency call</span>
            </div>
          </button>

          {/* Scenario 1: Nurse Bed Update */}
          <button
            onClick={() => {
              setRole('nurse');
              decrementBed(currentHospital.id, 'icu_ventilator');
            }}
            className="flex items-center gap-2 p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
          >
            <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">2. Nurse Occupies Bed</span>
              <span className="text-[11px] text-slate-500 block">Updates ward count in 10s</span>
            </div>
          </button>

          {/* Scenario 2: Dispatch Hospital Match */}
          <button
            onClick={() => setRole('ambulance')}
            className="flex items-center gap-2 p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
          >
            <Ambulance className="w-4 h-4 text-neutral-900 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">3. CAD Multi-Match</span>
              <span className="text-[11px] text-slate-500 block">GPS + multi-specialty rank</span>
            </div>
          </button>

          {/* Scenario 3: 2-Min Confirmation Hold */}
          <button
            onClick={() => {
              simulateIncomingAmbulance();
              setRole('hospital');
            }}
            className="flex items-center gap-2 p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
          >
            <Clock className="w-4 h-4 text-amber-700 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">4. 120s Hold Window</span>
              <span className="text-[11px] text-slate-500 block">Accept, reject, or auto-timeout</span>
            </div>
          </button>

          {/* Scenario 4: Surge Drill */}
          <button
            onClick={simulateMassSurge}
            className="flex items-center gap-2 p-2.5 rounded-md bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
          >
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <span className="font-semibold text-slate-900 block">5. Regional Surge Drill</span>
              <span className="text-[11px] text-slate-500 block">Simulate mass casualty surge</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
