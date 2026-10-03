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
  User,
  Phone,
  MapPin,
  ChevronDown,
} from 'lucide-react';

export const ERConfirmHoldView: React.FC = () => {
  const {
    hospitals,
    currentHospital,
    activeHolds,
    acceptHold,
    rejectHold,
    markArrived,
    setRole,
    language,
    t,
  } = useBedLink();

  const [rejectingHoldId, setRejectingHoldId] = useState<string | null>(null);
  // Hospital desk selector: 'all' shows all holds; a hospital id filters to that hospital
  const [deskHospitalId, setDeskHospitalId] = useState<string>(currentHospital.id);

  // Filter holds by selected hospital desk (or show all)
  const selectedDeskHospital = hospitals.find((h) => h.id === deskHospitalId) || currentHospital;
  const filteredActiveHolds = deskHospitalId === 'all'
    ? activeHolds
    : activeHolds.filter((h) => h.hospitalId === deskHospitalId);

  const pendingHolds = filteredActiveHolds.filter((h) => h.status === 'pending');
  const acceptedHolds = filteredActiveHolds.filter((h) => h.status === 'accepted');

  // Network-wide counts for awareness
  const allPendingCount = activeHolds.filter((h) => h.status === 'pending').length;

  const txt = {
    deptTitle: language === 'hi' ? 'आपातकालीन विभाग' : language === 'mr' ? 'आणीबाणी विभाग' : 'Emergency Department',
    erOpen: language === 'hi' ? 'ईआर चालू' : language === 'mr' ? 'ईआर सुरू' : 'ER OPEN',
    levelLabel: language === 'hi' ? 'स्तर' : language === 'mr' ? 'पातळी' : 'Level',
    radioLabel: language === 'hi' ? 'रेडियो' : language === 'mr' ? 'रेडिओ' : 'Radio',
    openIcuBeds: language === 'hi' ? 'खुले आईसीयू बेड' : language === 'mr' ? 'उपलब्ध आयसीयू बेड्स' : 'Open ICU Beds',
    availableText: language === 'hi' ? 'उपलब्ध' : language === 'mr' ? 'उपलब्ध' : 'Available',
    incomingBanner: language === 'hi' ? 'आने वाली एम्बुलेंस — 120 सेकंड होल्ड विंडो' : language === 'mr' ? 'येणारी रुग्णवाहिका — १२० सेकंद होल्ड विंडो' : 'Incoming Ambulance — 120s Hold Window',
    timeToDecide: language === 'hi' ? 'निर्णय का समय' : language === 'mr' ? 'निर्णयाची वेळ' : 'Time to Decide',
    autoRerouteNote: language === 'hi' ? 'समय समाप्ति पर स्वतः पुनर्निर्देशन' : language === 'mr' ? 'वेळ संपल्यास आपोआप पुढे' : 'Auto-reroutes on timeout',
    patientIncident: language === 'hi' ? 'मरीज की जानकारी एवं मुख्य लक्षण' : language === 'mr' ? 'रुग्णाची माहिती आणि मुख्य लक्षणे' : 'Patient Info & Chief Complaint',
    acuityLabel: language === 'hi' ? 'तीव्रता' : language === 'mr' ? 'तीव्रता' : 'Acuity',
    acuityRed: language === 'hi' ? 'तात्कालिक रेड' : language === 'mr' ? 'तात्काळ रेड' : 'Immediate Red',
    etaLabel: language === 'hi' ? 'अनुमानित समय' : language === 'mr' ? 'अंदाजित वेळ' : 'ETA',
    minsText: language === 'hi' ? 'मिनट' : language === 'mr' ? 'मिनिटे' : 'mins',
    liveVitals: language === 'hi' ? 'रास्ते में लाइव वाइटल्स' : language === 'mr' ? 'थेट प्रवासातील वाइटल्स' : 'Live In-Transit Vitals',
    btnAccept: language === 'hi' ? 'बेड होल्ड स्वीकारें' : language === 'mr' ? 'बेड होल्ड स्वीकारा' : 'Accept Bed Hold',
    btnDivert: language === 'hi' ? 'डायवर्ट / अस्वीकृत' : language === 'mr' ? 'डायव्हर्ट / नकार' : 'Divert / Reject',
    selectDiversionReason: language === 'hi' ? 'डायवर्जन का कारण चुनें:' : language === 'mr' ? 'डायव्हर्शनचे कारण निवडा:' : 'Select Diversion Reason:',
    activeReservations: language === 'hi' ? 'स्वीकृत बेड आरक्षण' : language === 'mr' ? 'स्वीकृत बेड आरक्षण' : 'Active Bed Reservations',
    incomingCount: (count: number) => language === 'hi' ? `${count} एम्बुलेंस रास्ते में` : language === 'mr' ? `${count} रुग्णवाहिका मार्गावर` : `${count} Unit(s) Incoming`,
    zeroPending: language === 'hi' ? '0 लंबित अनुरोध' : language === 'mr' ? '० प्रलंबित विनंत्या' : '0 Pending',
    bedHeldBay: (bay: string) => language === 'hi' ? `बेड आरक्षित: ${bay}` : language === 'mr' ? `बेड आरक्षित: ${bay}` : `Bay: ${bay}`,
    btnTrackLiveMap: language === 'hi' ? 'लाइव मैप' : language === 'mr' ? 'थेट नकाशा' : 'Track Live Map',
    noAmbulancesNotice: language === 'hi' ? 'इस अस्पताल के लिए कोई लंबित अनुरोध नहीं। नागरिक एसओएस भेजने पर तुरंत यहाँ कार्ड दिखेगा।' : language === 'mr' ? 'या रुग्णालयासाठी सध्या कोणती प्रलंबित विनंती नाही.' : 'No pending holds for this hospital desk. Requests appear instantly when a citizen triggers SOS.',
    deskLabel: language === 'hi' ? 'अस्पताल डेस्क:' : language === 'mr' ? 'रुग्णालय डेस्क:' : 'Hospital Desk:',
    allNetwork: language === 'hi' ? 'संपूर्ण मुंबई नेटवर्क' : language === 'mr' ? 'संपूर्ण मुंबई नेटवर्क' : 'All Mumbai Network',
    targetHospitalLabel: language === 'hi' ? 'लक्षित ईआर' : language === 'mr' ? 'लक्ष्य ईआर' : 'Target ER',
    distanceLabel: language === 'hi' ? 'दूरी' : language === 'mr' ? 'अंतर' : 'Distance',
    markArrived: language === 'hi' ? 'आगमन चिह्नित करें' : language === 'mr' ? 'आगमन नोंदवा' : 'Mark Arrived',
  };

  const diversionReasons = [
    language === 'hi' ? 'आपातकालीन विभाग अधिकतम सर्ज पर — डायवर्जन' : language === 'mr' ? 'आणीबाणी विभाग कमाल क्षमतेमुळे डायव्हर्शन' : 'Emergency Department at maximum surge capacity',
    language === 'hi' ? 'सर्जन आपातकालीन सर्जरी में व्यस्त' : language === 'mr' ? 'तज्ज्ञ डॉक्टर आपत्कालीन शस्त्रक्रियेत व्यस्त' : 'Attending specialist in emergency surgery',
    language === 'hi' ? 'सीटी स्कैनर / कैथ लैब अस्थायी रूप से बंद' : language === 'mr' ? 'सीटी स्कॅनर / कॅथ लॅब तात्पुरते बंद' : 'CT scanner / Cath lab temporarily offline',
  ];

  const handleAccept = (holdId: string) => {
    acceptHold(holdId, 'Resuscitation Bay 1 - ICU');
  };

  const handleReject = (holdId: string, reason: string) => {
    rejectHold(holdId, reason);
    setRejectingHoldId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 py-2">
      {/* Hospital ER Desk Header + Desk Switcher */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-extrabold text-neutral-950">
                  {selectedDeskHospital.name} &middot; {txt.deptTitle}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {txt.erOpen}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {selectedDeskHospital.address}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs shrink-0">
            <div className="bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200 text-center">
              <span className="text-[10px] font-bold text-neutral-400 block uppercase">{txt.openIcuBeds}</span>
              <span className="text-base font-black font-mono text-emerald-700">
                {selectedDeskHospital.beds.icu_ventilator.available} {txt.availableText}
              </span>
            </div>
          </div>
        </div>

        {/* Hospital Desk Switcher */}
        <div className="pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-neutral-500 shrink-0">{txt.deskLabel}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setDeskHospitalId('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                  deskHospitalId === 'all'
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                {txt.allNetwork}
                {allPendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                    {allPendingCount}
                  </span>
                )}
              </button>
              {hospitals.map((h) => {
                const hPendingCount = activeHolds.filter((hold) => hold.hospitalId === h.id && hold.status === 'pending').length;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setDeskHospitalId(h.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      deskHospitalId === h.id
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    {h.code}
                    {hPendingCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black">
                        {hPendingCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC LIST OF INCOMING PENDING HOLDS */}
      {pendingHolds.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {pendingHolds.length} {language === 'hi' ? 'सक्रिय आपातकालीन अनुरोध' : language === 'mr' ? 'सक्रिय आणीबाणी विनंत्या' : 'Active Emergency Requests'}
            </span>
            <span className="text-xs text-neutral-500 font-mono">
              {language === 'hi' ? 'व्यक्तिगत 120s उल्टी गिनती' : language === 'mr' ? 'वैयक्तिक १२० सेकंद टाइमर' : 'Individual 120s countdown per request'}
            </span>
          </div>

          {pendingHolds.map((hold) => (
            <div
              key={hold.id}
              className="bg-white border-2 border-red-300 rounded-3xl p-6 sm:p-7 shadow-lg shadow-red-500/5 space-y-5"
            >
              {/* Unit header + Target Hospital badge + Countdown */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shrink-0 animate-pulse">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                        {txt.incomingBanner}
                      </span>
                      {hold.ambulancePlate && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {hold.ambulancePlate}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-black text-neutral-950 mt-0.5">
                      {hold.ambulanceCallSign}
                    </h3>
                    <p className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                      {hold.driverName && <span>{hold.driverName}</span>}
                      {hold.driverName && hold.driverPhone && <span>&middot;</span>}
                      {hold.driverPhone && (
                        <a
                          href={`tel:${hold.driverPhone.replace(/[^0-9+]/g, '')}`}
                          className="text-red-600 font-semibold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {hold.driverPhone}
                        </a>
                      )}
                    </p>
                    {/* Target hospital badge */}
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {txt.targetHospitalLabel}: {hold.hospitalName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                        {txt.distanceLabel}: {hold.distanceKm} km · {hold.etaMinutes} {txt.minsText}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prominent ticking countdown timer */}
                <div className="flex flex-col items-center gap-1.5 self-start shrink-0">
                  <CountdownRing
                    expiresAt={hold.expiresAt}
                    size={80}
                    strokeWidth={7}
                    language={language}
                    showLabel={true}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 text-center">
                    {txt.timeToDecide}
                  </span>
                  <span className="text-[9px] font-bold text-red-600 text-center">
                    {txt.autoRerouteNote}
                  </span>
                </div>
              </div>

              {/* Patient Details & Live Vitals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Patient Information */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {txt.patientIncident}
                  </span>
                  <div>
                    <span className="text-sm font-black text-neutral-950 block">
                      {hold.patientName || (language === 'hi' ? 'आपातकालीन मरीज' : language === 'mr' ? 'आणीबाणी रुग्ण' : 'Emergency Patient')} ({hold.patientAgeGender || '?'})
                    </span>
                    {hold.patientPhone && (
                      <div className="flex items-center gap-2 text-neutral-600 mt-1">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        <a href={`tel:${hold.patientPhone.replace(/[^0-9+]/g, '')}`} className="font-mono text-[11px] text-neutral-800 hover:underline">
                          {hold.patientPhone}
                        </a>
                      </div>
                    )}
                    {hold.patientAddress && (
                      <div className="flex items-center gap-2 text-neutral-600 mt-0.5">
                        <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="text-[11px] text-neutral-700">{hold.patientAddress}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-bold text-red-900 bg-red-50/70 p-2 rounded-lg border border-red-100 leading-snug">
                    {hold.chiefComplaint || 'Acute Emergency — Immediate Admission Required'}
                  </p>

                  <div className="flex items-center gap-2 pt-1 font-mono text-neutral-600 text-[11px]">
                    <span>{txt.acuityLabel}: <strong className="text-red-700">{txt.acuityRed}</strong></span>
                    <span>&middot;</span>
                    <span>{txt.etaLabel}: <strong className="text-neutral-900">{hold.etaMinutes} {txt.minsText} ({hold.distanceKm} km)</strong></span>
                  </div>
                </div>

                {/* Vitals Summary */}
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                    {txt.liveVitals}
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                    <div className="bg-white p-2 rounded-xl border border-neutral-200">
                      <span className="text-[9px] text-neutral-400 block">BP</span>
                      <span className="font-bold text-neutral-900">{hold.vitalsSummary?.bp || '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-neutral-200">
                      <span className="text-[9px] text-neutral-400 block">HR</span>
                      <span className="font-bold text-red-600">{hold.vitalsSummary?.hr ?? '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-neutral-200">
                      <span className="text-[9px] text-neutral-400 block">SpO2</span>
                      <span className="font-bold text-red-600">{hold.vitalsSummary?.spo2 != null ? `${hold.vitalsSummary.spo2}%` : '—'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-neutral-200">
                      <span className="text-[9px] text-neutral-400 block">GCS</span>
                      <span className="font-bold text-neutral-900">{hold.vitalsSummary?.gcs != null ? `${hold.vitalsSummary.gcs}/15` : '—'}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-neutral-200 space-y-1 mt-2 text-[11px]">
                    <div className="flex justify-between text-neutral-600">
                      <span>{language === 'hi' ? 'अनुरोधित बेड:' : language === 'mr' ? 'मागणी केलेले बेड:' : 'Bed Requested:'}</span>
                      <span className="font-bold text-neutral-900 uppercase font-mono">{hold.bedType.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>{language === 'hi' ? 'निर्धारित बे:' : language === 'mr' ? 'नेमून दिलेले बे:' : 'Designated Bay:'}</span>
                      <span className="font-bold text-emerald-700">{hold.assignedBay || (language === 'hi' ? 'आवंटन हो रहा है' : language === 'mr' ? 'नेमणे सुरू आहे' : 'Allocating...')}</span>
                    </div>
                    {hold.hospitalPhone && (
                      <div className="flex justify-between items-center text-neutral-600">
                        <span>{language === 'hi' ? 'अस्पताल फोन:' : language === 'mr' ? 'रुग्णालय फोन:' : 'Hospital Phone:'}</span>
                        <a href={`tel:${hold.hospitalPhone.replace(/[^0-9+]/g, '')}`} className="font-mono font-bold text-blue-700 hover:underline">
                          {hold.hospitalPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Accept vs Divert */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleAccept(hold.id)}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{txt.btnAccept}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRejectingHoldId(rejectingHoldId === hold.id ? null : hold.id)}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-bold text-sm cursor-pointer"
                >
                  {txt.btnDivert}
                </button>
              </div>

              {/* Divert Reasons */}
              {rejectingHoldId === hold.id && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-2 text-xs">
                  <span className="font-bold text-red-900 block">
                    {txt.selectDiversionReason}
                  </span>
                  <div className="space-y-1.5">
                    {diversionReasons.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => handleReject(hold.id, reason)}
                        className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-red-100/50 border border-red-200 text-neutral-800 font-medium transition-colors cursor-pointer"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE RESERVED / ACCEPTED BEDS CARD */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{txt.activeReservations}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            {acceptedHolds.length > 0 ? txt.incomingCount(acceptedHolds.length) : txt.zeroPending}
          </span>
        </div>

        {acceptedHolds.length > 0 ? (
          <div className="space-y-3">
            {acceptedHolds.map((acceptedHold) => (
              <div
                key={acceptedHold.id}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-extrabold text-neutral-900">{acceptedHold.ambulanceCallSign}</span>
                    {acceptedHold.ambulancePlate && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {acceptedHold.ambulancePlate}
                      </span>
                    )}
                    {acceptedHold.assignedBay && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-200 text-emerald-900">
                        {txt.bedHeldBay(acceptedHold.assignedBay)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    {acceptedHold.patientName && <><strong>{acceptedHold.patientName}</strong> &middot; </>}
                    {acceptedHold.chiefComplaint} &middot; {txt.etaLabel}: {acceptedHold.etaMinutes} {txt.minsText}
                  </p>
                  {(acceptedHold.driverName || acceptedHold.driverPhone) && (
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {language === 'hi' ? 'चालक:' : language === 'mr' ? 'चालक:' : 'Driver:'} {acceptedHold.driverName}{acceptedHold.driverPhone && ` (${acceptedHold.driverPhone})`}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => markArrived(acceptedHold.id)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors"
                  >
                    {txt.markArrived}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('tracking')}
                    className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{txt.btnTrackLiveMap}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : pendingHolds.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            <Building2 className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
            <span>{txt.noAmbulancesNotice}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

