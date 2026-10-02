import React from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { useAuth } from '../../context/AuthContext';
import { EmergencyTimeline } from '../common/EmergencyTimeline';
import { BED_TYPES, AVAILABLE_SPECIALTIES } from '../../types/bedlink';
import {
  Ambulance,
  MapPin,
  Building2,
  Clock,
  Navigation,
  CheckCircle2,
  HandMetal,
  User,
  Phone,
  Activity,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Radio,
  ArrowLeft,
  Users,
  Gauge,
  Fuel,
} from 'lucide-react';

export const AmbulanceDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    emergencies,
    activeEmergency,
    ambulanceAction,
    activeHolds,
    hospitals,
    liveCoordinates,
    completeEmergency,
  } = useBedLink();

  const currentEmergency = activeEmergency || emergencies.find((e) => e.status !== 'completed');

  const assignedHospital = currentEmergency?.assignedHospitalId
    ? hospitals.find((h) => h.id === currentEmergency.assignedHospitalId)
    : null;

  const currentHold = currentEmergency?.holdRequestId
    ? activeHolds.find((h) => h.id === currentEmergency.holdRequestId)
    : null;

  const fallbackHold = currentEmergency?.assignedHospitalId
    ? activeHolds.find(
        (h) =>
          h.hospitalId === currentEmergency.assignedHospitalId &&
          (h.status === 'pending' || h.status === 'accepted')
      )
    : null;

  const displayHold = currentHold || fallbackHold;

  const handleNavigate = () => {
    if (!currentEmergency) return;
    ambulanceAction(currentEmergency.id, 'navigate');
    if (assignedHospital) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${assignedHospital.lat},${assignedHospital.lng}&travelmode=driving`,
        '_blank'
      );
    }
  };

  const handleArrived = () => {
    if (!currentEmergency) return;
    ambulanceAction(currentEmergency.id, 'arrived');
  };

  const handleHandedOver = () => {
    if (!currentEmergency) return;
    ambulanceAction(currentEmergency.id, 'handed_over');
  };

  const canNavigate = currentEmergency?.status === 'hospital_confirmed' || currentEmergency?.status === 'hospital_pending' || currentEmergency?.status === 'ambulance_dispatched' || currentEmergency?.status === 'active';
  const canMarkArrived = currentEmergency?.status === 'en_route_hospital';
  const canHandOver = currentEmergency?.status === 'arrived';

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
            <Ambulance className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Paramedic Fleet Operations</span>
            <span className="text-xs font-mono text-slate-500">Unit #{user?.ambulanceId || 'AMB-402'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="px-2.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono font-bold">
            Radio: EMS-CH 9
          </span>
          <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
            GPS: Active
          </span>
        </div>
      </div>

      {/* 3-Column Layout for Desktop / Single Column Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: Unit Diagnostics, Crew Roster & Patient Brief */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Unit Status & Telematics Management Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{user?.name || 'Paramedic Unit'}</h3>
                  <p className="text-xs font-mono text-slate-500">{user?.ambulanceId || 'AMB-402'}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                currentEmergency && currentEmergency.status !== 'completed'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}>
                {currentEmergency && currentEmergency.status !== 'completed' ? 'DISPATCHED' : 'STANDBY'}
              </span>
            </div>

            {/* Vehicle Telematics Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">Live GPS Coordinates</td>
                    <td className="py-2 font-mono font-bold text-slate-900">
                      {liveCoordinates.lat.toFixed(4)}°N, {Math.abs(liveCoordinates.lng).toFixed(4)}°W
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">Vehicle Oxygen Fuel</td>
                    <td className="py-2 font-bold text-emerald-700 font-mono">98% Tank Pressure</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 font-bold text-slate-500">Defibrillator / ECG</td>
                    <td className="py-2 font-bold text-emerald-700">Online & Calibrated</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-slate-500">On-Board Paramedic Crew</td>
                    <td className="py-2 text-slate-800">2 ALS Paramedics + 1 EMT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Emergency Patient Clinical Brief */}
          {currentEmergency && currentEmergency.status !== 'completed' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                Dispatched Patient Clinical Brief
              </h3>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500 font-bold">Patient Name</span>
                  <span className="font-extrabold text-slate-900">{currentEmergency.patientName}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500 font-bold">Emergency Category</span>
                  <span className="font-bold text-rose-700 capitalize">{currentEmergency.category}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between">
                  <span className="text-slate-500 font-bold">Incident Coordinates</span>
                  <span className="font-mono text-slate-800">{currentEmergency.lat.toFixed(4)}°N, {Math.abs(currentEmergency.lng).toFixed(4)}°W</span>
                </div>
              </div>

              {/* Required Resources */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5">Required ER Beds & Specialists</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                    {BED_TYPES[currentEmergency.requiredBedType].label}
                  </span>
                  {currentEmergency.requiredSpecialties.map((s) => (
                    <span key={s} className="text-xs font-bold px-2 py-0.5 rounded bg-violet-50 text-violet-800 border border-violet-200">
                      {AVAILABLE_SPECIALTIES[s].label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-center text-xs text-slate-500">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-slate-900">Unit Ready on Standby</p>
              <p className="mt-1">Listening for regional 911/SOS dispatch alerts.</p>
            </div>
          )}
        </div>

        {/* COLUMN 2: Destination Hospital ER & Navigation Controls */}
        <div className="lg:col-span-5 space-y-5">
          {assignedHospital && currentEmergency && currentEmergency.status !== 'completed' ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-violet-700" />
                Target Hospital ER Facility
              </h3>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="text-base font-extrabold text-slate-900">{assignedHospital.name}</h4>
                <p className="text-slate-500">{assignedHospital.address}</p>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Transit ETA</span>
                    <span className="text-sm font-extrabold text-rose-700 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> ~{currentEmergency.etaMinutes} mins
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Distance</span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                      {assignedHospital.distanceKm} km
                    </span>
                  </div>
                </div>

                {displayHold?.status === 'accepted' && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Resuscitation Bay Held & Confirmed by ER
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-center text-xs text-slate-500">
              <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="font-bold text-slate-800">No Target Hospital Assigned</p>
              <p className="mt-1">Destination hospital will display automatically upon emergency dispatch.</p>
            </div>
          )}

          {/* Action Control Bar */}
          {currentEmergency && currentEmergency.status !== 'completed' && (
            <div className="space-y-3">
              {canNavigate && assignedHospital && (
                <button
                  onClick={handleNavigate}
                  className="w-full py-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Navigation className="w-5 h-5" />
                  NAVIGATE TO HOSPITAL (GOOGLE MAPS)
                  <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                </button>
              )}

              {canMarkArrived && (
                <button
                  onClick={handleArrived}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  MARK ARRIVED AT ER BAY
                </button>
              )}

              {canHandOver && (
                <button
                  onClick={handleHandedOver}
                  className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <HandMetal className="w-5 h-5" />
                  PATIENT HANDED OVER TO ER
                </button>
              )}

              {currentEmergency.status === 'handed_over' && (
                <button
                  onClick={() => completeEmergency(currentEmergency.id)}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Complete Emergency Dispatch
                </button>
              )}
            </div>
          )}
        </div>

        {/* COLUMN 3: Incident Telemetry Log */}
        <div className="lg:col-span-3 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Telemetry Incident Timeline
            </h3>
            {currentEmergency ? (
              <EmergencyTimeline events={currentEmergency.timeline} />
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">No active incident logs.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
