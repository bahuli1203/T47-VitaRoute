import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { CountdownRing } from '../common/CountdownRing';
import {
  Building2,
  CheckCircle2,
  Ambulance,
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

  const txt = {
    deptTitle: language === 'hi' ? 'आपातकालीन विभाग' : language === 'mr' ? 'आणीबाणी विभाग' : 'Emergency Department',
    erOpen: language === 'hi' ? 'ईआर चालू' : language === 'mr' ? 'ईआर सुरू' : 'ER OPEN',
    levelLabel: language === 'hi' ? 'स्तर' : language === 'mr' ? 'पातळी' : 'Level',
    radioLabel: language === 'hi' ? 'रेडियो' : language === 'mr' ? 'रेडिओ' : 'Radio',
    openIcuBeds: language === 'hi' ? 'खुले आईसीयू बेड' : language === 'mr' ? 'उपलब्ध आयसीयू बेड्स' : 'Open ICU Beds',
    availableText: language === 'hi' ? 'उपलब्ध' : language === 'mr' ? 'उपलब्ध' : 'Available',
    incomingBanner: language === 'hi' ? 'आने वाली एम्बुलेंस का अनुरोध (120 सेकंड विंडो)' : language === 'mr' ? 'येणाऱ्या रुग्णवाहिकेची विनंती (१२० सेकंद विंडो)' : 'Incoming Ambulance Request (120-Second Window)',
    timeToDecide: language === 'hi' ? 'निर्णय का समय' : language === 'mr' ? 'निर्णयाची वेळ' : 'Time to Decide',
    autoRerouteNote: language === 'hi' ? 'समय समाप्ति पर स्वतः पुनर्निर्देशन' : language === 'mr' ? 'वेळ संपल्यास आपोआप पुढच्या रुग्णालयाकडे' : 'Auto-reroutes on timeout',
    patientIncident: language === 'hi' ? 'मरीज की स्थिति एवं लक्षण' : language === 'mr' ? 'रुग्णाची स्थिती आणि लक्षणे' : 'Patient Incident & Complaint',
    acuityLabel: language === 'hi' ? 'तीव्रता' : language === 'mr' ? 'तीव्रता' : 'Acuity',
    acuityRed: language === 'hi' ? 'तात्कालिक रेड' : language === 'mr' ? 'तात्काळ रेड' : 'Immediate Red',
    etaLabel: language === 'hi' ? 'अनुमानित समय' : language === 'mr' ? 'अंदाजित वेळ' : 'ETA',
    minsText: language === 'hi' ? 'मिनट' : language === 'mr' ? 'मिनिटे' : 'mins',
    liveVitals: language === 'hi' ? 'रास्ते में लाइव वाइटल्स' : language === 'mr' ? 'थेट प्रवासातील वाइटल्स' : 'Live In-Transit Vitals',
    btnAccept: language === 'hi' ? 'बेड होल्ड स्वीकारें एवं एम्बुलेंस हेतु आरक्षित करें' : language === 'mr' ? 'बेड होल्ड स्वीकारा आणि रुग्णवाहिकेसाठी आरक्षित करा' : 'Accept Bed Hold & Hold for Ambulance',
    btnDivert: language === 'hi' ? 'डायवर्ट / अस्वीकृत' : language === 'mr' ? 'डायव्हर्ट / नकार' : 'Divert / Reject',
    selectDiversionReason: language === 'hi' ? 'डायवर्जन का कारण चुनें (एम्बुलेंस स्वतः अगले ईआर को जाएगी):' : language === 'mr' ? 'डायव्हर्शनचे कारण निवडा (रुग्णवाहिका आपोआप पुढच्या रुग्णालयाकडे जाईल):' : 'Select Diversion Reason (Ambulance will auto-reroute to next ER):',
    activeReservations: language === 'hi' ? 'आने वाली एम्बुलेंस के लिए सक्रिय बेड आरक्षण' : language === 'mr' ? 'येणाऱ्या रुग्णवाहिकांसाठी सक्रिय बेड आरक्षण' : 'Active Bed Reservations for Incoming Units',
    incomingCount: language === 'hi' ? '1 एम्बुलेंस रास्ते में' : language === 'mr' ? '१ रुग्णवाहिका मार्गावर' : '1 Unit Incoming',
    zeroPending: language === 'hi' ? '0 लंबित अनुरोध' : language === 'mr' ? '० प्रलंबित विनंत्या' : '0 Pending Requests',
    bedHeldBay: (bay: string) => language === 'hi' ? `बेड आरक्षित: ${bay}` : language === 'mr' ? `बेड आरक्षित: ${bay}` : `Bed Held: ${bay}`,
    btnTrackLiveMap: language === 'hi' ? 'लाइव मैप पर ट्रैक करें' : language === 'mr' ? 'थेट नकाशावर ट्रॅक करा' : 'Track on Live Map',
    noAmbulancesNotice: language === 'hi' ? 'वर्तमान में कोई एम्बुलेंस रास्ते में नहीं है। अनुरोध आने पर अलार्म बजेगा।' : language === 'mr' ? 'सध्या कोणतीही रुग्णवाहिका मार्गावर नाही. विनंती आल्यास अलार्म वाजेल.' : 'No ambulances currently en route. The desk will sound an urgent tone when a request arrives.',
  };

  const diversionReasons = [
    language === 'hi' ? 'आपातकालीन विभाग अधिकतम सर्ज डायवर्जन पर है' : language === 'mr' ? 'आणीबाणी विभाग कमाल क्षमतेमुळे डायव्हर्शनवर आहे' : 'Emergency Department at maximum surge capacity',
    language === 'hi' ? 'सर्जन/विशेषज्ञ आपातकालीन सर्जरी में व्यस्त हैं' : language === 'mr' ? 'तज्ज्ञ डॉक्टर आपत्कालीन शस्त्रक्रियेमध्ये व्यस्त आहेत' : 'Attending specialist currently occupied in surgery',
    language === 'hi' ? 'रेडियोलॉजी / सीटी स्कैनर रखरखाव हेतु बंद है' : language === 'mr' ? 'रेडिओलॉजी / सीटी स्कॅनर देखभालीसाठी बंद आहे' : 'CT scanner / Cath lab temporarily offline for maintenance',
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
                {currentHospital.name} &middot; {txt.deptTitle}
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {txt.erOpen}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {txt.levelLabel}: {currentHospital.designation} &middot; {txt.radioLabel}: {currentHospital.directRadioChannel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-center">
            <span className="text-[10px] font-bold text-neutral-400 block uppercase">{txt.openIcuBeds}</span>
            <span className="text-base font-black font-mono text-emerald-700">
              {currentHospital.beds.icu_ventilator.available} {txt.availableText}
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
                  {txt.incomingBanner}
                </span>
                <h3 className="text-base font-black text-neutral-950">
                  {pendingHold.ambulanceCallSign}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3.5 self-start sm:self-auto">
              <CountdownRing
                expiresAt={pendingHold.expiresAt}
                size={62}
                strokeWidth={5}
                language={language}
              />
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                  {txt.timeToDecide}
                </span>
                <span className="text-xs font-bold text-red-600">
                  {txt.autoRerouteNote}
                </span>
              </div>
            </div>
          </div>

          {/* Patient Details & Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.patientIncident}
              </span>
              <p className="text-sm font-bold text-neutral-900 leading-snug">
                {pendingHold.chiefComplaint || 'Acute Respiratory Distress / Severe Hypoxemia'}
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-neutral-600 text-[11px]">
                <span>{txt.acuityLabel}: <strong className="text-red-700">{txt.acuityRed}</strong></span>
                <span>&middot;</span>
                <span>{txt.etaLabel}: <strong className="text-neutral-900">{pendingHold.etaMinutes} {txt.minsText} ({pendingHold.distanceKm} km)</strong></span>
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.liveVitals}
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
              <span>{txt.btnAccept}</span>
            </button>

            <button
              type="button"
              onClick={() => setRejectingHoldId(pendingHold.id)}
              className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-sm cursor-pointer"
            >
              {txt.btnDivert}
            </button>
          </div>

          {/* Divert Reasons Modal Dropdown */}
          {rejectingHoldId === pendingHold.id && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs">
              <span className="font-bold text-red-900 block">
                {txt.selectDiversionReason}
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
              <span>{txt.activeReservations}</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {acceptedHold ? txt.incomingCount : txt.zeroPending}
            </span>
          </div>

          {acceptedHold ? (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-neutral-900">{acceptedHold.ambulanceCallSign}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {txt.bedHeldBay(acceptedHold.assignedBay || 'Resuscitation Bay 1')}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 mt-1">
                  {txt.patientIncident}: {acceptedHold.chiefComplaint} &middot; {txt.etaLabel}: {acceptedHold.etaMinutes} {txt.minsText}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRole('tracking')}
                className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>{txt.btnTrackLiveMap}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-500 text-xs">
              <Building2 className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
              <span>{txt.noAmbulancesNotice}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
