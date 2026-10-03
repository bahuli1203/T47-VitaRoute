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
    setRole,
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
    language,
    t,
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
      return t.updatedJustNow;
    }
    const specificTimestamp = bedLastUpdatedMap[`${currentHospital.id}-${bedType}`];
    if (specificTimestamp) {
      const elapsedSec = Math.floor((Date.now() - specificTimestamp) / 1000);
      if (elapsedSec < 30) return t.updatedJustNow;
      const elapsedMin = Math.floor(elapsedSec / 60);
      if (elapsedMin < 1) return t.updatedJustNow;
      return t.updatedMinsAgo.replace('{mins}', String(elapsedMin));
    }
    if (currentHospital.lastUpdatedMinutesAgo === 0) {
      return t.updatedJustNow;
    }
    return t.updatedMinsAgo.replace('{mins}', String(currentHospital.lastUpdatedMinutesAgo));
  };

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
      
      {/* Top Entity Management Breadcrumb Toolbar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRole('dispatch')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs border border-neutral-200 transition-colors cursor-pointer"
            title="Switch to Ambulance Dispatch"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← {t.ambulanceDispatch}</span>
          </button>
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider">{t.wardBedCounter}</span>
            <span className="text-xs font-mono text-neutral-500">Ward: {currentHospital.ward}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
            {t.dutyChargeNurse}: {currentHospital.nurseInCharge}
          </span>
          <button
            onClick={handleSyncAll}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
              syncedNotification
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-neutral-900 hover:bg-black text-white border-neutral-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncedNotification ? t.syncedToDispatch : t.syncAllBedData}</span>
          </button>
        </div>
      </div>

      {/* Offline Alert */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>{t.offlineQueueActive}</strong> {pendingOfflineSyncCount} bed update(s) cached locally.
            </span>
          </div>
          <span className="font-mono text-amber-800 font-bold px-2.5 py-0.5 bg-amber-100 rounded">
            {t.pwaCaching}
          </span>
        </div>
      )}

      {/* Station Header & EHR Auto-Sync Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
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
                  className="bg-white border border-neutral-300 rounded-lg font-bold text-neutral-900 text-base px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.code})
                    </option>
                  ))}
                </select>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {currentHospital.designation}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Ward Station: <strong className="text-neutral-900">{currentHospital.ward}</strong> &middot; Direct Radio: {currentHospital.directRadioChannel}
              </p>
            </div>
          </div>
        </div>

        {/* EHR Feed Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">{t.hospitalEhrFeed} </span>
              <span className="text-emerald-700 font-bold">{t.activeConnected}</span>
              <span className="text-slate-500 block sm:inline sm:ml-2">
                {t.ehrDesc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-slate-500 font-medium">{t.testEhrFeed}</span>
            <button
              onClick={() => handleTriggerEhr('ADT_A01_ADMIT')}
              disabled={isSimulatingEhr}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {t.admitPatientBtn}
            </button>
            <button
              onClick={() => handleTriggerEhr('ADT_A03_DISCHARGE')}
              disabled={isSimulatingEhr}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {t.dischargePatientBtn}
            </button>
          </div>
        </div>

        {/* Presets and Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">{t.wardOverrides}</span>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'all_full')}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              {t.allFullBtn}
            </button>
            <button
              onClick={() => setBedPreset(currentHospital.id, 'reset_default')}
              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              {t.resetBenchmarkBtn}
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t.availableBeds} (&gt;2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 1-2 {t.bedsLeft}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span> {t.full0Beds}
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
            badgeLabel: t.availableBeds,
            numberColor: 'text-emerald-700',
          };

          if (available === 0) {
            statusTheme = {
              cardBorder: 'border-rose-300',
              badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
              badgeLabel: t.full0Beds,
              numberColor: 'text-rose-700',
            };
          } else if (available <= 2) {
            statusTheme = {
              cardBorder: 'border-amber-300',
              badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
              badgeLabel: `${available} ${t.bedsLeft}`,
              numberColor: 'text-amber-700',
            };
          }

          return (
            <div
              key={key}
              className={`bg-white border ${statusTheme.cardBorder} rounded-xl p-5 shadow-xs hover:border-neutral-300 flex flex-col justify-between transition-all`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                      {getBedLabel(key)}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-semibold text-neutral-500">
                        {meta.shortLabel}
                      </span>
                      {held > 0 && (
                        <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          {held} {t.heldBeds}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border shrink-0 ${statusTheme.badgeBg}`}>
                    {statusTheme.badgeLabel}
                  </span>
                </div>

                {/* Metrics */}
                <div className="my-4 py-3 border-y border-neutral-100 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                      {t.availableBeds}
                    </span>
                    <span className={`text-4xl font-black font-mono tracking-tight tabular-nums block mt-0.5 ${statusTheme.numberColor}`}>
                      {available}
                    </span>
                  </div>

                  <div className="text-right text-xs font-mono text-neutral-600 space-y-0.5">
                    <div>
                      {t.totalBeds}: <span className="font-bold text-neutral-900">{total}</span>
                    </div>
                    <div>
                      {t.occupied}: <span className="font-semibold text-neutral-800">{occupied}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-500 pb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatBedFreshness(key)}</span>
                  </div>

                  {isJustUpdated && (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {t.saved}
                    </span>
                  )}
                </div>
              </div>

              {/* 48px Touch Adjuster Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'decrement')}
                  disabled={available <= 0}
                  className={`min-h-[48px] py-3 px-3 rounded-lg border font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    available > 0
                      ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-300 active:bg-neutral-300'
                      : 'bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed opacity-60'
                  }`}
                  aria-label={`Mark bed filled for ${meta.label}`}
                >
                  <Minus className="w-4 h-4 text-neutral-800 stroke-[2.5]" />
                  <span>{t.bedFilled}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleBedUpdate(key, 'increment')}
                  disabled={available >= total}
                  className={`min-h-[48px] py-3 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 text-white transition-colors cursor-pointer ${
                    available < total
                      ? 'bg-emerald-600 hover:bg-emerald-700 border border-emerald-600 shadow-2xs active:bg-emerald-800'
                      : 'bg-neutral-300 text-neutral-500 cursor-not-allowed border border-neutral-300'
                  }`}
                  aria-label={`Mark bed free for ${meta.label}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{t.bedFree}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
