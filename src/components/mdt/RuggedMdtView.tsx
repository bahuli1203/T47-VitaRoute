import React, { useMemo, useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import {
  BED_TYPES,
  BedTypeId,
  TRIAGE_LEVELS,
  TriageAcuity,
  Hospital,
  SpecialtyId,
  AVAILABLE_SPECIALTIES,
} from '../../types/bedlink';
import { AMBULANCE_FLEET } from '../../data/mockHospitals';
import {
  calculateHaversineDistance,
  estimateEmergencyTravelTime,
} from '../../utils/geo';
import { CountdownRing } from '../common/CountdownRing';
import {
  Activity,
  ShieldAlert,
  Radio,
  Clock,
  Compass,
  MapPin,
  Lock,
  Sun,
  Moon,
  Bluetooth,
  HeartPulse,
  Flame,
  Check,
  X,
  Layers,
  CheckSquare,
  Square,
  Navigation2,
} from 'lucide-react';

export const RuggedMdtView: React.FC = () => {
  const {
    hospitals,
    dispatchFilter,
    setDispatchFilter,
    toggleSpecialtyFilter,
    requestHold,
    acceptHold,
    rejectHold,
    activeHolds,
    setRole,
    liveCoordinates,
    gpsAccuracy,
    isLocating,
    requestLiveLocation,
    mdtTheme,
    setMdtTheme,
    isWakeLockActive,
    toggleWakeLock,
    cardiacTelemetry,
    updateCardiacTelemetry,
    toggleMonitorConnection,
  } = useBedLink();

  const [activeModalHoldId, setActiveModalHoldId] = useState<string | null>(null);

  const isNight = mdtTheme === 'tactical_night';

  // Origin coordinates: live GPS
  const originCoords = useMemo(() => {
    return liveCoordinates || { lat: 40.7128, lng: -74.006 };
  }, [liveCoordinates]);

  // Ranked hospitals with multi-constraint evaluation
  const rankedHospitals = useMemo(() => {
    const list = hospitals.map((h) => {
      const requestedBed = h.beds[dispatchFilter.requiredBedType] || {
        total: 0,
        available: 0,
        held: 0,
      };
      const availableBeds = requestedBed.available;

      const calculatedDistance = calculateHaversineDistance(
        originCoords.lat,
        originCoords.lng,
        h.lat,
        h.lng
      );

      const calculatedETA = estimateEmergencyTravelTime(
        calculatedDistance,
        h.erLoad
      );

      const requiredSpecialties = dispatchFilter.requiredSpecialties;
      const matchedSpecialties = requiredSpecialties.filter((req) =>
        h.specialties.includes(req)
      );
      const missingSpecialties = requiredSpecialties.filter(
        (req) => !h.specialties.includes(req)
      );

      let penalty = 0;
      if (availableBeds <= 0) {
        penalty += 1200;
      } else {
        penalty -= availableBeds * 6;
      }

      if (missingSpecialties.length > 0) {
        penalty += missingSpecialties.length * 150;
      }

      penalty += calculatedETA * 4;
      if (h.erLoad === 'Surge') penalty += 35;
      if (h.erLoad === 'Medium') penalty += 10;
      if (h.lastUpdatedMinutesAgo > 45) penalty += 50;
      if (h.diversionStatus === 'Diversion') penalty += 600;

      return {
        hospital: h,
        availableBeds,
        totalBeds: requestedBed.total,
        heldBeds: requestedBed.held,
        calculatedDistance,
        calculatedETA,
        matchedSpecialties,
        missingSpecialties,
        score: penalty,
      };
    });

    list.sort((a, b) => a.score - b.score);
    return list;
  }, [hospitals, dispatchFilter.requiredBedType, dispatchFilter.requiredSpecialties, originCoords]);

  const handleRequestBedHold = (targetHospital: Hospital) => {
    const hold = requestHold(
      targetHospital.id,
      dispatchFilter.requiredBedType,
      dispatchFilter.ambulanceCallSign,
      dispatchFilter.triageAcuity,
      {
        bp: cardiacTelemetry.bloodPressure,
        hr: cardiacTelemetry.heartRate,
        spo2: cardiacTelemetry.spo2,
        gcs: 8,
      }
    );
    setActiveModalHoldId(hold.id);
  };

  const currentActiveModalHold = useMemo(() => {
    if (!activeModalHoldId) return null;
    return activeHolds.find((h) => h.id === activeModalHoldId) || null;
  }, [activeHolds, activeModalHoldId]);

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];
  const allSpecialtyKeys = Object.keys(AVAILABLE_SPECIALTIES) as SpecialtyId[];

  // Theme styles: Tactical high-contrast night vs day
  const themeClasses = isNight
    ? 'bg-slate-950 text-slate-100 border-slate-800'
    : 'bg-white text-slate-900 border-slate-200';

  const cardClasses = isNight
    ? 'bg-slate-900 border-slate-800 text-slate-100'
    : 'bg-white border-slate-200 text-slate-900';

  return (
    <div className={`min-h-screen py-4 px-3 sm:px-6 flex flex-col gap-5 ${isNight ? 'bg-black' : 'bg-slate-50'}`}>
      {/* RUGGED HARDWARE STATUS BAR (MDT In-Vehicle Mount) */}
      <div className={`border rounded-lg p-3 sm:p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 ${cardClasses}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-amber-500 text-black flex items-center justify-center font-black text-sm tracking-tight shrink-0">
            MDT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-base tracking-wide uppercase">
                {dispatchFilter.ambulanceCallSign}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                NATIVE HARDWARE ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rugged In-Vehicle Mobile Data Terminal (Capacitor Native Build, Non-PWA)
            </p>
          </div>
        </div>

        {/* Hardware Controls: Wake Lock, Night Mode, GPS Satellite */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Wake Lock */}
          <button
            type="button"
            onClick={toggleWakeLock}
            className={`px-3 py-1.5 rounded border font-semibold flex items-center gap-1.5 cursor-pointer ${
              isWakeLockActive
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Prevents tablet screen from sleeping while vehicle is in motion"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Wake Lock: {isWakeLockActive ? 'LOCKED ON' : 'OFF'}</span>
          </button>

          {/* Night / Day Tactical Toggle */}
          <button
            type="button"
            onClick={() => setMdtTheme(isNight ? 'day_standard' : 'tactical_night')}
            className="px-3 py-1.5 rounded border bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {isNight ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isNight ? 'Day Mode' : 'Tactical Night'}</span>
          </button>

          {/* GPS Telemetry Pill */}
          <div className="px-3 py-1.5 rounded border bg-slate-800 border-slate-700 font-mono text-[11px] text-slate-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {originCoords.lat.toFixed(3)}N, {Math.abs(originCoords.lng).toFixed(3)}W
            </span>
          </div>
        </div>
      </div>

      {/* CARDIAC MONITOR BLUETOOTH TELEMETRY BRIDGE */}
      <div className={`border rounded-lg p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
        isNight ? 'bg-slate-900 border-amber-900/60' : 'bg-white border-amber-300'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-200">
                In-Vehicle Monitor Bridge: {cardiacTelemetry.monitorModel}
              </span>
              <button
                type="button"
                onClick={toggleMonitorConnection}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                  cardiacTelemetry.isConnected
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}
              >
                <Bluetooth className="w-3 h-3 inline mr-1" />
                {cardiacTelemetry.isConnected ? 'BLUETOOTH LINK ACTIVE' : 'DISCONNECTED'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live vitals streamed directly to destination hospital ER receiving desk.
            </p>
          </div>
        </div>

        {/* Live Vitals Telemetry Readouts */}
        <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
          <div className="bg-slate-950 border border-slate-800 p-2 rounded">
            <span className="text-[10px] text-slate-400 block font-sans">HEART RATE</span>
            <span className="text-lg font-bold text-rose-400">{cardiacTelemetry.heartRate}</span>
            <span className="text-[9px] text-slate-500 block">BPM</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2 rounded">
            <span className="text-[10px] text-slate-400 block font-sans">BP</span>
            <span className="text-lg font-bold text-amber-400">{cardiacTelemetry.bloodPressure}</span>
            <span className="text-[9px] text-slate-500 block">mmHg</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2 rounded">
            <span className="text-[10px] text-slate-400 block font-sans">SpO2</span>
            <span className="text-lg font-bold text-sky-400">{cardiacTelemetry.spo2}%</span>
            <span className="text-[9px] text-slate-500 block">15L NRB</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-2 rounded">
            <span className="text-[10px] text-slate-400 block font-sans">12-LEAD RHYTHM</span>
            <span className="text-xs font-bold text-rose-400 block mt-1">{cardiacTelemetry.ecgRhythm}</span>
            <span className="text-[9px] text-slate-500 block">EtCO2: {cardiacTelemetry.etco2}</span>
          </div>
        </div>
      </div>

      {/* PATIENT TRIAGE AND MULTI-CONSTRAINT SELECTION (Tactical Touch Targets) */}
      <div className={`border rounded-lg p-4 sm:p-5 shadow-sm space-y-4 ${cardClasses}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Triage Acuity */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-400">
              Acuity
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['Red', 'Yellow', 'Green'] as TriageAcuity[]).map((level) => {
                const isSelected = dispatchFilter.triageAcuity === level;
                let btnStyle = isNight ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200';
                if (isSelected) {
                  if (level === 'Red') btnStyle = 'bg-rose-600 text-white border-rose-500 font-bold';
                  if (level === 'Yellow') btnStyle = 'bg-amber-600 text-white border-amber-500 font-bold';
                  if (level === 'Green') btnStyle = 'bg-emerald-600 text-white border-emerald-500 font-bold';
                }
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDispatchFilter((p) => ({ ...p, triageAcuity: level }))}
                    className={`py-2 text-center rounded border text-xs cursor-pointer ${btnStyle}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Bed Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-400">
              Bed Category
            </label>
            <select
              value={dispatchFilter.requiredBedType}
              onChange={(e) => setDispatchFilter((p) => ({ ...p, requiredBedType: e.target.value as BedTypeId }))}
              className={`w-full border rounded p-2 text-xs font-bold cursor-pointer ${
                isNight ? 'bg-slate-950 text-slate-100 border-slate-700' : 'bg-white text-slate-900 border-slate-300'
              }`}
            >
              {bedKeys.map((key) => (
                <option key={key} value={key}>
                  {BED_TYPES[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Clinical Field Note */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider block mb-1 text-slate-400">
              Paramedic Complaint Note
            </label>
            <input
              type="text"
              value={dispatchFilter.patientConditionNote}
              onChange={(e) => setDispatchFilter((p) => ({ ...p, patientConditionNote: e.target.value }))}
              className={`w-full border rounded p-2 text-xs ${
                isNight ? 'bg-slate-950 text-slate-100 border-slate-700' : 'bg-slate-50 text-slate-900 border-slate-300'
              }`}
            />
          </div>
        </div>

        {/* Required Surgical Specialties Multi-Select */}
        <div className="pt-3 border-t border-slate-800">
          <div className="text-xs font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Required Specialties for Patient Stabilization:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {allSpecialtyKeys.map((key) => {
              const meta = AVAILABLE_SPECIALTIES[key];
              const isChecked = dispatchFilter.requiredSpecialties.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleSpecialtyFilter(key)}
                  className={`px-3 py-1.5 rounded text-xs font-medium border flex items-center gap-1.5 cursor-pointer ${
                    isChecked
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : isNight
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {isChecked ? <CheckSquare className="w-3.5 h-3.5 text-black" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOSPITAL MATRIX: TACTICAL RANKED LIST */}
      <div className="flex flex-col gap-3">
        {rankedHospitals.map((item, index) => {
          const { hospital, availableBeds, calculatedDistance, calculatedETA, matchedSpecialties, missingSpecialties } = item;
          const isBestMatch = index === 0 && availableBeds > 0;
          const isFull = availableBeds === 0;

          return (
            <div
              key={hospital.id}
              className={`border rounded-lg p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isBestMatch
                  ? isNight
                    ? 'border-amber-500 bg-slate-900 ring-1 ring-amber-500/50'
                    : 'border-sky-500 bg-white ring-1 ring-sky-300'
                  : isFull
                  ? isNight
                    ? 'border-slate-900 bg-slate-950 opacity-60'
                    : 'border-slate-200 bg-slate-50 opacity-60'
                  : cardClasses
              }`}
            >
              {/* Left Side: Hospital Details */}
              <div className="flex items-start gap-3 flex-1">
                <div
                  className={`w-9 h-9 rounded flex items-center justify-center font-bold text-sm shrink-0 ${
                    isBestMatch
                      ? 'bg-amber-500 text-black font-extrabold'
                      : isNight
                      ? 'bg-slate-800 text-slate-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  #{index + 1}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base tracking-tight">{hospital.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {hospital.code}
                    </span>
                    {isBestMatch && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-black">
                        RECOMMENDED DESTINATION
                      </span>
                    )}
                    {hospital.diversionStatus !== 'Open' && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {hospital.diversionStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    Radio: {hospital.directRadioChannel} &middot; Trauma: {hospital.designation}
                  </p>

                  {/* 4 Explicit Critical Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">1. Bed Match</span>
                      <span className={`font-mono font-bold text-sm ${availableBeds > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {availableBeds > 0 ? `${availableBeds} free beds` : '0 beds (FULL)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">2. Live Travel ETA</span>
                      <span className="font-mono font-bold text-sm text-slate-100 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {calculatedETA} mins ({calculatedDistance} km)
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">3. Specialties</span>
                      <span className={`font-bold text-xs ${missingSpecialties.length === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {missingSpecialties.length === 0 ? '100% Match' : `Missing ${missingSpecialties.length} special`}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[11px]">4. Freshness</span>
                      <span className="font-mono text-xs text-slate-300">
                        {hospital.lastUpdatedMinutesAgo} min ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: 1-Tap Bed Hold Request Button */}
              <div className="shrink-0 flex flex-col gap-2 min-w-[170px]">
                <button
                  type="button"
                  onClick={() => handleRequestBedHold(hospital)}
                  disabled={availableBeds <= 0}
                  className={`w-full py-3 px-4 rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    availableBeds <= 0
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : isBestMatch
                      ? 'bg-amber-500 hover:bg-amber-400 text-black font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600'
                  }`}
                >
                  <Navigation2 className="w-4 h-4" />
                  <span>{availableBeds <= 0 ? 'No Bed to Hold' : 'Lock Bed Hold (120s)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('hospital')}
                  className="w-full py-1.5 px-3 rounded text-[11px] text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 text-center cursor-pointer"
                >
                  View ER Receiving Board
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-MINUTE CONFIRMATION MODAL */}
      {currentActiveModalHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className={`border rounded-lg p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 ${isNight ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-base">
                120-Second Emergency Hold Window
              </h3>
              <button
                type="button"
                onClick={() => setActiveModalHoldId(null)}
                className="text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-950 p-3 rounded border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Target Destination:</span>
                <span className="text-base font-bold text-amber-400 block mt-0.5">{currentActiveModalHold.hospitalName}</span>
                <span className="text-xs text-slate-300 mt-1 block">
                  Holding: {BED_TYPES[currentActiveModalHold.bedType].label}
                </span>
              </div>

              {/* Countdown Timer */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded border border-slate-800">
                <CountdownRing
                  expiresAt={currentActiveModalHold.expiresAt}
                  totalDurationSeconds={120}
                  size={120}
                  strokeWidth={8}
                />
                <p className="text-xs text-slate-400 text-center mt-2">
                  Hospital has 120 seconds to confirm. On timeout or rejection, VitaRoute auto-escalates to the secondary facility.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {currentActiveModalHold.status === 'pending' ? (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => rejectHold(currentActiveModalHold.id, 'Capacity unavailable')}
                  className="py-2.5 px-4 rounded border border-rose-800 bg-rose-950 text-rose-300 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => acceptHold(currentActiveModalHold.id)}
                  className="py-2.5 px-4 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Accept (Confirm Bed)</span>
                </button>
              </div>
            ) : (
              <div className="bg-emerald-950 border border-emerald-800 p-3 rounded text-center">
                <span className="text-xs font-bold text-emerald-300 uppercase block">
                  BED LOCKED: ROUTE SECURED
                </span>
                <button
                  type="button"
                  onClick={() => setActiveModalHoldId(null)}
                  className="mt-2 px-3 py-1 bg-emerald-800 text-white text-xs font-bold rounded cursor-pointer"
                >
                  Return to Navigation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
