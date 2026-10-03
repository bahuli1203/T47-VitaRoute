import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { useAuth } from '../../context/AuthContext';
import { CountdownRing } from '../common/CountdownRing';
import { EmergencyTimeline } from '../common/EmergencyTimeline';
import { soundManager } from '../../utils/audio';
import { BED_TYPES, TRIAGE_LEVELS, HoldRequest, AVAILABLE_SPECIALTIES } from '../../types/bedlink';
import {
  Building2,
  Check,
  X,
  Clock,
  Ambulance,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Flame,
  Bed,
  Stethoscope,
  AlertCircle,
  Activity,
  ArrowLeft,
  Users,
} from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const { logout } = useAuth();
  const {
    currentHospital,
    hospitals,
    setCurrentHospitalId,
    activeHolds,
    acceptHold,
    rejectHold,
    markArrived,
    cancelHold,
    simulateIncomingAmbulance,
    emergencies,
  } = useBedLink();

  const pendingHolds = activeHolds.filter((h) => h.status === 'pending');
  const primaryPendingHold = pendingHolds.find((h) => h.hospitalId === currentHospital.id) || pendingHolds[0];

  const confirmedHolds = activeHolds.filter(
    (h) => h.hospitalId === currentHospital.id && h.status === 'accepted'
  );

  const completedOrPastHolds = activeHolds.filter(
    (h) =>
      h.hospitalId === currentHospital.id &&
      (h.status === 'arrived' || h.status === 'rejected' || h.status === 'expired')
  );

  const [rejectingHoldId, setRejectingHoldId] = useState<string | null>(null);

  const DIVERSION_REASONS = [
    'Attending specialist occupied in emergency surgery',
    'No ventilator capacity on ward',
    'Emergency Department at maximum surge divert',
    'Radiology / CT Scanner offline for maintenance',
  ];

  React.useEffect(() => {
    if (primaryPendingHold && primaryPendingHold.status === 'pending') {
      soundManager.startUrgentAlert();
    } else {
      soundManager.stopUrgentAlert();
    }
    return () => {
      soundManager.stopUrgentAlert();
    };
  }, [primaryPendingHold]);

  const handleConfirmAccept = (hold: HoldRequest) => {
    soundManager.stopUrgentAlert();
    acceptHold(
      hold.id,
      `Resuscitation Bay ${Math.floor(Math.random() * 4) + 1} - ${BED_TYPES[hold.bedType].shortLabel}`
    );
  };

  const handleConfirmReject = (reason: string) => {
    if (!rejectingHoldId) return;
    soundManager.stopUrgentAlert();
    rejectHold(rejectingHoldId, reason);
    setRejectingHoldId(null);
  };

  const bedSummary = {
    icuAvailable: (currentHospital.beds.icu_ventilator?.available || 0) + (currentHospital.beds.icu_non_ventilator?.available || 0),
    traumaAvailable: currentHospital.beds.trauma_resuscitation?.available || 0,
    generalAvailable: currentHospital.beds.oxygen_bed?.available || 0,
    cardiacAvailable: currentHospital.beds.cardiac_monitored?.available || 0,
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
            <Building2 className="w-4 h-4 text-neutral-800" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Hospital ER Command Management</span>
            <span className="text-xs font-mono text-slate-500">Facility #{currentHospital.code}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 border border-neutral-300">
            Radio: {currentHospital.directRadioChannel}
          </span>
          <button
            onClick={simulateIncomingAmbulance}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Simulate Inbound Ambulance
          </button>
        </div>
      </div>

      {/* Hospital ER Station Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={currentHospital.id}
                  onChange={(e) => setCurrentHospitalId(e.target.value)}
                  aria-label="Select Hospital Facility"
                  className="bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-base px-3.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 cursor-pointer"
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
                Ward: <strong className="text-slate-900">{currentHospital.ward}</strong> &middot; Direct ER Hotline: (555) 019-2834
              </p>
            </div>
          </div>
        </div>

        {/* Real-Time ER Capacity Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ICU & Ventilators</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${bedSummary.icuAvailable > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {bedSummary.icuAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Trauma Resuscitation</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${bedSummary.traumaAvailable > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {bedSummary.traumaAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Cardiac Monitored</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${bedSummary.cardiacAvailable > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {bedSummary.cardiacAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Oxygen / General</span>
            <span className={`text-2xl font-black font-mono mt-0.5 block ${bedSummary.generalAvailable > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {bedSummary.generalAvailable} <span className="text-xs font-normal text-slate-400">Available</span>
            </span>
          </div>
        </div>

        {/* On-Duty Specialist Roster */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500 font-bold">Attending Specialists On Duty:</span>
          <div className="flex flex-wrap gap-1.5">
            {currentHospital.specialties.map((s) => (
              <span key={s} className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ {AVAILABLE_SPECIALTIES[s].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main ER Command Grid (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Inbound Emergency Hold Requests */}
        <div className="lg:col-span-6 space-y-5">
          {primaryPendingHold && primaryPendingHold.status === 'pending' ? (
            <div className="bg-white border-2 border-amber-400 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="font-extrabold text-base text-slate-900">
                    Incoming Inbound Emergency Hold Request
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-mono">
                  120s COUNTDOWN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Details */}
                <div className="sm:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-800 border border-slate-200 flex items-center gap-1.5">
                      <Ambulance className="w-3.5 h-3.5 text-slate-600" />
                      {primaryPendingHold.ambulanceCallSign}
                    </span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${TRIAGE_LEVELS[primaryPendingHold.triageAcuity].colorClass}`}>
                      {primaryPendingHold.triageAcuity} Acuity
                    </span>
                    <span className="text-xs font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      ETA ~{primaryPendingHold.etaMinutes}m
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block font-semibold">Requested Bed Type</span>
                    <span className="text-base font-bold text-slate-900 block mt-0.5">
                      {BED_TYPES[primaryPendingHold.bedType].label}
                    </span>
                    <span className="text-xs text-slate-600 mt-1 block font-mono">
                      Current Available: {currentHospital.beds[primaryPendingHold.bedType]?.available ?? 0} beds
                    </span>
                  </div>

                  {/* Patient Vitals */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">BP</span>
                      <span className="font-bold text-slate-900 font-mono">{primaryPendingHold.vitalsSummary.bp}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">HR</span>
                      <span className="font-bold text-rose-700 font-mono">{primaryPendingHold.vitalsSummary.hr} bpm</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">SpO2</span>
                      <span className="font-bold text-rose-700 font-mono">{primaryPendingHold.vitalsSummary.spo2}%</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-bold block">GCS</span>
                      <span className="font-bold text-amber-700 font-mono">{primaryPendingHold.vitalsSummary.gcs}/15</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong>Chief Complaint:</strong> {primaryPendingHold.chiefComplaint}
                  </p>
                </div>

                {/* Countdown */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                    Hold Deadline
                  </span>
                  <CountdownRing
                    expiresAt={primaryPendingHold.expiresAt}
                    totalDurationSeconds={120}
                    size={120}
                    strokeWidth={8}
                  />
                  <p className="text-[11px] text-slate-500 mt-2">
                    Auto-diverts if unacknowledged
                  </p>
                </div>
              </div>

              {/* Accept & Reject Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setRejectingHoldId(primaryPendingHold.id)}
                  className="py-3 px-4 rounded-xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-5 h-5 text-rose-600" />
                  REJECT & DIVERT
                </button>
                <button
                  onClick={() => handleConfirmAccept(primaryPendingHold)}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  ACCEPT & HOLD BAY
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-emerald-700">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Pending Emergency Holds</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                All inbound bed requests are confirmed or no new emergency dispatches currently pending.
              </p>
              <button
                onClick={simulateIncomingAmbulance}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-amber-600" />
                Simulate Inbound Alert
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Confirmed Holds & History Log */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                Confirmed Emergency Bed Holds
              </h3>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {confirmedHolds.length} Reserved
              </span>
            </div>

            {confirmedHolds.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active confirmed bed holds currently.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {confirmedHolds.map((hold) => (
                  <div key={hold.id} className="bg-emerald-50/60 border-2 border-emerald-400 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                        <span className="text-xs font-extrabold text-emerald-800 uppercase flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-700" />
                          BAY HELD
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-700 text-white">
                          RESERVED
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-2.5 text-xs">
                        <div>
                          <span className="text-slate-500">Bed Type:</span>{' '}
                          <strong className="text-slate-900">{BED_TYPES[hold.bedType].label}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Ambulance:</span>{' '}
                          <strong className="text-slate-900 font-mono">{hold.ambulanceCallSign}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500">Inbound ETA:</span>{' '}
                          <strong className="text-emerald-800 font-mono">~{hold.etaMinutes} mins</strong>
                        </div>
                        <div className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-emerald-200 mt-2">
                          <strong>Bay:</strong> {hold.assignedBay} &middot; {hold.chiefComplaint}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-200">
                      <button
                        onClick={() => cancelHold(hold.id)}
                        className="py-2 text-xs text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                      >
                        Release
                      </button>
                      <button
                        onClick={() => markArrived(hold.id)}
                        className="py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        Admit Patient
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit History Log */}
          {completedOrPastHolds.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Emergency Hold Audit Log History
              </h4>
              <div className="space-y-2">
                {completedOrPastHolds.slice(0, 4).map((h) => (
                  <div
                    key={h.id}
                    className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        h.status === 'arrived' ? 'bg-emerald-600'
                        : h.status === 'expired' ? 'bg-amber-500'
                        : 'bg-rose-600'
                      }`} />
                      <span className="font-bold text-slate-900 font-mono">{h.ambulanceCallSign}</span>
                      <span className="text-slate-400">&middot;</span>
                      <span className="text-slate-700">{BED_TYPES[h.bedType].shortLabel}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      h.status === 'arrived' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : h.status === 'expired' ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {h.status === 'arrived' ? 'Admitted to ER'
                       : h.status === 'expired' ? 'Expired (120s)'
                       : `Diverted: ${h.rejectionReason}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Rejection Diversion Modal */}
      {rejectingHoldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-extrabold text-base text-slate-900">Hospital Diversion Reason</h3>
              </div>
              <button
                onClick={() => setRejectingHoldId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the clinical diversion reason. VitaRoute dispatch AI will automatically route the ambulance to the next available emergency facility.
            </p>

            <div className="space-y-2">
              {DIVERSION_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleConfirmReject(reason)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-left text-xs font-bold text-slate-800 hover:text-rose-900 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{reason}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-right">
              <button
                onClick={() => setRejectingHoldId(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
