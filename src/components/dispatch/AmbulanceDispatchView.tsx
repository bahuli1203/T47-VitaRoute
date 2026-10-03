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
import {
  AMBULANCE_FLEET,
  MOCK_LOCATION_SECTORS,
} from '../../data/mockHospitals';
import {
  calculateHaversineDistance,
  estimateEmergencyTravelTime,
  METRO_SECTORS,
} from '../../utils/geo';
import { CountdownRing } from '../common/CountdownRing';
import { RuggedMdtView } from '../mdt/RuggedMdtView';
import {
  Clock,
  Navigation,
  Building,
  Check,
  X,
  ShieldCheck,
  MapPin,
  Compass,
  CheckSquare,
  Square,
  Layers,
} from 'lucide-react';

export const AmbulanceDispatchView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'mdt' | 'cad'>('cad');
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
    requestLiveLocation,
    isLocating,
    isLoadingRealHospitals,
    realHospitalSource,
    loadRealHospitalsForLocation,
  } = useBedLink();

  // Active confirmation modal hold state
  const [activeModalHoldId, setActiveModalHoldId] = useState<string | null>(null);

  // Quick preset patient clinical scenarios
  const quickScenarios = [
    {
      label: 'Cardiac Arrest / STEMI',
      bedType: 'cardiac_monitored' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      specialties: ['cardiac_cath_lab'] as SpecialtyId[],
      note: 'STEMI anterior lead, Post-resus ROSC, Emergent Cath Lab standby',
    },
    {
      label: 'ARDS / Vent Failure',
      bedType: 'icu_ventilator' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      specialties: ['ecmo'] as SpecialtyId[],
      note: 'Acute respiratory distress, SpO2 80% on 15L, Intubated in field',
    },
    {
      label: 'Severe Chemical Burn',
      bedType: 'burns_isolation' as BedTypeId,
      acuity: 'Yellow' as TriageAcuity,
      specialties: ['burn_unit'] as SpecialtyId[],
      note: '35% TBSA chemical alkali exposure, Negative pressure room',
    },
    {
      label: 'Blunt Poly-Trauma',
      bedType: 'trauma_resuscitation' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      specialties: ['trauma_level_1'] as SpecialtyId[],
      note: 'High-speed rollover, Hemodynamic shock, Rapid infuser needed',
    },
    {
      label: 'Acute Ischemic Stroke',
      bedType: 'icu_non_ventilator' as BedTypeId,
      acuity: 'Red' as TriageAcuity,
      specialties: ['stroke_thrombectomy'] as SpecialtyId[],
      note: 'Onset 45 mins ago, Dense hemiplegia, Emergent thrombectomy candidate',
    },
  ];

  // Origin coordinates for distance calculation: live GPS vs sector
  const originCoords = useMemo(() => {
    if (dispatchFilter.useLiveGps && liveCoordinates) {
      return liveCoordinates;
    }
    const sectorMeta = METRO_SECTORS[dispatchFilter.locationSector];
    return sectorMeta ? sectorMeta.coords : { lat: 40.7128, lng: -74.006 };
  }, [dispatchFilter.useLiveGps, dispatchFilter.locationSector, liveCoordinates]);

  // Compute composite multi-constraint score and rank hospitals
  const rankedHospitals = useMemo(() => {
    const list = hospitals.map((h) => {
      const requestedBed = h.beds[dispatchFilter.requiredBedType] || {
        total: 0,
        available: 0,
        held: 0,
      };
      const availableBeds = requestedBed.available;

      // Real Haversine distance and dynamic travel time
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

      // Multi-Specialty Constraint Evaluation
      const requiredSpecialties = dispatchFilter.requiredSpecialties;
      const matchedSpecialties = requiredSpecialties.filter((req) =>
        h.specialties.includes(req)
      );
      const missingSpecialties = requiredSpecialties.filter(
        (req) => !h.specialties.includes(req)
      );
      const specialtyMatchRate =
        requiredSpecialties.length > 0
          ? matchedSpecialties.length / requiredSpecialties.length
          : 1.0;

      // Composite algorithmic penalty score (lower is better)
      let penalty = 0;

      // 1. Bed Availability Weight
      if (availableBeds <= 0) {
        penalty += 1200;
      } else {
        penalty -= availableBeds * 6;
      }

      // 2. Specialty Missing Weight
      if (missingSpecialties.length > 0) {
        penalty += missingSpecialties.length * 150;
      }

      // 3. Travel Time Weight
      penalty += calculatedETA * 4;

      // 4. ER Load Strain
      if (h.erLoad === 'Surge') penalty += 35;
      if (h.erLoad === 'Medium') penalty += 10;

      // 5. Data Freshness Penalty
      if (h.lastUpdatedMinutesAgo > 45) {
        penalty += 50;
      } else if (h.lastUpdatedMinutesAgo > 15) {
        penalty += 15;
      }

      // 6. Diversion Status Penalty
      if (h.diversionStatus === 'Diversion') penalty += 600;
      if (h.diversionStatus === 'Advisory') penalty += 25;

      return {
        hospital: h,
        availableBeds,
        totalBeds: requestedBed.total,
        heldBeds: requestedBed.held,
        calculatedDistance,
        calculatedETA,
        matchedSpecialties,
        missingSpecialties,
        specialtyMatchRate,
        score: penalty,
      };
    });

    list.sort((a, b) => a.score - b.score);
    return list;
  }, [hospitals, dispatchFilter.requiredBedType, dispatchFilter.requiredSpecialties, originCoords]);

  const handleRequestBedHold = (targetHospital: Hospital) => {
    const hold = requestHold(targetHospital.id, dispatchFilter.requiredBedType);
    setActiveModalHoldId(hold.id);
  };

  const currentActiveModalHold = useMemo(() => {
    if (!activeModalHoldId) return null;
    const direct = activeHolds.find((h) => h.id === activeModalHoldId);
    if (!direct) return null;
    // Auto-follow escalation chain if the previous hospital rejected or timed out
    if ((direct.status === 'expired' || direct.status === 'rejected') && direct.escalatedToHospitalId) {
      const escalated = activeHolds.find(
        (h) => h.hospitalId === direct.escalatedToHospitalId && (h.status === 'pending' || h.status === 'accepted')
      );
      if (escalated) return escalated;
    }
    return direct;
  }, [activeHolds, activeModalHoldId]);

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];
  const allSpecialtyKeys = Object.keys(AVAILABLE_SPECIALTIES) as SpecialtyId[];

  if (viewMode === 'mdt') {
    return (
      <div className="flex flex-col">
        <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Ambulance Operating Mode:</span>
              <span className="text-slate-400">Capacitor Native Hardware MDT Tablet (Non-PWA)</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('mdt')}
                className="px-3 py-1 rounded text-xs font-semibold cursor-pointer bg-amber-500 text-black font-bold"
              >
                In-Vehicle Rugged MDT (Tablet)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cad')}
                className="px-3 py-1 rounded text-xs font-semibold cursor-pointer text-slate-400 hover:text-white"
              >
                Regional CAD Console
              </button>
            </div>
          </div>
        </div>
        <RuggedMdtView />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="bg-white border-b border-neutral-200 text-neutral-600 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-900">Console Mode:</span>
            <span className="text-neutral-500">Ambulance Dispatch &amp; Road Routing</span>
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
            <button
              type="button"
              onClick={() => setViewMode('cad')}
              className="px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors bg-neutral-900 text-white shadow-xs"
            >
              Dispatch Console
            </button>
            <button
              type="button"
              onClick={() => setViewMode('mdt')}
              className="px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors text-neutral-600 hover:text-neutral-900"
            >
              In-Vehicle Tablet (MDT)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 w-full">
      {/* Patient Requirement, Multi-Constraint and Location Form */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
          <div>
            <h2 className="text-base font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Ambulance Dispatch &amp; Hospital Matching</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Ranks hospitals by actual road travel time, bed availability, surgical teams, and ER crowding.
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
                    requiredSpecialties: sc.specialties,
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

        {/* Inputs Grid: Unit, Acuity, Bed Type, Geolocation Mode */}
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
              className="w-full bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm font-semibold p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 cursor-pointer"
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
            <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block mb-1.5">
              Triage Acuity
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Red', 'Yellow', 'Green'] as TriageAcuity[]).map((level) => {
                const isSelected = dispatchFilter.triageAcuity === level;
                let btnStyle = 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100';
                if (isSelected) {
                  if (level === 'Red') btnStyle = 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
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
            <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider block mb-1.5">
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
              className="w-full bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm font-semibold p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 cursor-pointer"
            >
              {bedKeys.map((key) => (
                <option key={key} value={key}>
                  {BED_TYPES[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Origin Mode (Live GPS vs Sector) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Ambulance Location
              </label>
              <button
                type="button"
                onClick={() =>
                  setDispatchFilter((prev) => ({
                    ...prev,
                    useLiveGps: !prev.useLiveGps,
                  }))
                }
                className="text-[11px] font-semibold text-neutral-700 hover:text-neutral-950 underline cursor-pointer"
              >
                {dispatchFilter.useLiveGps ? 'Use Sector' : 'Use Live GPS'}
              </button>
            </div>

            {dispatchFilter.useLiveGps ? (
              <div className="bg-neutral-50 border border-neutral-300 rounded-lg p-2 flex flex-col gap-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-800 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>
                      {originCoords.lat.toFixed(4)}°N, {Math.abs(originCoords.lng).toFixed(4)}°W
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={requestLiveLocation}
                    disabled={isLocating}
                    className="text-[11px] text-neutral-800 font-bold hover:underline cursor-pointer"
                  >
                    {isLocating ? 'Locating...' : 'Refresh GPS'}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => loadRealHospitalsForLocation(originCoords.lat, originCoords.lng)}
                  disabled={isLoadingRealHospitals}
                  className="w-full py-1.5 px-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-[11px] flex items-center justify-center gap-1 border border-neutral-300 transition-colors cursor-pointer"
                >
                  <span>{isLoadingRealHospitals ? 'Querying OpenStreetMap...' : 'Scan Nearby Area (OSM API)'}</span>
                </button>
              </div>
            ) : (
              <select
                value={dispatchFilter.locationSector}
                onChange={(e) =>
                  setDispatchFilter((prev) => ({
                    ...prev,
                    locationSector: e.target.value,
                  }))
                }
                aria-label="Ambulance Location Sector"
                className="w-full bg-white border border-neutral-300 rounded-lg text-neutral-900 text-sm font-semibold p-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 cursor-pointer"
              >
                {MOCK_LOCATION_SECTORS.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Multi-Specialty Filter Matrix */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-700" />
              <span>Required Clinical Specialties:</span>
            </span>
            <span className="text-[11px] text-neutral-500">
              {dispatchFilter.requiredSpecialties.length} specialty criteria active
            </span>
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isChecked
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                  <span>{meta.label}</span>
                </button>
              );
            })}
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
            placeholder="e.g. Acute respiratory distress, SpO2 82%, intubated in field"
            className="flex-1 bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
          />
        </div>
      </div>

      {/* Hospital Recommendations Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Recommended Hospitals: Matched for {BED_TYPES[dispatchFilter.requiredBedType].label}
          </h2>
          <p className="text-xs text-slate-500">
            Sorted by live bed inventory, specialty compatibility, GPS road distance, data freshness, and ER load.
          </p>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-3">
          <span className="font-semibold text-slate-700">Data Freshness:</span>
          <span className="text-emerald-700 font-medium">&bull; &lt;15 min (Fresh)</span>
          <span className="text-amber-700 font-medium">&bull; 15-45 min</span>
          <span className="text-rose-700 font-medium">&bull; &gt;45 min (Stale)</span>
        </div>
      </div>

      {/* Clean Hospital Recommendation List Layout */}
      <div className="flex flex-col gap-3">
        {rankedHospitals.map((item, index) => {
          const {
            hospital,
            availableBeds,
            heldBeds,
            calculatedDistance,
            calculatedETA,
            matchedSpecialties,
            missingSpecialties,
          } = item;

          const isBestMatch = index === 0 && availableBeds > 0;
          const rankNumber = index + 1;
          const isFull = availableBeds === 0;

          // Freshness calculation explicitly (Problem Statement requirement: Every listing shows how many minutes old its data is)
          let freshnessLabel = hospital.lastUpdatedMinutesAgo <= 0
            ? 'Updated <1 min ago (Live)'
            : `Updated ${hospital.lastUpdatedMinutesAgo} min ago`;
          let freshnessStyle = 'text-emerald-800 bg-emerald-50 border-emerald-200';

          if (hospital.lastUpdatedMinutesAgo > 45) {
            freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago (Stale data)`;
            freshnessStyle = 'text-rose-800 bg-rose-50 border-rose-200';
          } else if (hospital.lastUpdatedMinutesAgo > 15) {
            freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago`;
            freshnessStyle = 'text-amber-800 bg-amber-50 border-amber-200';
          }

          // ER Load
          let erLoadLabel = `${hospital.erLoad} Load`;
          let erLoadStyle = 'text-slate-700 bg-slate-100 border-slate-200';
          if (hospital.erLoad === 'Surge') {
            erLoadStyle = 'text-rose-800 bg-rose-50 border-rose-200 font-semibold';
          } else if (hospital.erLoad === 'Medium') {
            erLoadStyle = 'text-amber-800 bg-amber-50 border-amber-200 font-semibold';
          }

          return (
            <div
              key={hospital.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isBestMatch
                  ? 'border-neutral-900 ring-1 ring-neutral-900/10 bg-neutral-50/30'
                  : isFull
                  ? 'border-neutral-200 opacity-75 bg-neutral-50/40'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              {/* Left Side: Hospital Details and Metrics */}
              <div className="flex items-start gap-4 flex-1">
                {/* Clean Rank Number */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border ${
                    isBestMatch
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}
                >
                  #{rankNumber}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-950">
                      {hospital.name}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {hospital.code}
                    </span>
                    {isBestMatch && (
                      <span className="text-xs font-semibold text-neutral-900 bg-neutral-100 border border-neutral-300 px-2 py-0.5 rounded">
                        #1 Recommended Match
                      </span>
                    )}
                    {hospital.diversionStatus !== 'Open' && (
                      <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        {hospital.diversionStatus}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-0.5">
                    {hospital.designation} &middot; {hospital.address}
                  </p>

                  {/* 5 Explicit Metrics Display */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                    {/* 1. Bed match */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        1. Bed Match
                      </span>
                      <span
                        className={`text-sm font-bold font-mono mt-0.5 block ${
                          availableBeds > 2
                            ? 'text-emerald-700'
                            : availableBeds > 0
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {availableBeds > 0
                          ? `${availableBeds} beds free`
                          : '0 beds free'}
                      </span>
                      {heldBeds > 0 && (
                        <span className="text-[11px] text-amber-700 block">
                          +{heldBeds} held by EMS
                        </span>
                      )}
                    </div>

                    {/* 2. Specialty Compatibility */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        2. Specialties
                      </span>
                      {dispatchFilter.requiredSpecialties.length === 0 ? (
                        <span className="text-xs text-slate-600 mt-0.5 block font-medium">
                          No specialty filter
                        </span>
                      ) : missingSpecialties.length === 0 ? (
                        <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                          100% Match ({matchedSpecialties.length}/{dispatchFilter.requiredSpecialties.length})
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-700 mt-0.5 block">
                          Missing {missingSpecialties.length} specialty
                        </span>
                      )}
                    </div>

                    {/* 3. Estimated Travel Time */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        3. Travel Time
                      </span>
                      <span className="text-sm font-bold font-mono text-slate-900 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {calculatedETA} mins ({calculatedDistance} km)
                      </span>
                    </div>

                    {/* 4. Bed-Data Freshness */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        4. Data Freshness
                      </span>
                      <span
                        className={`inline-block px-2 py-0.5 rounded border text-[11px] font-semibold mt-0.5 ${freshnessStyle}`}
                      >
                        {freshnessLabel}
                      </span>
                    </div>

                    {/* 5. Current Hospital/ER Load */}
                    <div>
                      <span className="text-slate-500 block text-[11px] font-medium">
                        5. ER Strain
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
              <div className="shrink-0 flex flex-col gap-2 min-w-[160px] pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                <button
                  onClick={() => handleRequestBedHold(hospital)}
                  disabled={availableBeds <= 0}
                  className={`w-full py-2.5 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
                    availableBeds <= 0
                      ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed'
                      : isBestMatch
                      ? 'bg-neutral-900 hover:bg-black text-white'
                      : 'bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{availableBeds <= 0 ? 'No Bed to Hold' : 'Request Bed Hold'}</span>
                </button>

                <button
                  onClick={() => setRole('hospital')}
                  className="w-full py-1.5 px-3 rounded-lg text-[11px] text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors text-center cursor-pointer"
                >
                  View Bed Hold Board
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-MINUTE CONFIRMATION MODAL / DIALOG */}
      {currentActiveModalHold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2 text-neutral-900">
                <Building className="w-5 h-5 text-neutral-700" />
                <h3 className="font-bold text-base text-neutral-950">
                  2-Minute Bed Hold Confirmation Window
                </h3>
              </div>
              <button
                onClick={() => setActiveModalHoldId(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
                aria-label="Close Confirmation Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Hold Details */}
            <div className="space-y-3 text-sm">
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Reservation Target:
                </div>
                <div className="text-base font-bold text-neutral-900 mt-0.5">
                  Bed request sent to {currentActiveModalHold.hospitalName}
                </div>
                <div className="text-xs font-semibold text-neutral-700 mt-1">
                  {BED_TYPES[currentActiveModalHold.bedType].label}: 1 bed held
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block font-medium">Ambulance Call Sign:</span>
                  <span className="font-bold text-neutral-900 font-mono">
                    {currentActiveModalHold.ambulanceCallSign}
                  </span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <span className="text-neutral-500 block font-medium">Estimated Arrival:</span>
                  <span className="font-bold text-neutral-900 font-mono">
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
                  Hospital receiving desk has 120 seconds to confirm. On rejection or timeout, VitaRoute automatically escalates to the next hospital.
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
                  className="py-2.5 px-4 rounded-md border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4 text-rose-600" />
                  <span>Reject (Divert)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    acceptHold(currentActiveModalHold.id);
                  }}
                  className="py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Accept (Lock Bed)</span>
                </button>
              </div>
            ) : currentActiveModalHold.status === 'accepted' ? (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-md text-center">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  BED HELD: RESERVATION LOCKED
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  Bed is locked for {currentActiveModalHold.ambulanceCallSign}.
                </p>
                <button
                  onClick={() => {
                    setActiveModalHoldId(null);
                    setRole('hospital');
                  }}
                  className="mt-2.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md"
                >
                  View in Bed Hold Screen
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
    </div>
  );
};
