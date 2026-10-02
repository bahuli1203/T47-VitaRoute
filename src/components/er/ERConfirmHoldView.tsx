import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { CountdownRing } from '../common/CountdownRing';
import { soundManager } from '../../utils/audio';
import { BED_TYPES, TRIAGE_LEVELS, HoldRequest } from '../../types/bedlink';
import {
  Building,
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
} from 'lucide-react';

export const ERConfirmHoldView: React.FC = () => {
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
  } = useBedLink();

  // Find incoming pending hold
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

  // Rejection modal
  const [rejectingHoldId, setRejectingHoldId] = useState<string | null>(null);

  const DIVERSION_REASONS = [
    'Attending specialist occupied in emergency surgery',
    'No ventilator capacity on ward',
    'Emergency Department at maximum surge divert',
    'Radiology / CT Scanner offline for maintenance',
  ];

  // Sound alert management for incoming pending request
  useEffect(() => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Top Receiving Station Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <select
                value={currentHospital.id}
                onChange={(e) => setCurrentHospitalId(e.target.value)}
                aria-label="Select Hospital ER Receiving Station"
                className="bg-white border border-slate-300 rounded-md font-bold text-slate-900 text-sm sm:text-base px-3 py-1 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-sky-600 cursor-pointer"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.code})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Receiving ER Desk &middot; Trauma Bay Coordination &middot; Radio: {currentHospital.directRadioChannel}
            </p>
          </div>
        </div>

        <button
          onClick={simulateIncomingAmbulance}
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Simulate Incoming Request</span>
        </button>
      </div>

      {/* 2-MINUTE CONFIRMATION: INCOMING AMBULANCE BED REQUEST CARD */}
      {primaryPendingHold && primaryPendingHold.status === 'pending' ? (
        <div className="bg-white border-2 border-amber-300 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-subtle-pulse"></span>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Bed request sent to {primaryPendingHold.hospitalName}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              120s Confirmation Window
            </span>
          </div>

          {/* Details & Timer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Patient & Request Details */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-800 border border-slate-200 flex items-center gap-1.5">
                  <Ambulance className="w-3.5 h-3.5 text-slate-600" />
                  {primaryPendingHold.ambulanceCallSign}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                    TRIAGE_LEVELS[primaryPendingHold.triageAcuity].colorClass
                  }`}
                >
                  {primaryPendingHold.triageAcuity} Acuity &middot; Immediate
                </span>

                <span className="text-xs font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  ETA ~{primaryPendingHold.etaMinutes} mins ({primaryPendingHold.distanceKm} km)
                </span>
              </div>

              {/* Bed Type Display (Exact Prompt Requirement) */}
              <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                <span className="text-xs text-slate-500 block font-medium">Requested Bed:</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  {BED_TYPES[primaryPendingHold.bedType].label}: 1 bed
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  Current Available in Hospital: {currentHospital.beds[primaryPendingHold.bedType]?.available ?? 0} beds
                </span>
              </div>

              {/* Vitals Summary */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                  <span className="font-bold text-slate-900 font-mono">{primaryPendingHold.vitalsSummary.bp}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Heart Rate</span>
                  <span className="font-bold text-red-700 font-mono">{primaryPendingHold.vitalsSummary.hr} bpm</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">SpO2</span>
                  <span className="font-bold text-red-700 font-mono">{primaryPendingHold.vitalsSummary.spo2}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">GCS</span>
                  <span className="font-bold text-amber-700 font-mono">{primaryPendingHold.vitalsSummary.gcs}/15</span>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                <strong>Chief Complaint:</strong> {primaryPendingHold.chiefComplaint}
              </p>
            </div>

            {/* Countdown Timer */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-md border border-slate-200 text-center">
              <span className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Hold Deadline
              </span>
              <CountdownRing
                expiresAt={primaryPendingHold.expiresAt}
                totalDurationSeconds={120}
                size={130}
                strokeWidth={9}
              />
              <p className="text-[11px] text-slate-500 mt-2 max-w-[200px]">
                If not confirmed within 120s, VitaRoute will automatically contact the next available hospital.
              </p>
            </div>
          </div>

          {/* Action Buttons: Accept & Reject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setRejectingHoldId(primaryPendingHold.id)}
              className="py-2.5 px-4 rounded-md border border-red-300 bg-red-50 hover:bg-red-100 text-red-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4 text-red-600" />
              <span>Reject (Trigger Hospital Diversion)</span>
            </button>

            <button
              type="button"
              onClick={() => handleConfirmAccept(primaryPendingHold)}
              className="py-2.5 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Accept Bed Request (Confirm &amp; Lock)</span>
            </button>
          </div>
        </div>
      ) : (
        /* Empty Pending State */
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center shadow-xs">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-500">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            No Incoming Unconfirmed Requests at {currentHospital.name}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-3">
            All inbound emergency beds are confirmed or active. Click below to simulate an incoming ambulance reservation.
          </p>
          <button
            onClick={simulateIncomingAmbulance}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors inline-flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulate Incoming Ambulance (120s Hold)</span>
          </button>
        </div>
      )}

      {/* BED HOLD SECTION: WHEN A HOSPITAL ACCEPTS */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>Confirmed Bed Holds &middot; Inbound Ambulance Queue</span>
            </h3>
            <p className="text-xs text-slate-500">
              Emergency beds officially locked for arriving ambulances.
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            {confirmedHolds.length} Active Holds
          </span>
        </div>

        {confirmedHolds.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No confirmed bed holds currently en route to this hospital.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-4">
            {confirmedHolds.map((hold) => (
              /* Visually Obvious Bed Hold Card (Exact Prompt Specification) */
              <div
                key={hold.id}
                className="bg-emerald-50/50 border-2 border-emerald-500 rounded-lg p-4 flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="text-xs font-black tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      BED HELD
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600 text-white font-mono">
                      RESERVED
                    </span>
                  </div>

                  {/* Required Information: Hospital Name, Bed Type, Ambulance ID, Hold Time Remaining */}
                  <div className="space-y-1.5 pt-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Hospital Name:</span>{' '}
                      <strong className="text-slate-900 font-bold">{hold.hospitalName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Bed Type:</span>{' '}
                      <strong className="text-slate-900 font-bold">{BED_TYPES[hold.bedType].label}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Ambulance ID:</span>{' '}
                      <strong className="text-slate-900 font-mono">{hold.ambulanceCallSign}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Hold Time Remaining / ETA:</span>{' '}
                      <strong className="text-emerald-800 font-mono font-bold">~{hold.etaMinutes} mins ({hold.distanceKm} km)</strong>
                    </div>
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-emerald-200 mt-2">
                      <strong>Assigned Space:</strong> {hold.assignedBay || 'Resuscitation Bay 1'} &middot; Patient: {hold.chiefComplaint}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-200">
                  <button
                    onClick={() => cancelHold(hold.id)}
                    className="py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded font-medium transition-colors"
                  >
                    Release Hold
                  </button>
                  <button
                    onClick={() => markArrived(hold.id)}
                    className="py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Patient Arrived &amp; Admitted</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Hold History / Audit Trail */}
      {completedOrPastHolds.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Hold History &middot; Audit Log
          </h4>
          <div className="flex flex-col gap-2">
            {completedOrPastHolds.slice(0, 4).map((h) => (
              <div
                key={h.id}
                className="bg-slate-50 border border-slate-200 rounded p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      h.status === 'arrived'
                        ? 'bg-emerald-600'
                        : h.status === 'expired'
                        ? 'bg-amber-500'
                        : 'bg-red-600'
                    }`}
                  ></span>
                  <span className="font-bold text-slate-900 font-mono">{h.ambulanceCallSign}</span>
                  <span className="text-slate-400">&middot;</span>
                  <span className="text-slate-700">{BED_TYPES[h.bedType].shortLabel}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      h.status === 'arrived'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : h.status === 'expired'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {h.status === 'arrived'
                      ? 'Patient Admitted'
                      : h.status === 'expired'
                      ? 'Hold Expired (120s Timeout)'
                      : `Rejected: ${h.rejectionReason}`}
                  </span>
                  {h.escalatedToHospitalId && (
                    <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      Contacted #{h.escalatedToHospitalId.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL */}
      {rejectingHoldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-lg p-5 max-w-md w-full shadow-lg flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="font-bold text-sm text-slate-900">
                  Select Reason for Hold Rejection
                </h3>
              </div>
              <button
                onClick={() => setRejectingHoldId(null)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600">
              When rejected, VitaRoute will notify dispatch:
              <br />
              <em className="text-slate-800 font-semibold">&ldquo;Hospital did not confirm. Contacting next available hospital...&rdquo;</em>
            </p>

            <div className="flex flex-col gap-2">
              {DIVERSION_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => handleConfirmReject(reason)}
                  className="p-2.5 rounded border border-slate-200 bg-slate-50 hover:bg-red-50 hover:border-red-200 text-left text-xs font-semibold text-slate-800 hover:text-red-900 transition-colors flex items-center justify-between"
                >
                  <span>{reason}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setRejectingHoldId(null)}
                className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
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
