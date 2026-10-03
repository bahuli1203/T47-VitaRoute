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
    activeCitizenSOS,
    triggerCitizenSOS,
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

  return (
    <div className="max-w-4xl mx-auto space-y-4 py-2">
      {/* Top Automated Dispatch Status Header */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
              {language === 'hi' ? 'स्वचालित एम्बुलेंस डिस्पैच' : language === 'mr' ? 'स्वयंचलित रुग्णवाहिका डिस्पॅच' : 'Automated CAD Dispatch'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
              AUTO-MATCH ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-950 mt-1">
            {language === 'hi' ? 'निकटतम उपलब्ध एम्बुलेंस एवं अस्पताल मिलान' : language === 'mr' ? 'जवळची उपलब्ध रुग्णवाहिका आणि रुग्णालय' : 'Auto-Assigned Nearest Unit & Hospital Bed'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'hi'
              ? 'आपातकाल आते ही निकटतम मुक्त एम्बुलेंस स्वतः असाइन होती है और निकटतम अस्पताल को 120s होल्ड भेजती है।'
              : language === 'mr'
              ? 'आणीबाणी येताच सर्वात जवळची मोफत रुग्णवाहिका आपोआप जोडली जाते आणि रुग्णालयाला १२० सेकंद होल्ड पाठवते.'
              : 'Zero manual forms. The nearest available ALS unit is auto-dispatched to the closest ER with a matching open bed.'}
          </p>
        </div>

        {/* 1-Click Simulation Switcher for Testing */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('respiratory')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-neutral-900 shadow-xs border border-neutral-200 cursor-pointer"
          >
            Ventilator
          </button>
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('cardiac')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            Cardiac
          </button>
          <button
            type="button"
            onClick={() => handleSimulateNewEmergency('trauma')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-neutral-600 hover:text-neutral-900 cursor-pointer"
          >
            Trauma
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
                  Assigned Unit
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Nearest Free Unit
                </span>
              </div>
              <h3 className="text-base font-extrabold text-neutral-950">
                {activeHold?.ambulanceCallSign || 'Ambulance Unit 104 (ALS Paramedic)'}
              </h3>
              <p className="text-xs text-neutral-500">
                Driver: Paramedic Mike Evans &middot; Mercedes Sprinter Type III &middot; Radio Ch. 4
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Unit Status
            </span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 mt-1 inline-block">
              En Route to Scene
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
                  Target Hospital ER
                </span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-red-100 text-red-800">
                  Closest Hospital with Open Bed
                </span>
              </div>
              <h3 className="text-base font-extrabold text-neutral-950">
                {matchedHospital.name}
              </h3>
              <p className="text-xs text-neutral-500">
                {matchedHospital.address} &middot; {matchedHospital.travelTimeMins} mins travel ({matchedHospital.distanceKm} km)
              </p>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Requested Bed
            </span>
            <span className="text-xs font-bold text-neutral-900 mt-1 font-mono">
              {activeHold?.bedType === 'icu_ventilator' ? 'ICU Ventilator' : activeHold?.bedType || 'ICU Bed'}
            </span>
          </div>
        </div>

        {/* Step 3: 2-Minute Confirmation Window & Status */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {isPending ? (
              <CountdownRing expiresAt={activeHold?.expiresAt || Date.now() + 115000} size={50} strokeWidth={4} />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            )}
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
                Hospital Confirmation Status
              </span>
              <h4 className="text-sm font-extrabold text-neutral-900">
                {isAccepted
                  ? (language === 'hi' ? 'बेड सुरक्षित व स्वीकार किया गया!' : language === 'mr' ? 'बेड स्वीकारले व आरक्षित!' : 'Bed Accepted & Held for Ambulance!')
                  : (language === 'hi' ? 'अस्पताल ईआर डेस्क से 120s पुष्टि प्रतीक्षारत...' : language === 'mr' ? 'रुग्णालयाकडून १२० सेकंद पुष्टी प्रतीक्षेत...' : '120s Hold Window: Awaiting Hospital ER Acceptance...')}
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isAccepted
                  ? `Assigned Bay: ${activeHold?.assignedBay || 'Resuscitation Bay 1'}`
                  : 'Hospital desk will accept within 2 mins. If rejected or timed out, auto-reroutes to next best ER.'}
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
              <span>{language === 'hi' ? 'लाइव मैप पर देखें' : language === 'mr' ? 'थेट नकाशावर पहा' : 'View on Live Map Tracker'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setRole('er')}
              className="px-3.5 py-3 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold text-xs cursor-pointer"
              title="Open ER Desk View"
            >
              ER View
            </button>
          </div>
        </div>

        {/* Collapsible Regional Hospital Comparison (For inspection if needed) */}
        <div>
          <button
            type="button"
            onClick={() => setShowAllHospitals(!showAllHospitals)}
            className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            <span>{showAllHospitals ? 'Hide Regional Hospital Comparison' : 'Inspect Other Regional Hospitals'}</span>
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
                      {h.beds.icu_ventilator.available} ICU Open
                    </span>
                    <span className="text-[10px] text-neutral-400">Updated {h.lastUpdatedMinutesAgo}m ago</span>
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
