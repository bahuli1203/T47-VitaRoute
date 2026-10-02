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
    return activeHolds.find((h) => h.id === activeModalHoldId) || null;
  }, [activeHolds, activeModalHoldId]);

  const bedKeys = Object.keys(BED_TYPES) as BedTypeId[];
  const allSpecialtyKeys = Object.keys(AVAILABLE_SPECIALTIES) as SpecialtyId[];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Patient Requirement, Multi-Constraint and Location Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Ambulance Dispatch and Multi-Constraint Matching</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranks regional facilities by live bed availability, required surgical specialties, GPS travel time, and ER load.
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

          {/* Location Origin Mode (Live GPS vs Sector) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
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
                className="text-[11px] font-semibold text-sky-700 hover:text-sky-800"
              >
                {dispatchFilter.useLiveGps ? 'Use Sector' : 'Use Live GPS'}
              </button>
            </div>

            {dispatchFilter.useLiveGps ? (
              <div className="bg-slate-50 border border-slate-300 rounded-md p-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-800 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    {originCoords.lat.toFixed(3)}N, {Math.abs(originCoords.lng).toFixed(3)}W
                  </span>
                </div>
                <button
                  type="button"
                  onClick={requestLiveLocation}
                  disabled={isLocating}
                  className="text-[11px] text-sky-700 font-semibold hover:underline"
                >
                  {isLocating ? 'Locating...' : 'Refresh GPS'}
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
                className="w-full bg-white border border-slate-300 rounded-md text-slate-900 text-sm font-semibold p-2 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
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
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-700" />
              <span>Required Clinical Specialties (Multi-Select Constraints):</span>
            </span>
            <span className="text-[11px] text-slate-500">
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
                  className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-sky-50 text-sky-900 border-sky-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-sky-700" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
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
            className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:border-sky-600"
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

          // Freshness calculation explicitly
          let freshnessLabel = `Updated ${hospital.lastUpdatedMinutesAgo} min ago`;
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
              className={`bg-white border rounded-lg p-4 sm:p-5 shadow-xs transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isBestMatch
                  ? 'border-sky-400 ring-1 ring-sky-300'
                  : isFull
                  ? 'border-slate-200 opacity-75 bg-slate-50/50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Left Side: Hospital Details and Metrics */}
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
                  View Bed Hold Board
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
                  2-Minute Bed Hold Confirmation Window
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

            {/* Hold Details */}
            <div className="space-y-3 text-sm">
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reservation Target:
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  Bed request sent to {currentActiveModalHold.hospitalName}
                </div>
                <div className="text-xs font-semibold text-sky-800 mt-1">
                  {BED_TYPES[currentActiveModalHold.bedType].label}: 1 bed held
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
                    setRole('er');
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
  );
};
