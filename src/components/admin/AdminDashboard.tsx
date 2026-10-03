import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { useAuth } from '../../context/AuthContext';
import { EmergencyTimeline } from '../common/EmergencyTimeline';
import { BED_TYPES, Emergency } from '../../types/bedlink';
import {
  Activity,
  Ambulance,
  Building2,
  Bed,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Zap,
  BarChart3,
  MapPin,
  Shield,
  Radio,
  ArrowLeft,
  Server,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const {
    emergencies,
    hospitals,
    activeHolds,
    simulateIncomingAmbulance,
    simulateMassSurge,
    resetAllData,
  } = useBedLink();

  const [expandedEmergencyId, setExpandedEmergencyId] = useState<string | null>(null);

  const activeEmergencies = emergencies.filter((e) => e.status !== 'completed');
  const completedEmergencies = emergencies.filter((e) => e.status === 'completed');
  const pendingHolds = activeHolds.filter((h) => h.status === 'pending');
  const confirmedHolds = activeHolds.filter((h) => h.status === 'accepted');

  const totalAvailableBeds = hospitals.reduce((sum, h) => {
    return sum + Object.values(h.beds).reduce((bSum, b) => bSum + b.available, 0);
  }, 0);

  const totalBeds = hospitals.reduce((sum, h) => {
    return sum + Object.values(h.beds).reduce((bSum, b) => bSum + b.total, 0);
  }, 0);

  const activeAmbulances = new Set(activeEmergencies.map((e) => e.assignedAmbulance)).size;

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      
      {/* Top Entity Management Breadcrumb Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
            title="Return to Main Portal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Back to Home</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Regional Control Center Management</span>
            <span className="text-xs font-mono text-slate-500">Master Console v2.4</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateIncomingAmbulance}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-neutral-800" />
            Simulate Request
          </button>
          <button
            onClick={simulateMassSurge}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            Surge Drill
          </button>
          <button
            onClick={resetAllData}
            className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            Reset Data
          </button>
        </div>
      </div>

      {/* KPI Metrics Bar (5 Cards on Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center">
          <AlertCircle className="w-5 h-5 text-rose-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-slate-900 font-mono block">{activeEmergencies.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Emergencies</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center">
          <Ambulance className="w-5 h-5 text-neutral-800 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-slate-900 font-mono block">{activeAmbulances}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dispatched Fleet Units</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center">
          <Building2 className="w-5 h-5 text-neutral-800 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-slate-900 font-mono block">{hospitals.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Connected Hospitals</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center">
          <Bed className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-emerald-700 font-mono block">{totalAvailableBeds}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Available Network Beds</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-center col-span-2 sm:col-span-1">
          <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1.5" />
          <span className="text-2xl font-black text-slate-900 font-mono block">{pendingHolds.length}</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending ER Holds</span>
        </div>
      </div>

      {/* Main 2-Column Management Split: Hospital Capacity Matrix & Active Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT / MAIN COLUMN: Regional Hospital Capacity Matrix Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-neutral-800" />
              Regional Hospital Capacity Matrix
            </h3>
            <span className="text-xs text-slate-500 font-mono">Live Census Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="text-left py-2.5 px-3 font-bold text-slate-700 uppercase tracking-wider">Facility</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">ER Surge</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">ICU</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">Trauma</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">Cardiac</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">Oxygen</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">Holds</th>
                  <th className="text-center py-2.5 px-2 font-bold text-slate-700 uppercase tracking-wider">Sync</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hospitals.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{h.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">#{h.code} &middot; Radio {h.directRadioChannel}</span>
                      {h.diversionStatus !== 'Open' && (
                        <span className="mt-0.5 inline-block text-[10px] font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          {h.diversionStatus}
                        </span>
                      )}
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        h.erLoad === 'Low' ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : h.erLoad === 'Medium' ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {h.erLoad}
                      </span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <BedCount available={h.beds.icu_ventilator.available + h.beds.icu_non_ventilator.available} />
                    </td>
                    <td className="text-center py-3 px-2">
                      <BedCount available={h.beds.trauma_resuscitation.available} />
                    </td>
                    <td className="text-center py-3 px-2">
                      <BedCount available={h.beds.cardiac_monitored.available} />
                    </td>
                    <td className="text-center py-3 px-2">
                      <BedCount available={h.beds.oxygen_bed.available} />
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className="font-mono font-bold text-slate-800">{h.activeHoldCount}</span>
                    </td>
                    <td className="text-center py-3 px-2">
                      <span className={`text-[11px] font-mono font-semibold ${
                        h.lastUpdatedMinutesAgo <= 15 ? 'text-emerald-700'
                        : h.lastUpdatedMinutesAgo <= 45 ? 'text-amber-700'
                        : 'text-rose-700'
                      }`}>
                        {h.lastUpdatedMinutesAgo === 0 ? 'Just now' : `${h.lastUpdatedMinutesAgo}m`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Emergency Incidents List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-600" />
              Active Telemetry Incident Log ({emergencies.length})
            </h3>
            <span className="text-xs text-slate-500">Live Dispatches</span>
          </div>

          {emergencies.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">No emergency dispatches recorded.</p>
          ) : (
            <div className="space-y-2.5">
              {emergencies.map((emg) => {
                const isExpanded = expandedEmergencyId === emg.id;
                const isActive = emg.status !== 'completed';
                return (
                  <div key={emg.id} className={`border rounded-xl transition-all ${isActive ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200 bg-white'}`}>
                    <button
                      onClick={() => setExpandedEmergencyId(isExpanded ? null : emg.id)}
                      className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isActive ? 'bg-rose-600 animate-pulse' : 'bg-emerald-600'}`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {emg.patientName} — {emg.category.toUpperCase()}
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate font-mono">
                            {emg.assignedAmbulance} → {emg.assignedHospitalName || 'Matching Hospital...'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          isActive
                            ? 'bg-rose-100 text-rose-800 border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {emg.status.replace(/_/g, ' ')}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
                        <EmergencyTimeline events={emg.timeline} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const BedCount: React.FC<{ available: number }> = ({ available }) => (
  <span className={`font-mono font-bold ${
    available > 2 ? 'text-emerald-700'
    : available > 0 ? 'text-amber-700'
    : 'text-rose-700'
  }`}>
    {available}
  </span>
);
