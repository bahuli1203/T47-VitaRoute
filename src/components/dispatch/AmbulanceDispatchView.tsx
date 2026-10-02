import React, { useMemo, useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import {
  BED_TYPES,
  BedTypeId,
  TRIAGE_LEVELS,
  TriageAcuity,
  Hospital,
  HoldRequest,
} from '../../types/bedlink';
import {
  AMBULANCE_FLEET,
  MOCK_LOCATION_SECTORS,
} from '../../data/mockHospitals';
import { CountdownRing } from '../common/CountdownRing';
import {
  Clock,
  Navigation,
  CheckCircle,
  TrendingUp,
  Building,
  Check,
  X,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const AmbulanceDispatchView: React.FC = () => {
  const {
    hospitals,
    dispatchFilter,
    setDispatchFilter,
    requestHold,
    acceptHold,
    rejectHold,
    activeHolds,
    setRole,
  } = useBedLink();

  // Active confirmation modal hold state
  const [activeModalHoldId, setActiveModalHoldId] = useState<string | null>(null);

  // Quick preset patient clinical scenarios
  const quickScenarios = [
    {
      label: 'Cardiac Arrest / STEMI',
      bedType: 'cardiac_monitored' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      note: 'STEMI anterior lead · Post-resus ROSC · Emergent Cath Lab standby',
    },
    {
      label: 'ARDS / Vent Failure',
      bedType: 'icu_ventilator' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      note: 'Acute respiratory distress · SpO2 80% on 15L · Intubated in field',
    },
    {
      label: 'Severe Chemical Burn',
      bedType: 'burns_isolation' as BedTypeId,
      acuity: 'Yellow' as TriageAcuity,
      note: '35% TBSA chemical alkali exposure · Negative pressure room',
    },
    {
      label: 'Blunt Poly-Trauma',
      bedType: 'trauma_resuscitation' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      note: 'High-speed rollover · Hemodynamic shock · Rapid infuser needed',
    },
  ];

  const currentSector = useMemo(() => {
    return (
      MOCK_LOCATION_SECTORS.find((s) => s.id === dispatchFilter.locationSector) ||
      MOCK_LOCATION_SECTORS[0]
    );
  }, [dispatchFilter.locationSector]);

  // Compute composite score and rank hospitals
  const rankedHospitals = useMemo(() => {
    const list = hospitals.map((h) => {
      const requestedBed = h.beds[dispatchFilter.requiredBedType] || {
        total: 0,
        available: 0,
        held: 0,
      };
      const availableBeds = requestedBed.available;

      const calculatedDistance = Number(
        (h.distanceKm + currentSector.baseDistanceOffset).toFixed(1)
      );
      const calculatedETA = Math.max(
        4,
        Math.round(h.travelTimeMins + currentSector.baseDistanceOffset * 1.8)
      );

      let penalty = 0;
      if (availableBeds <= 0) {
        penalty += 1000;
      } else {
        penalty -= availableBeds * 5;
      }

      penalty += calculatedETA * 3;

      if (h.erLoad === 'Surge') penalty += 30;
      if (h.erLoad === 'Medium') penalty += 10;

      if (h.lastUpdatedMinutesAgo > 45) {
        penalty += 45;
      } else if (h.lastUpdatedMinutesAgo > 20) {
        penalty += 15;
      }

      if (h.diversionStatus === 'Diversion') penalty += 500;
      if (h.diversionStatus === 'Advisory') penalty += 20;

      return {
        hospital: h,
        availableBeds,
        totalBeds: requestedBed.total,
        heldBeds: requestedBed.held,
        calculatedDistance,
        calculatedETA,
        score: penalty,
      };
    });

    list.sort((a, b) => a.score - b.score);
    return list;
  }, [hospitals, dispatchFilter.requiredBedType, currentSector]);

  const handleRequestBedHold = (targetHospital: Hospital) => {
    const hold = requestHold(targetHospital.id, dispatchFilter.requiredBedType);
    setActiveModalHoldId(hold.id);
  };

  const currentActiveModalHold = useMemo(() => {
    if (!activeModalHoldId) return null;
    return activeHolds.find((h) => h.id === activeModalHoldId) || null;
  }, [activeHolds, activeModalHoldId]);

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Patient Requirement & Ambulance Location Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Ambulance Dispatch &amp; Patient Requirement</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select patient acuity, bed category, and current ambulance location to rank regional facilities.
            </p>
          </div>

          {/* Quick Scenario Fill Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Quick Clinical Presets:</span>
            {quickScenarios.map((sc) => (
              <button
                key={sc.label}
                onClick={() =>
                  setDispatchFilter((prev) => ({
                    ...prev,
                    requiredBedType: sc.bedType,
                    triageAcuity: sc.acuity,
                    patientConditionNote: sc.note,
                  }))
                }
                className="px-2.5 py-1 text-xs rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border border-slate-200 transition-colors"
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid: Unit, Acuity, Bed Type, Sector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
          {/* Ambulance Unit */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Ambulance ID / Unit
            </label>
            <select
              value={dispatchFilter.ambulanceCallSign}
              onChange={(e) =>
                setDispatchFilter((prev) => ({
                  ...prev,
                  ambulanceCallSign: e.target.value,
                }))
              }
              aria-label="Select Ambulance ID"
              className="w-full bg-white border border-slate-300 rounded-md text-slate-900 text-sm font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
            >
              {AMBULANCE_FLEET.map((fleet) => (
                <option key={fleet} value={fleet}>
                  {fleet}
                </option>
              ))}
            </select>
          </div>

          {/* Triage Acuity */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Triage Acuity
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Red', 'Yellow', 'Green'] as TriageAcuity[]).map((level) => {
                const isSelected = dispatchFilter.triageAcuity === level;
                let btnStyle = 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
                if (isSelected) {
                  if (level === 'Red') btnStyle = 'bg-red-50 text-red-700 border-red-300 font-bold';
                  if (level === 'Yellow') btnStyle = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                  if (level === 'Green') btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                }
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setDispatchFilter((prev) => ({
                        ...prev,
                        triageAcuity: level,
                      }))
                    }
                    className={`py-2 px-1 text-center rounded-md border text-xs transition-colors ${btnStyle}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Required Bed Category */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Required Bed Type
            </label>
            <select
              value={dispatchFilter.requiredBedType}
              onChange={(e) =>
                setDispatchFilter((prev) => ({
                  ...prev,
                  requiredBedType: e.target.value as BedTypeId,
                }))
              }
              aria-label="Required Bed Category"
              className="w-full bg-white border border-slate-300 rounded-md text-slate-900 text-sm font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
            >
              {bedKeys.map((key) => (
                <option key={key} value={key}>
                  {BED_TYPES[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Sector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
              Ambulance Location
            </label>
            <select
              value={dispatchFilter.locationSector}
              onChange={(e) =>
                setDispatchFilter((prev) => ({
                  ...prev,
                  locationSector: e.target.value,
                }))
              }
              aria-label="Ambulance Location Sector"
              className="w-full bg-white border border-slate-300 rounded-md text-slate-900 text-sm font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
            >
              {MOCK_LOCATION_SECTORS.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clinical Note Strip */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 shrink-0">
            Patient Complaint / Field Note:
          </span>
          <input
            type="text"
            value={dispatchFilter.patientConditionNote}
            onChange={(e) =>
              setDispatchFilter((prev) => ({
                ...prev,
                patientConditionNote: e.target.value,
              }))
            }
            placeholder="e.g. Acute respiratory distress, SpO2 82%, intubated..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
          />
        </div>
      </div>

      {/* Hospital Recommendations Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recommended Hospitals &middot; Matched for {BED_TYPES[dispatchFilter.requiredBedType].label}
          </h2>
          <p className="text-xs text-slate-500">
            Sorted by live bed availability, travel time, data freshness, and emergency room strain.
          </p>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-3">
          <span className="font-semibold text-slate-700">Data Freshness:</span>
          <span className="text-emerald-700 font-medium">&bull; &lt;15 min (Fresh)</span>
          <span className="text-amber-700 font-medium">&bull; 15&ndash;45 min</span>
          <span className="text-red-700 font-medium">&bull; &gt;45 min (Stale)</span>
        </div>
      </div>

      {/* Clean Hospital Recommendation List Layout */}
      <div className="flex flex-col gap-3">
        {rankedHospitals.map((item, index) => {
          const { hospital, availableBeds, totalBeds, heldBeds, calculatedDistance, calculatedETA } = item;
          const isBestMatch = index === 0 && availableBeds > 0;
          const rankNumber = index + 1;
          const isFull = availableBeds === 0;

          // Freshness calculation explicitly
          let freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago`;
          let freshnessStyle = 'text-emerald-800 bg-emerald-50 border-emerald-200';

          if (hospital.lastUpdatedMinutesAgo > 45) {
            freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago (Stale data)`;
            freshnessStyle = 'text-red-800 bg-red-50 border-red-200';
          } else if (hospital.lastUpdatedMinutesAgo > 15) {
            freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago`;
            freshnessStyle = 'text-amber-800 bg-amber-50 border-amber-200';
          }

          // ER Load
          let erLoadLabel = `${hospital.erLoad} Load`;
          let erLoadStyle = 'text-slate-700 bg-slate-100 border-slate-200';
          if (hospital.erLoad === 'Surge') {
            erLoadStyle = 'text-red-800 bg-red-50 border-red-200 font-semibold';
          } else if (hospital.erLoad === 'Medium') {
            erLoadStyle = 'text-amber-800 bg-amber-50 border-amber-200 font-semibold';
          }

          return (
            <div
              key={hospital.id}
              className={`bg-white border rounded-lg p-4 sm:p-5 shadow-xs transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isBestMatch
                  ? 'border-sky-400 ring-1 ring-sky-300'
                  : isFull
                  ? 'border-slate-200 opacity-75 bg-slate-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Left Side: Hospital Details and Explicit Metrics */}
              <div className="flex items-start gap-4 flex-1">
                {/* Clean Rank Number */}
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isBestMatch
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  #{rankNumber}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {hospital.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {hospital.code}
                    </span>
                    {isBestMatch && (
                      <span className="text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                        #1 Recommended Match
                      </span>
                    )}
                    {hospital.diversionStatus !== 'Open' && (
                      <span className="text-xs font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        {hospital.diversionStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5">
                    {hospital.designation} &middot; {hospital.address}
                  </p>

                  {/* 4 Explicit Required Display Elements */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                    {/* 1. Bed match */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        1. Bed Match ({BED_TYPES[dispatchFilter.requiredBedType].shortLabel})
                      </span>
                      <span
                        className={`text-sm font-bold font-mono mt-0.5 block ${
                          availableBeds > 2
                            ? 'text-emerald-700'
                            : availableBeds > 0
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }`}
                      >
                        {availableBeds > 0
                          ? `${availableBeds} beds available`
                          : '0 beds available (Full)'}
                      </span>
                      {heldBeds > 0 && (
                        <span className="text-[11px] text-amber-700 block">
                          +{heldBeds} held by EMS
                        </span>
                      )}
                    </div>

                    {/* 2. Estimated Travel Time */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        2. Travel Time
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {calculatedETA} mins ({calculatedDistance} km)
                      </span>
                    </div>

                    {/* 3. Bed-Data Freshness */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        3. Bed-Data Freshness
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold mt-0.5 ${freshnessStyle}`}
                      >
                        {freshnessLabel}
                      </span>
                    </div>

                    {/* 4. Current Hospital/ER Load */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        4. Hospital / ER Load
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold mt-0.5 ${erLoadStyle}`}
                      >
                        {erLoadLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Request Bed Hold Action */}
              <div className="shrink-0 flex flex-col gap-2 min-w-[160px] pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                <button
                  onClick={() => handleRequestBedHold(hospital)}
                  disabled={availableBeds <= 0}
                  className={`w-full py-2.5 px-4 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                    availableBeds <= 0
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : isBestMatch
                      ? 'bg-sky-600 hover:bg-sky-700 text-white border border-sky-600'
                      : 'bg-white hover:bg-slate-50 text-sky-800 border border-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{availableBeds <= 0 ? 'No Bed to Hold' : 'Request Bed Hold'}</span>
                </button>

                <button
                  onClick={() => setRole('er')}
                  className="w-full py-1.5 px-3 rounded-md text-[11px] text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-center"
                >
                  View Bed Hold Board &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-MINUTE CONFIRMATION MODAL / DIALOG */}
      {currentActiveModalHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-lg w-full shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-sky-800">
                <Building className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">
                  2-Minute Bed Hold Confirmation
                </h3>
              </div>
              <button
                onClick={() => setActiveModalHoldId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label="Close Confirmation Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hold Details as requested */}
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Request Status:
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  Bed request sent to {currentActiveModalHold.hospitalName}
                </div>
                <div className="text-xs font-semibold text-sky-800 mt-1">
                  {BED_TYPES[currentActiveModalHold.bedType].label} &mdash; 1 bed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block font-medium">Ambulance Call Sign:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {currentActiveModalHold.ambulanceCallSign}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-slate-500 block font-medium">Estimated Arrival:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ~{currentActiveModalHold.etaMinutes} mins ({currentActiveModalHold.distanceKm} km)
                  </span>
                </div>
              </div>

              {/* 2-Minute Countdown Timer */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-md border border-slate-200">
                <span className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                  Hospital Confirmation Window
                </span>
                <CountdownRing
                  expiresAt={currentActiveModalHold.expiresAt}
                  totalDurationSeconds={120}
                  size={120}
                  strokeWidth={8}
                />
                <p className="text-xs text-slate-500 text-center mt-2">
                  Hospital has 120 seconds to confirm bed reservation.
                </p>
              </div>
            </div>

            {/* Accept & Reject Buttons */}
            {currentActiveModalHold.status === 'pending' ? (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    rejectHold(currentActiveModalHold.id, 'Capacity unavailable');
                  }}
                  className="py-2.5 px-4 rounded-md border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-red-600" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    acceptHold(currentActiveModalHold.id);
                  }}
                  className="py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Accept (Confirm Bed)</span>
                </button>
              </div>
            ) : currentActiveModalHold.status === 'accepted' ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md text-center">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  BED HELD &mdash; RESERVATION LOCKED
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Bed is officially reserved for {currentActiveModalHold.ambulanceCallSign}.
                </p>
                <button
                  onClick={() => {
                    setActiveModalHoldId(null);
                    setRole('er');
                  }}
                  className="mt-2.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md"
                >
                  View in Bed Hold Screen &rarr;
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-center">
                <span className="text-xs font-bold text-amber-800 block">
                  Hospital did not confirm. Contacting next available hospital...
                </span>
                <button
                  onClick={() => setActiveModalHoldId(null)}
                  className="mt-2 px-3 py-1 bg-white border border-slate-300 text-slate-700 text-xs rounded font-medium"
                >
                  Back to Recommendations
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
