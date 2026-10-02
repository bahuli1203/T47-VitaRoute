import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
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
} from 'lucide-react';

export const NurseBedUpdateView: React.FC = () => {
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
  } = useBedLink();

  const [secondsSinceSync, setSecondsSinceSync] = useState(0);
  const [justUpdatedBed, setJustUpdatedBed] = useState<string | null>(null);
  const [syncedNotification, setSyncedNotification] = useState(false);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
      {/* Offline Mode Alert for Hospital Basement Dead Zones */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Ward Offline Queue Mode Active:</strong> Operating without Wi-Fi connection. {pendingOfflineSyncCount} bed update(s) saved locally and will auto-sync upon signal restoration.
            </span>
          </div>
          <span className="font-mono text-amber-800 font-bold px-2 py-0.5 bg-amber-100 rounded">
            PWA Offline
          </span>
        </div>
      )}

      {/* Top Station Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-sky-700 shrink-0" />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={currentHospital.id}
                  aria-label="Select Hospital Facility"
                  onChange={(e) => setCurrentHospitalId(e.target.value)}
                  className="bg-white border border-slate-300 rounded-md font-bold text-slate-900 text-sm sm:text-base px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {currentHospital.designation}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-600 mt-1 pl-7">
              Current Ward: <strong className="text-slate-800">{currentHospital.ward}</strong> &middot; Charge Nurse on duty: {currentHospital.nurseInCharge}
            </p>
          </div>

          {/* Sync Button and Status */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Ward Sync Status:</span>
              <span className="text-xs font-semibold text-slate-800 flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {secondsSinceSync < 60 ? `${secondsSinceSync}s ago` : `${Math.floor(secondsSinceSync / 60)}m ago`}
              </span>
            </div>

            <button
              onClick={handleSyncAll}
              className={`px-4 py-2 text-xs font-bold rounded-md border transition-colors flex items-center gap-1.5 shadow-xs ${
                syncedNotification
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-sky-600 hover:bg-sky-700 text-white border-sky-600'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{syncedNotification ? 'Synced to Dispatch!' : 'Sync All Bed Data'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets and Status Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Quick Ward Presets:</span>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'all_full')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium transition-colors flex items-center gap-1"
            >
              <Ban className="w-3 h-3 text-rose-600" />
              All Full (0)
            </button>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'reset_default')}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3 text-slate-600" />
              Reset to Benchmark
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Available (&gt;2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Low (1-2 left)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> Full (0)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Bed Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bedKeys.map((key) => {
          const meta = BED_TYPES[key];
          const bedData = currentHospital.beds[key] || { total: 10, available: 0, held: 0 };
          const available = bedData.available;
          const held = bedData.held;
          const total = bedData.total;
          const occupied = Math.max(0, total - available - held);

          const isJustUpdated = justUpdatedBed === key;

          // Strictly functional status colors
          let statusTheme = {
            cardBorder: 'border-slate-200',
            badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
            badgeLabel: 'Available',
            numberColor: 'text-emerald-700',
          };

          if (available === 0) {
            statusTheme = {
              cardBorder: 'border-rose-200',
              badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
              badgeLabel: 'Full (0 Beds)',
              numberColor: 'text-rose-700',
            };
          } else if (available <= 2) {
            statusTheme = {
              cardBorder: 'border-amber-200',
              badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
              badgeLabel: `${available} Left`,
              numberColor: 'text-amber-700',
            };
          }

          return (
            <div
              key={key}
              className={`bg-white border ${statusTheme.cardBorder} rounded-lg p-4 sm:p-5 shadow-xs flex flex-col justify-between transition-colors`}
            >
              {/* Card Header: Title and Status Badge */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {meta.label}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-medium text-slate-500">
                        {meta.shortLabel}
                      </span>
                      {held > 0 && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                          {held} Held by EMS
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded border shrink-0 ${statusTheme.badgeBg}`}
                  >
                    {statusTheme.badgeLabel}
                  </span>
                </div>

                {/* Main Metrics: Available Beds + Total + Occupied */}
                <div className="my-4 py-3 border-y border-slate-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                      Available Beds
                    </span>
                    <span
                      className={`text-4xl font-bold font-mono tracking-tight tabular-nums block mt-0.5 ${statusTheme.numberColor}`}
                    >
                      {available}
                    </span>
                  </div>

                  <div className="text-right text-xs font-mono text-slate-600 space-y-0.5">
                    <div>
                      Total Beds: <span className="font-bold text-slate-900">{total}</span>
                    </div>
                    <div>
                      Occupied Beds: <span className="font-semibold text-slate-800">{occupied}</span>
                    </div>
                  </div>
                </div>

                {/* Freshness Timestamp / Confirmation */}
                <div className="flex items-center justify-between text-xs text-slate-500 pb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatBedFreshness(key)}</span>
                  </div>

                  {isJustUpdated && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Updated just now
                    </span>
                  )}
                </div>
              </div>

              {/* One-Tap Tactile Touch Controls: 48px Min Height for Cheap Mobile Touchscreens */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'decrement')}
                  disabled={available <= 0}
                  className={`min-h-[48px] py-2.5 px-3 rounded-md border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    available > 0
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 active:bg-slate-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                  aria-label={`Mark bed filled for ${meta.label}`}
                >
                  <Minus className="w-4 h-4 text-slate-700 stroke-[2.5]" />
                  <span>Bed Filled</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'increment')}
                  disabled={available >= total}
                  className={`min-h-[48px] py-2.5 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer ${
                    available < total
                      ? 'bg-sky-600 hover:bg-sky-700 border border-sky-600 shadow-xs active:bg-sky-800'
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
