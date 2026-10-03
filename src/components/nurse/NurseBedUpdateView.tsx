import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { BED_TYPES, BedTypeId } from '../../types/bedlink';
import {
  CheckCircle2,
  Clock,
  Plus,
  Minus,
  Building2,
  WifiOff,
  Stethoscope,
  ShieldCheck,
} from 'lucide-react';

export const NurseBedUpdateView: React.FC = () => {
  const {
    currentHospital,
    incrementBed,
    decrementBed,
    syncAllBeds,
    lastSyncTimestamp,
    bedLastUpdatedMap,
    isOnline,
    pendingOfflineSyncCount,
    language,
    t,
  } = useBedLink();

  const [justUpdatedBed, setJustUpdatedBed] = useState<string | null>(null);
  const [syncedNotification, setSyncedNotification] = useState(false);

  const handleBedUpdate = (bedType: BedTypeId, action: 'increment' | 'decrement') => {
    if (action === 'increment') {
      incrementBed(currentHospital.id, bedType);
    } else {
      decrementBed(currentHospital.id, bedType);
    }

    setJustUpdatedBed(bedType);
    setTimeout(() => {
      setJustUpdatedBed(null);
    }, 2000);
  };

  const handleSyncAll = () => {
    syncAllBeds(currentHospital.id);
    setSyncedNotification(true);
    setTimeout(() => setSyncedNotification(false), 2500);
  };

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];

  const getBedLabel = (key: BedTypeId) => {
    if (key === 'icu_ventilator') return t.bedIcuVent;
    if (key === 'icu_non_ventilator') return `${t.bedIcuVent} (Stepdown)`;
    if (key === 'oxygen_bed') return t.bedOxygen;
    if (key === 'cardiac_monitored') return t.bedCardiac;
    if (key === 'burns_isolation') return t.bedBurns;
    if (key === 'trauma_resuscitation') return t.bedTrauma;
    return (BED_TYPES as Record<string, { label: string }>)[key]?.label || String(key);
  };

  const formatBedFreshness = (bedType: BedTypeId) => {
    if (justUpdatedBed === bedType) {
      return language === 'hi' ? 'अभी अपडेट हुआ' : language === 'mr' ? 'आत्ताच अपडेट केले' : 'Updated just now';
    }
    const specificTimestamp = bedLastUpdatedMap[`${currentHospital.id}-${bedType}`];
    if (specificTimestamp) {
      const minutes = Math.max(1, Math.floor((Date.now() - specificTimestamp) / 60000));
      return language === 'hi' ? `${minutes} मिनट पहले अपडेट हुआ` : language === 'mr' ? `${minutes} मिनीटांपूर्वी अपडेट` : `Updated ${minutes}m ago`;
    }
    return language === 'hi'
      ? `${currentHospital.lastUpdatedMinutesAgo} मिनट पहले`
      : language === 'mr'
      ? `${currentHospital.lastUpdatedMinutesAgo} मिनीटांपूर्वी`
      : `Updated ${currentHospital.lastUpdatedMinutesAgo}m ago`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Offline Alert Bar */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Offline Mode:</strong> {pendingOfflineSyncCount} bed update(s) cached locally.
            </span>
          </div>
          <span className="font-mono text-amber-800 font-bold px-2 py-0.5 bg-amber-100 rounded text-[11px]">
            PWA Local Cache
          </span>
        </div>
      )}

      {/* Hospital Ward Header (Shows ONLY Nurse's Own Hospital) */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-extrabold text-neutral-950">
                {currentHospital.name}
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                {currentHospital.code}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Ward: <strong className="text-neutral-800">{currentHospital.ward}</strong> &middot; Nurse: <span className="text-neutral-700">{currentHospital.nurseInCharge}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncAll}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 ${
            syncedNotification
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-red-600 hover:bg-red-700 text-white border-red-600'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncedNotification ? (language === 'hi' ? 'एम्बुलेंस को सिंक हुआ!' : language === 'mr' ? 'सिंक झाले!' : 'Synced to Ambulances!') : (language === 'hi' ? 'सभी बेड डेटा सिंक करें' : language === 'mr' ? 'सर्व बेड डेटा सिंक करा' : 'Sync All Bed Data')}</span>
        </button>
      </div>

      {/* 10-Second Bed Update Cards (1 Tap per Bed Type) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {bedKeys.map((bedType) => {
          const bedData = currentHospital.beds[bedType] || { total: 0, available: 0, held: 0 };
          const isRecentlyUpdated = justUpdatedBed === bedType;

          return (
            <div
              key={bedType}
              className={`bg-white border rounded-2xl p-4 shadow-xs transition-all flex flex-col justify-between ${
                isRecentlyUpdated
                  ? 'border-red-500 ring-2 ring-red-200'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                    {getBedLabel(bedType)}
                  </h3>
                  {bedData.held > 0 && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                      +{bedData.held} Held
                    </span>
                  )}
                </div>

                {/* Available Bed Big Counter */}
                <div className="my-2 flex items-baseline gap-2">
                  <span
                    className={`text-3xl font-black font-mono ${
                      bedData.available > 0 ? 'text-neutral-950' : 'text-red-600'
                    }`}
                  >
                    {bedData.available}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    / {bedData.total} Total Beds
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-3">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span>{formatBedFreshness(bedType)}</span>
                </div>
              </div>

              {/* Large 48px Tactile Plus / Minus Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleBedUpdate(bedType, 'decrement')}
                  disabled={bedData.available <= 0}
                  className="min-h-[48px] py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-900 font-black text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                  <span>-1 Bed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBedUpdate(bedType, 'increment')}
                  className="min-h-[48px] py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+1 Bed</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
