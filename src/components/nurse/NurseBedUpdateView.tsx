import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { useAuth } from '../../context/AuthContext';
import { BED_TYPES, BedTypeId } from '../../types/bedlink';
import {
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Building,
  RotateCcw,
  Ban,
  Check,
  WifiOff,
  Database,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Stethoscope,
  ArrowLeft,
  ListFilter,
} from 'lucide-react';

export const NurseBedUpdateView: React.FC = () => {
  const { logout } = useAuth();
  const {
    currentHospital,
    hospitals,
    setCurrentHospitalId,
    incrementBed,
    decrementBed,
    setBedPreset,
    syncAllBeds,
    lastSyncTimestamp,
    bedLastUpdatedMap,
    isOnline,
    pendingOfflineSyncCount,
    ehrSyncStatus,
    simulateEhrEvent,
  } = useBedLink();

  const [secondsSinceSync, setSecondsSinceSync] = useState(0);
  const [justUpdatedBed, setJustUpdatedBed] = useState<string | null>(null);
  const [syncedNotification, setSyncedNotification] = useState(false);
  const [isSimulatingEhr, setIsSimulatingEhr] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastSyncTimestamp) / 1000);
      setSecondsSinceSync(diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastSyncTimestamp]);

  const handleBedUpdate = (bedType: BedTypeId, action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      incrementBed(currentHospital.id, bedType);
    } else {
      decrementBed(currentHospital.id, bedType);
    }

    setJustUpdatedBed(bedType);
    setTimeout(() => {
      setJustUpdatedBed(null);
    }, 3000);
  };

  const handleSyncAll = () => {
    syncAllBeds(currentHospital.id);
    setSyncedNotification(true);
    setTimeout(() => setSyncedNotification(false), 3000);
  };

  const handleTriggerEhr = (type: 'ADT_A01_ADMIT' | 'ADT_A03_DISCHARGE') => {
    setIsSimulatingEhr(true);
    simulateEhrEvent(type);
    setTimeout(() => setIsSimulatingEhr(false), 1200);
  };

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];

  const formatBedFreshness = (bedType: BedTypeId) => {
    if (justUpdatedBed === bedType) {
      return 'Updated just now';
    }
    const specificTimestamp = bedLastUpdatedMap[`${currentHospital.id}-${bedType}`];
    if (specificTimestamp) {
      const elapsedSec = Math.floor((Date.now() - specificTimestamp) / 1000);
      if (elapsedSec < 30) return 'Updated just now';
      const elapsedMin = Math.floor(elapsedSec / 60);
      if (elapsedMin < 1) return 'Updated <1 min ago';
      return `Updated ${elapsedMin} min ago`;
    }
    if (currentHospital.lastUpdatedMinutesAgo === 0) {
      return 'Updated just now';
    }
    return `Updated ${currentHospital.lastUpdatedMinutesAgo} min ago`;
  };

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
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ward Bed Management System</span>
            <span className="text-xs font-mono text-slate-500">Ward: {currentHospital.ward}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Duty Charge Nurse: {currentHospital.nurseInCharge}
          </span>
          <button
            onClick={handleSyncAll}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
              syncedNotification
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncedNotification ? 'Synced to Dispatch!' : 'Sync All Bed Data'}</span>
          </button>
        </div>
      </div>

      {/* Offline Alert */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Ward Offline Queue Active:</strong> Operating without network signal. {pendingOfflineSyncCount} bed update(s) cached locally.
            </span>
          </div>
          <span className="font-mono text-amber-800 font-bold px-2.5 py-0.5 bg-amber-100 rounded">
            PWA Caching
          </span>
        </div>
      )}

      {/* Station Header & EHR Auto-Sync Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={currentHospital.id}
                  aria-label="Select Hospital Facility"
                  onChange={(e) => setCurrentHospitalId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-base px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                  {currentHospital.designation}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Ward Station: <strong className="text-slate-900">{currentHospital.ward}</strong> &middot; Direct Radio Channel: {currentHospital.directRadioChannel}
              </p>
            </div>
          </div>
        </div>

        {/* EHR Feed Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Hospital EHR Feed (HL7 v2 / FHIR ADT): </span>
              <span className="text-emerald-700 font-bold">Active & Connected</span>
              <span className="text-slate-500 block sm:inline sm:ml-2">
                Bed inventory adjusts automatically upon ADT admission or discharge events.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 font-medium">Test EHR Feed:</span>
            <button
              onClick={() => handleTriggerEhr('ADT_A01_ADMIT')}
              disabled={isSimulatingEhr}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              + Admit Patient
            </button>
            <button
              onClick={() => handleTriggerEhr('ADT_A03_DISCHARGE')}
              disabled={isSimulatingEhr}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              - Discharge Patient
            </button>
          </div>
        </div>

        {/* Presets and Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Ward Overrides:</span>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'all_full')}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              All Full (0)
            </button>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'reset_default')}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              Reset Benchmark
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Available (&gt;2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Low (1-2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Full (0)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Bed Categories (3 columns on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bedKeys.map((key) => {
          const meta = BED_TYPES[key];
          const bedData = currentHospital.beds[key] || { total: 10, available: 0, held: 0 };
          const available = bedData.available;
          const held = bedData.held;
          const total = bedData.total;
          const occupied = Math.max(0, total - available - held);

          const isJustUpdated = justUpdatedBed === key;

          let statusTheme = {
            cardBorder: 'border-slate-200',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            badgeLabel: 'Available',
            numberColor: 'text-emerald-700',
          };

          if (available === 0) {
            statusTheme = {
              cardBorder: 'border-rose-300',
              badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
              badgeLabel: 'Full (0 Beds)',
              numberColor: 'text-rose-700',
            };
          } else if (available <= 2) {
            statusTheme = {
              cardBorder: 'border-amber-300',
              badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
              badgeLabel: `${available} Left`,
              numberColor: 'text-amber-700',
            };
          }

          return (
            <div
              key={key}
              className={`bg-white border ${statusTheme.cardBorder} rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {meta.label}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-semibold text-slate-500">
                        {meta.shortLabel}
                      </span>
                      {held > 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          {held} Held
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border shrink-0 ${statusTheme.badgeBg}`}>
                    {statusTheme.badgeLabel}
                  </span>
                </div>

                {/* Metrics */}
                <div className="my-4 py-3 border-y border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Available Beds
                    </span>
                    <span className={`text-4xl font-black font-mono tracking-tight tabular-nums block mt-0.5 ${statusTheme.numberColor}`}>
                      {available}
                    </span>
                  </div>

                  <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
                    <div>
                      Total Beds: <span className="font-bold text-slate-900">{total}</span>
                    </div>
                    <div>
                      Occupied: <span className="font-semibold text-slate-800">{occupied}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatBedFreshness(key)}</span>
                  </div>

                  {isJustUpdated && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </div>
              </div>

              {/* 48px Touch Adjuster Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'decrement')}
                  disabled={available <= 0}
                  className={`min-h-[48px] py-3 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    available > 0
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 active:bg-slate-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                  aria-label={`Mark bed filled for ${meta.label}`}
                >
                  <Minus className="w-4 h-4 text-slate-800 stroke-[2.5]" />
                  <span>Bed Filled</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'increment')}
                  disabled={available >= total}
                  className={`min-h-[48px] py-3 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer ${
                    available < total
                      ? 'bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 shadow-2xs active:bg-emerald-800'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
                  }`}
                  aria-label={`Mark bed free for ${meta.label}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Bed Free</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
