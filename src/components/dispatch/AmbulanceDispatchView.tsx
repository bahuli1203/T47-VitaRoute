import React, { useMemo, useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import {
  Ambulance,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Radio,
  Navigation,
  ArrowRight,
  RefreshCw,
  Phone,
  AlertTriangle,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CountdownRing } from '../common/CountdownRing';

export const AmbulanceDispatchView: React.FC = () => {
  const {
    hospitals,
    activeHolds,
    requestHold,
    setRole,
    language,
    t,
  } = useBedLink();

  const [showAllHospitals, setShowAllHospitals] = useState<boolean>(false);

  // Active emergency or auto-create one if none exists
  const activeHold = activeHolds.find((h) => h.status === 'accepted' || h.status === 'pending') || activeHolds[0];

  // Auto-find best hospital with open ICU bed
  const matchedHospital = useMemo(() => {
    if (activeHold) {
      return hospitals.find((h) => h.id === activeHold.hospitalId) || hospitals[0];
    }
    const openHosp = hospitals.find((h) => h.beds.icu_ventilator.available > 0) || hospitals[0];
    return openHosp;
  }, [activeHold, hospitals]);

  // If no hold is active, automatically trigger hold on load for seamless zero-manual demo
  useEffect(() => {
    if (!activeHold && matchedHospital) {
      requestHold(matchedHospital.id, 'icu_ventilator');
    }
  }, [activeHold, matchedHospital, requestHold]);

  const handleSimulateNewEmergency = (type: 'cardiac' | 'respiratory' | 'trauma') => {
    if (type === 'cardiac') {
      const best = hospitals.find((h) => h.specialties.includes('cardiac_cath_lab') && h.beds.cardiac_monitored.available > 0) || hospitals[0];
      requestHold(best.id, 'cardiac_monitored', 'Ambulance Unit 104', 'Red', { bp: '90/60', hr: 132, spo2: 89, gcs: 11 });
    } else if (type === 'respiratory') {
      const best = hospitals.find((h) => h.beds.icu_ventilator.available > 0) || hospitals[0];
      requestHold(best.id, 'icu_ventilator', 'Ambulance Unit 104', 'Red', { bp: '105/70', hr: 118, spo2: 81, gcs: 10 });
    } else {
      const best = hospitals.find((h) => h.specialties.includes('trauma_level_1') && h.beds.trauma_resuscitation.available > 0) || hospitals[0];
      requestHold(best.id, 'trauma_resuscitation', 'Ambulance Unit 104', 'Red', { bp: '82/50', hr: 140, spo2: 86, gcs: 8 });
    }
  };

  const isAccepted = activeHold?.status === 'accepted';
  const isPending = activeHold?.status === 'pending';

  // Multilingual text dictionary
  const txt = {
    badgeCad: language === 'hi' ? 'स्वचालित सीएडी डिस्पैच' : language === 'mr' ? 'स्वयंचलित सीएडी डिस्पॅच' : 'AUTOMATED CAD DISPATCH',
    badgeAutoActive: language === 'hi' ? 'ऑटो-मैच सक्रिय' : language === 'mr' ? 'ऑटो-मॅच सुरू' : 'AUTO-MATCH ACTIVE',
    title: language === 'hi' ? 'निकटतम उपलब्ध एम्बुलेंस एवं अस्पताल मिलान' : language === 'mr' ? 'जवळची उपलब्ध रुग्णवाहिका आणि रुग्णालय' : 'Auto-Assigned Nearest Unit & Hospital Bed',
    subtitle: language === 'hi' 
      ? 'शून्य मैनुअल फॉर्म। निकटतम उपलब्ध एम्बुलेंस स्वतः असाइन होती है और निकटतम खुले बेड वाले ईआर से जुड़ती है।' 
      : language === 'mr' 
      ? 'कोणतेही मॅन्युअल फॉर्म नाहीत. उपलब्ध रुग्णवाहिका आपोआप जोडली जाते आणि जवळच्या रुग्णालयात निर्देशित होते.' 
      : 'Zero manual forms. The nearest available ALS unit is auto-dispatched to the closest ER with a matching open bed.',
    presetVent: language === 'hi' ? 'वेंटिलेटर' : language === 'mr' ? 'व्हेंटिलेटर' : 'Ventilator',
    presetCardiac: language === 'hi' ? 'हार्ट / कैथ' : language === 'mr' ? 'हार्ट (कॅथ)' : 'Cardiac',
    presetTrauma: language === 'hi' ? 'ट्रामा' : language === 'mr' ? 'ट्रॉमा' : 'Trauma',
    assignedUnit: language === 'hi' ? 'असाइन की गई एम्बुलेंस' : language === 'mr' ? 'नेमून दिलेली रुग्णवाहिका' : 'ASSIGNED UNIT',
    nearestFreeUnit: language === 'hi' ? 'निकटतम मुक्त यूनिट' : language === 'mr' ? 'जवळचे उपलब्ध युनिट' : 'Nearest Free Unit',
    unitName: language === 'hi' ? 'एम्बुलेंस यूनिट 104 (एएलएस पैरामेडिक)' : language === 'mr' ? 'रुग्णवाहिका युनिट 104 (एएलएस पॅरामेडिक)' : 'Ambulance 104 (ALS Paramedic Unit)',
    driverInfo: language === 'hi' ? 'चालक: पैरामेडिक माइक इवांस · मर्सिडीज स्प्रिंटर · रेडियो चैनल 4' : language === 'mr' ? 'चालक: पॅरामेडिक माइक इव्हान्स · मर्सिडीज स्प्रिंटर · रेडिओ चॅनेल ४' : 'Driver: Paramedic Mike Evans · Mercedes Sprinter Type III · Radio Ch. 4',
    unitStatus: language === 'hi' ? 'यूनिट स्थिति' : language === 'mr' ? 'युनिट स्थिती' : 'UNIT STATUS',
    enRoute: language === 'hi' ? 'घटनास्थल की ओर रवाना' : language === 'mr' ? 'घटनास्थळाकडे रवाना' : 'En Route to Scene',
    targetHospital: language === 'hi' ? 'लक्षित अस्पताल ईआर' : language === 'mr' ? 'लक्ष्य रुग्णालय ईआर' : 'TARGET HOSPITAL ER',
    closestOpenBed: language === 'hi' ? 'खुले बेड के साथ निकटतम अस्पताल' : language === 'mr' ? 'उपलब्ध बेडसह जवळचे रुग्णालय' : 'Closest Hospital with Open Bed',
    minsTravel: language === 'hi' ? 'मिनट यात्रा' : language === 'mr' ? 'मिनिटे प्रवास' : 'mins travel',
    requestedBed: language === 'hi' ? 'अनुरोधित बेड' : language === 'mr' ? 'मागणी केलेले बेड' : 'REQUESTED BED',
    bedIcuVent: language === 'hi' ? 'आईसीयू वेंटिलेटर' : language === 'mr' ? 'आयसीयू व्हेंटिलेटर' : 'ICU Ventilator',
    confirmationStatus: language === 'hi' ? 'अस्पताल पुष्टि स्थिति' : language === 'mr' ? 'रुग्णालय पुष्टी स्थिती' : 'HOSPITAL CONFIRMATION STATUS',
    awaitingEr: language === 'hi' ? '120s होल्ड विंडो: अस्पताल ईआर स्वीकृति प्रतीक्षारत...' : language === 'mr' ? '१२० सेकंद होल्ड: रुग्णालयाच्या मंजुरीची प्रतीक्षा...' : '120s Hold Window: Awaiting Hospital ER Acceptance...',
    bedAccepted: language === 'hi' ? 'बेड स्वीकार किया गया व एम्बुलेंस हेतु आरक्षित!' : language === 'mr' ? 'बेड स्वीकारले व रुग्णवाहिकेसाठी आरक्षित!' : 'Bed Accepted & Held for Ambulance!',
    assignedBayText: language === 'hi' ? 'निर्धारित ईआर बे: रिससिटेशन बे 1' : language === 'mr' ? 'नेमून दिलेले ईआर बे: रिसुसिटेशन बे १' : 'Assigned Bay: Resuscitation Bay 1',
    erDeskNotice: language === 'hi' ? 'अस्पताल ईआर 2 मिनट में पुष्टि करेगा। अस्वीकृत होने पर स्वतः अगले सर्वश्रेष्ठ अस्पताल को भेजा जाएगा।' : language === 'mr' ? 'रुग्णालय २ मिनिटांत पुष्टी करेल. नाकारल्यास आपोआप पुढच्या रुग्णालयाकडे पाठवले जाईल.' : 'Hospital desk will accept within 2 mins. If rejected or timed out, auto-reroutes to next best ER.',
    btnLiveMap: language === 'hi' ? 'लाइव मैप ट्रैकर पर देखें' : language === 'mr' ? 'थेट नकाशा ट्रॅकरवर पहा' : 'View on Live Map Tracker',
    btnErView: language === 'hi' ? 'ईआर दृश्य' : language === 'mr' ? 'ईआर दृश्य' : 'ER View',
    showComparison: language === 'hi' ? 'अन्य क्षेत्रीय अस्पतालों की तुलना देखें' : language === 'mr' ? 'इतर प्रादेशिक रुग्णालयांची तुलना पहा' : 'Inspect Other Regional Hospitals',
    hideComparison: language === 'hi' ? 'क्षेत्रीय अस्पताल तुलना छुपाएं' : language === 'mr' ? 'प्रादेशिक रुग्णालयांची तुलना लपवा' : 'Hide Regional Hospital Comparison',
    icuOpen: language === 'hi' ? 'आईसीयू उपलब्ध' : language === 'mr' ? 'आयसीयू उपलब्ध' : 'ICU Open',
    updatedAgo: (m: number) => language === 'hi' ? `${m} मिनट पहले अपडेट` : language === 'mr' ? `${m} मिनीटांपूर्वी अपडेट` : `Updated ${m}m ago`,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Top Automated Dispatch Status Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
              {txt.badgeCad}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
              {txt.badgeAutoActive}
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-950 mt-1">
            {txt.title}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {txt.subtitle}
          </p>
        </div>

        {/* 1-Click Simulation Switcher for Testing */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('respiratory')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-neutral-900 shadow-xs border border-neutral-200 cursor-pointer"
          >
            {txt.presetVent}
          </button>
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('cardiac')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            {txt.presetCardiac}
          </button>
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('trauma')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            {txt.presetTrauma}
          </button>
        </div>
      </div>

      {/* Main Automated Match Card */}
      <div className="bg-white border-2 border-red-100 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
        {/* Step 1: Assigned Ambulance Unit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Ambulance className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  {txt.assignedUnit}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {txt.nearestFreeUnit}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-neutral-950">
                {activeHold?.ambulanceCallSign || txt.unitName}
              </h3>
              <p className="text-xs text-neutral-500">
                {txt.driverInfo}
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {txt.unitStatus}
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 mt-1 inline-block">
              {txt.enRoute}
            </span>
          </div>
        </div>

        {/* Step 2: Auto-Matched Target Hospital */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600">
                  {txt.targetHospital}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800">
                  {txt.closestOpenBed}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-neutral-950">
                {matchedHospital.name}
              </h3>
              <p className="text-xs text-neutral-500">
                {matchedHospital.address} &middot; {matchedHospital.travelTimeMins} {txt.minsTravel} ({matchedHospital.distanceKm} km)
              </p>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              {txt.requestedBed}
            </span>
            <span className="text-xs font-bold text-neutral-900 mt-1 font-mono">
              {activeHold?.bedType === 'icu_ventilator' ? txt.bedIcuVent : activeHold?.bedType || 'ICU Bed'}
            </span>
          </div>
        </div>

        {/* Step 3: 2-Minute Confirmation Window & Status */}
        <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {isPending ? (
              <CountdownRing
                expiresAt={activeHold?.expiresAt || Date.now() + 115000}
                size={62}
                strokeWidth={5}
                language={language}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.confirmationStatus}
              </span>
              <h4 className="text-sm font-extrabold text-neutral-900">
                {isAccepted ? txt.bedAccepted : txt.awaitingEr}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isAccepted ? txt.assignedBayText : txt.erDeskNotice}
              </p>
            </div>
          </div>

          {/* Direct CTA: Jump to Live Map or ER Hold */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setRole('tracking')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-600/20 cursor-pointer active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{txt.btnLiveMap}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRole('er')}
              className="px-3.5 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold text-xs cursor-pointer"
              title="Open ER Desk View"
            >
              {txt.btnErView}
            </button>
          </div>
        </div>

        {/* Collapsible Regional Hospital Comparison */}
        <div>
          <button
            type="button"
            onClick={() => setShowAllHospitals(!showAllHospitals)}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            <span>{showAllHospitals ? txt.hideComparison : txt.showComparison}</span>
            {showAllHospitals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAllHospitals && (
            <div className="mt-3 space-y-2 pt-2 border-t border-neutral-100">
              {hospitals.map((h, i) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-neutral-400">#{i + 1}</span>
                    <span className="font-bold text-neutral-900">{h.name}</span>
                    <span className="text-neutral-500 font-mono text-[11px]">{h.travelTimeMins}m travel &middot; {h.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-emerald-700 font-bold">
                      {h.beds.icu_ventilator.available} {txt.icuOpen}
                    </span>
                    <span className="text-[10px] text-neutral-400">{txt.updatedAgo(h.lastUpdatedMinutesAgo)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
