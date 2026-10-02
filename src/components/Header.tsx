import React from 'react';
import { useBedLink } from '../context/BedLinkContext';
import { AppRole } from '../types/bedlink';
import {
  Activity,
  Ambulance,
  Building2,
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    pendingHoldsCount,
    isMuted,
    toggleMute,
    simulateIncomingAmbulance,
    resetAllData,
  } = useBedLink();

  const navSections: { id: AppRole; number: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    {
      id: 'nurse',
      number: '1',
      label: 'Nurse Bed Update',
      icon: Activity,
    },
    {
      id: 'dispatch',
      number: '2',
      label: 'Ambulance Dispatch',
      icon: Ambulance,
    },
    {
      id: 'er',
      number: '3',
      label: 'Bed Hold / Confirmation',
      icon: Building2,
      badge: pendingHoldsCount,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
            VR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">
                VitaRoute
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                Hospital EMS Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Emergency Bed Availability &amp; Dispatch Coordination
            </p>
          </div>
        </div>

        {/* Navigation: 3 Clear Sections */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          {navSections.map((tab) => {
            const Icon = tab.icon;
            const isActive = role === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setRole(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-white text-sky-800 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title={`Go to ${tab.label}`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isActive ? 'bg-sky-600 text-white' : 'bg-slate-300 text-slate-700'
                }`}>
                  {tab.number}
                </span>
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.label.split(' ')[0]}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Simulation Trigger */}
          <button
            onClick={simulateIncomingAmbulance}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-md transition-colors"
            title="Simulate inbound ambulance bed hold"
          >
            <Zap className="w-3.5 h-3.5 text-sky-600" />
            <span>Simulate Request</span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-md border text-xs transition-colors ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Telemetry Alert Sound Muted' : 'Telemetry Alert Sound Active'}
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetAllData}
            className="p-2 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
            title="Reset to benchmark data"
            aria-label="Reset Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
