import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import {
  Ambulance,
  MapPin,
  Clock,
  Phone,
  Activity,
  CheckCircle2,
  Building2,
  Navigation,
  Shield,
  Radio,
  UserCheck,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface LiveAmbulanceTrackerViewProps {
  viewerRole?: 'patient' | 'hospital' | 'dispatch';
  onNavigateTab?: (role: any) => void;
}

export const LiveAmbulanceTrackerView: React.FC<LiveAmbulanceTrackerViewProps> = ({
  viewerRole = 'patient',
  onNavigateTab,
}) => {
  const {
    activeCitizenSOS,
    activeHolds,
    currentHospital,
    hospitals,
    doctors,
    markArrived,
    liveCoordinates,
    language,
    t,
  } = useBedLink();

  // Find active hold or create a realistic live tracked case
  const activeHold = activeHolds.find((h) => h.status === 'accepted' || h.status === 'pending') || activeHolds[0];

  // Calculate dynamic simulated road progress (0 to 100%)
  const [progressPercent, setProgressPercent] = useState<number>(55);
  const [etaSeconds, setEtaSeconds] = useState<number>(() => {
    return activeHold ? activeHold.etaMinutes * 60 : 210;
  });
  const [isSirenActive, setIsSirenActive] = useState<boolean>(true);
  const [selectedTrackerTab, setSelectedTrackerTab] = useState<'patient_view' | 'hospital_board'>(
    viewerRole === 'hospital' ? 'hospital_board' : 'patient_view'
  );

  // Live ETA countdown and progress advancement
  useEffect(() => {
    const timer = setInterval(() => {
      setEtaSeconds((prev) => {
        if (prev <= 1) {
          setProgressPercent(100);
          return 0;
        }
        return prev - 1;
      });

      setProgressPercent((prev) => {
        if (prev >= 98) return 98;
        return prev + 0.5;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const destinationHospital = hospitals.find((h) => h.id === activeHold?.hospitalId) || currentHospital;
  const assignedDoctor = doctors.find((d) => d.hospitalId === destinationHospital.id && d.status === 'available') || doctors[0];

  const handleConfirmArrival = () => {
    if (activeHold) {
      markArrived(activeHold.id);
      setProgressPercent(100);
      setEtaSeconds(0);
    }
  };

  return (
    <div className="space-y-5 max-w-6xl mx-auto py-2">
      {/* Top Clinical Header & Mode Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {language === 'hi' ? 'लाइव एम्बुलेंस ट्रैकिंग सिस्टम' : language === 'mr' ? 'थेट रुग्णवाहिका ट्रॅकिंग प्रणाली' : 'Live Ambulance Telematics & Tracking'}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
              CAD GPS-ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {language === 'hi' ? 'एम्बुलेंस मार्ग और ईआर आगमन मॉनिटर' : language === 'mr' ? 'रुग्णवाहिका मार्ग आणि ईआर आगमन मॉनिटर' : 'In-Transit Route & Emergency Arrival Monitor'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'hi' ? 'मरीज और अस्पताल दोनों के लिए लाइव जीपीएस ट्रैकिंग और समय गणना।' : language === 'mr' ? 'रुग्ण आणि रुग्णालय दोघांसाठी थेट जीपीएस ट्रॅकिंग आणि वेळ गणना.' : 'Real-time GPS road tracking, speed telemetry, and hospital ER bay coordination.'}
          </p>
        </div>

        {/* View Switcher: Patient View vs Hospital Command View */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedTrackerTab('patient_view')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              selectedTrackerTab === 'patient_view'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'मरीज / नागरिक दृश्य' : language === 'mr' ? 'रुग्ण / नागरिक दृश्य' : 'Patient View'}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrackerTab('hospital_board')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              selectedTrackerTab === 'hospital_board'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {language === 'hi' ? 'अस्पताल ईआर बोर्ड' : language === 'mr' ? 'रुग्णालय ईआर बोर्ड' : 'Hospital ER Board'}
          </button>
        </div>
      </div>

      {/* Primary Tracking Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: Live Map Progress & Visual Telemetry Track (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Visual Telemetry Road Track Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block leading-tight">
                    {activeHold?.ambulanceCallSign || 'Ambulance 104 (ALS Paramedic Unit)'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Vehicle ID: CAD-AMB-NYC-408 · Mercedes Sprinter Type III
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Live Status
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded border inline-block ${
                  progressPercent >= 100
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                }`}>
                  {progressPercent >= 100
                    ? (language === 'hi' ? 'अस्पताल में उपस्थित' : language === 'mr' ? 'रुग्णालयात पोहोचले' : 'Arrived at ER Bay')
                    : (language === 'hi' ? 'रास्ते में (इमरजेंसी सायरन)' : language === 'mr' ? 'मार्गावर (आणीबाणी सायरन)' : 'En Route with Sirens')}
                </span>
              </div>
            </div>

            {/* Live Progress Road Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>{language === 'hi' ? 'मरीज पिकअप बिंदु' : language === 'mr' ? 'रुग्ण पिकअप स्थान' : 'Patient Incident Location'}</span>
                </span>
                <span className="font-mono text-slate-500">
                  {Math.round(progressPercent)}% {language === 'hi' ? 'पूर्ण' : language === 'mr' ? 'पूर्ण' : 'Traversed'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-sky-700" />
                  <span>{destinationHospital.name}</span>
                </span>
              </div>

              {/* Road Graphic Track with Moving Ambulance */}
              <div className="relative w-full h-8 bg-slate-200 rounded-full overflow-visible flex items-center px-1">
                {/* Progress Fill */}
                <div
                  className="h-4 bg-sky-600 rounded-full transition-all duration-700 relative"
                  style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
                >
                  {/* Moving Ambulance Indicator */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white text-white flex items-center justify-center shadow-md">
                    <Ambulance className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Waypoint Steps */}
              <div className="grid grid-cols-4 text-center text-[10px] font-bold text-slate-500 pt-1">
                <span className="text-emerald-700">1. Dispatched</span>
                <span className="text-emerald-700">2. On Scene</span>
                <span className={progressPercent >= 50 ? 'text-sky-700 font-extrabold' : ''}>3. En Route</span>
                <span className={progressPercent >= 100 ? 'text-emerald-700' : ''}>4. ER Handover</span>
              </div>
            </div>

            {/* Telemetry Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {language === 'hi' ? 'अनुमानित समय' : language === 'mr' ? 'अंदाजित वेळ' : 'Estimated Time'}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-sky-800 mt-0.5 block">
                  {formatCountdown(etaSeconds)}
                </span>
                <span className="text-[10px] text-slate-500">{etaSeconds > 0 ? 'Minutes : Seconds' : 'Arrived'}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {language === 'hi' ? 'दूरी' : language === 'mr' ? 'अंतर' : 'Distance Remaining'}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 mt-0.5 block">
                  {progressPercent >= 100 ? '0.0' : (Math.max(0.2, (1 - progressPercent / 100) * 4.2)).toFixed(1)} km
                </span>
                <span className="text-[10px] text-slate-500">Fast Highway Route</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {language === 'hi' ? 'गति' : language === 'mr' ? 'वेग' : 'Current Speed'}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-800 mt-0.5 block">
                  {progressPercent >= 100 ? '0' : '54'} km/h
                </span>
                <span className="text-[10px] text-slate-500">Green Wave CAD</span>
              </div>
            </div>

            {/* Paramedic Crew Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Paramedic Mike Evans, NREMT-P</span>
                  <span className="text-slate-500 text-[11px]">Primary Dispatch Driver · Radio Channel 4</span>
                </div>
              </div>

              <a
                href="tel:108"
                className="px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Medic</span>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Hospital ER Destination & Bed Reservation Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Reserved Hospital Bay Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-sky-700" />
                <span>{language === 'hi' ? 'आरक्षित अस्पताल विवरण' : language === 'mr' ? 'आरक्षित रुग्णालय तपशील' : 'Destination Hospital & Bed Reservation'}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Bed Confirmed
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-sky-50 border border-sky-200">
                <span className="text-xs font-bold text-sky-950 block text-base">
                  {destinationHospital.name}
                </span>
                <span className="text-xs text-sky-800 block mt-0.5">
                  {destinationHospital.address}
                </span>
                <span className="text-[11px] text-sky-700 font-mono block mt-1">
                  Designation: {destinationHospital.designation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Reserved Bed Type</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {activeHold?.bedType === 'icu_ventilator' ? 'ICU (Ventilator Bay)' : activeHold?.bedType || 'ICU Ventilator'}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">ER Target Bay</span>
                  <span className="font-mono font-bold text-emerald-800 mt-0.5 block">
                    {activeHold?.assignedBay || 'Resuscitation Bay 2'}
                  </span>
                </div>
              </div>

              {/* On-Duty Doctor Assigned */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Receiving Attending Doctor</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{assignedDoctor.name}</span>
                  <span className="text-[11px] text-slate-500">{assignedDoctor.specialty} · {assignedDoctor.phoneExtension}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  {assignedDoctor.status.toUpperCase()}
                </span>
              </div>

              {/* Critical Clinical Vitals Summary */}
              <div className="border border-slate-200 rounded-lg p-3 space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  In-Transit Telemetry
                </span>
                <div className="grid grid-cols-4 gap-1 text-center font-mono">
                  <div className="bg-slate-100 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">BP</span>
                    <span className="font-bold text-slate-900">88/54</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">HR</span>
                    <span className="font-bold text-rose-700">128 bpm</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">SpO2</span>
                    <span className="font-bold text-amber-700">84% O2</span>
                  </div>
                  <div className="bg-slate-100 p-1.5 rounded">
                    <span className="text-[9px] text-slate-500 block">GCS</span>
                    <span className="font-bold text-slate-900">9 / 15</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Hospital / Nurse */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmArrival}
                  className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'hi' ? 'मरीज आगमन व आईसीयू में प्रवेश की पुष्टि करें' : language === 'mr' ? 'रुग्ण आगमन व आयसीयू दाखल पुष्टी करा' : 'Confirm Patient Arrival & Admit to ICU Bed'}</span>
                </button>

                {onNavigateTab && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('er')}
                      className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      {language === 'hi' ? 'ईआर होल्ड बोर्ड' : language === 'mr' ? 'ईआर होल्ड बोर्ड' : 'View ER Hold Board'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('doctors')}
                      className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-semibold cursor-pointer"
                    >
                      {language === 'hi' ? 'डॉक्टर रोस्टर' : language === 'mr' ? 'डॉक्टर रोस्टर' : 'Doctor Roster'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
