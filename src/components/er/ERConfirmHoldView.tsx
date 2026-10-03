import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { CountdownRing } from '../common/CountdownRing';
import {
  Building2,
  Check,
  X,
  Clock,
  Ambulance,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

export const ERConfirmHoldView: React.FC = () => {
  const {
    currentHospital,
    activeHolds,
    acceptHold,
    rejectHold,
    setRole,
    language,
    t,
  } = useBedLink();

  const [rejectingHoldId, setRejectingHoldId] = useState<string | null>(null);

  // Incoming pending hold for this hospital or global fallback
  const pendingHold = activeHolds.find((h) => h.status === 'pending' && h.hospitalId === currentHospital.id) || activeHolds.find((h) => h.status === 'pending');
  const acceptedHold = activeHolds.find((h) => h.status === 'accepted' && h.hospitalId === currentHospital.id) || activeHolds.find((h) => h.status === 'accepted');

  const diversionReasons = [
    'Emergency Department at maximum surge capacity',
    'Attending specialist currently occupied in surgery',
    'CT scanner / Cath lab temporarily offline for maintenance',
  ];

  const handleAccept = (holdId: string) => {
    acceptHold(holdId, 'Resuscitation Bay 1');
  };

  const handleReject = (holdId: string, reason: string) => {
    rejectHold(holdId, reason);
    setRejectingHoldId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Hospital ER Desk Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-neutral-950">
                {currentHospital.name} &middot; Emergency Department
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                ER OPEN
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Level: {currentHospital.designation} &middot; Radio: {currentHospital.directRadioChannel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-center">
            <span className="text-[10px] font-bold text-neutral-400 block uppercase">Open ICU Beds</span>
            <span className="text-base font-black font-mono text-emerald-700">
              {currentHospital.beds.icu_ventilator.available} Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Incoming Hold Card (If pending request exists) */}
      {pendingHold ? (
        <div className="bg-white border-2 border-red-300 rounded-3xl p-6 sm:p-7 shadow-lg shadow-red-500/5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                  Incoming Ambulance Request (120-Second Window)
                </span>
                <h3 className="text-base font-black text-neutral-950">
                  {pendingHold.ambulanceCallSign}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <CountdownRing expiresAt={pendingHold.expiresAt} size={54} strokeWidth={4.5} />
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Time to Decide
                </span>
                <span className="text-xs font-bold text-red-600">
                  Auto-reroutes on timeout
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details & Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Patient Incident & Complaint
              </span>
              <p className="text-sm font-bold text-neutral-900 leading-snug">
                {pendingHold.chiefComplaint || 'Acute Respiratory Distress / Severe Hypoxemia'}
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-neutral-600 text-[11px]">
                <span>Acuity: <strong className="text-red-700">Immediate Red</strong></span>
                <span>&middot;</span>
                <span>ETA: <strong className="text-neutral-900">{pendingHold.etaMinutes} mins ({pendingHold.distanceKm} km)</strong></span>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Live In-Transit Vitals
              </span>
              <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                <div className="bg-white p-2 rounded-xl border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 block">BP</span>
                  <span className="font-bold text-neutral-900">{pendingHold.vitalsSummary?.bp || '88/54'}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 block">HR</span>
                  <span className="font-bold text-red-600">{pendingHold.vitalsSummary?.hr || 128}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 block">SpO2</span>
                  <span className="font-bold text-red-600">{pendingHold.vitalsSummary?.spo2 || 84}%</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-neutral-200">
                  <span className="text-[9px] text-neutral-400 block">GCS</span>
                  <span className="font-bold text-neutral-900">{pendingHold.vitalsSummary?.gcs || 9}/15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Accept vs Divert */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleAccept(pendingHold.id)}
              className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-98 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Accept Bed Hold & Hold for Ambulance</span>
            </button>

            <button
              type="button"
              onClick={() => setRejectingHoldId(pendingHold.id)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-sm cursor-pointer"
            >
              Divert / Reject
            </button>
          </div>

          {/* Divert Reasons Modal Dropdown */}
          {rejectingHoldId === pendingHold.id && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs">
              <span className="font-bold text-red-900 block">
                Select Diversion Reason (Ambulance will auto-reroute to next ER):
              </span>
              <div className="space-y-1.5">
                {diversionReasons.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handleReject(pendingHold.id, reason)}
                    className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-red-100/50 border border-red-200 text-neutral-800 font-medium transition-colors cursor-pointer"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Currently Active or Held Beds Card */
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active Bed Reservations for Incoming Units</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {acceptedHold ? '1 Unit Incoming' : '0 Pending Requests'}
            </span>
          </div>

          {acceptedHold ? (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-neutral-900">{acceptedHold.ambulanceCallSign}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    Bed Held: {acceptedHold.assignedBay || 'Resuscitation Bay 1'}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  Patient: {acceptedHold.chiefComplaint} &middot; ETA: {acceptedHold.etaMinutes} mins
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRole('tracking')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Track on Live Map</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              <Building2 className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
              <span>No ambulances currently en route. The desk will sound an urgent tone when a request arrives.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
