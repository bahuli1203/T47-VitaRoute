import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { LeafletEmergencyMap } from './LeafletEmergencyMap';
import {
  Ambulance,
  Building2,
  Clock,
  Phone,
  CheckCircle2,
  Navigation,
  User,
  MapPin,
  Shield,
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

  // Find active hold or fallback to first available hold
  const activeHold = activeHolds.find((h) => h.status === 'accepted' || h.status === 'pending') || activeHolds[0];

  // Dynamic simulated road progress (0 to 100%)
  const [progressPercent, setProgressPercent] = useState<number>(55);
  const [etaSeconds, setEtaSeconds] = useState<number>(() => {
    return activeHold ? activeHold.etaMinutes * 60 : 210;
  });
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
        return prev + 0.4;
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

  // Patient / Incident scene coordinates
  const patientCoords = {
    lat: activeCitizenSOS?.lat || liveCoordinates?.lat || (destinationHospital.lat - 0.024),
    lng: activeCitizenSOS?.lng || liveCoordinates?.lng || (destinationHospital.lng - 0.018),
    label: activeCitizenSOS?.addressApprox || (language === 'hi' ? 'घटनास्थल पिकअप' : language === 'mr' ? 'घटनास्थळ पिकअप' : 'Incident Scene Pickup'),
  };

  const hospitalCoords = {
    lat: destinationHospital.lat || 40.7282,
    lng: destinationHospital.lng || -73.9942,
    name: destinationHospital.name,
  };

  const speedKmH = progressPercent >= 100 ? 0 : 54;
  const distanceRemainingKm = progressPercent >= 100 ? '0.0' : (Math.max(0.2, (1 - progressPercent / 100) * 4.2)).toFixed(1);

  const txt = {
    headerBadge: language === 'hi' ? 'लाइव एम्बुलेंस जीपीएस नक्शा' : language === 'mr' ? 'थेट रुग्णवाहिका जीपीएस नकाशा' : 'Live Ambulance Telematics & GPS Map',
    headerCad: language === 'hi' ? 'सीएडी जीपीएस सक्रिय' : language === 'mr' ? 'सीएडी जीपीएस सुरू' : 'CAD GPS ACTIVE',
    headerTitle: language === 'hi' ? 'एम्बुलेंस मार्ग और ईआर आगमन मॉनिटर' : language === 'mr' ? 'रुग्णवाहिका मार्ग आणि ईआर आगमन मॉनिटर' : 'Live Road Route & ER Arrival Monitor',
    headerSubtitle: language === 'hi' ? 'मरीज और अस्पताल दोनों के लिए लाइव जीपीएस नक्शा और समय गणना।' : language === 'mr' ? 'रुग्ण आणि रुग्णालय दोघांसाठी थेट जीपीएस नकाशा आणि वेळ गणना.' : 'Real-time GPS OpenStreetMap tracking, speed telemetry, and hospital ER bay coordination.',
    tabPatient: language === 'hi' ? 'मरीज दृश्य' : language === 'mr' ? 'रुग्ण दृश्य' : 'Patient View',
    tabHospital: language === 'hi' ? 'अस्पताल ईआर बोर्ड' : language === 'mr' ? 'रुग्णालय ईआर बोर्ड' : 'Hospital ER Board',
    estTime: language === 'hi' ? 'अनुमानित समय' : language === 'mr' ? 'अंदाजित वेळ' : 'Estimated Time',
    minSec: language === 'hi' ? 'मिनट : सेकंड' : language === 'mr' ? 'मिनिटे : सेकंद' : 'Minutes : Seconds',
    arrivedText: language === 'hi' ? 'पहुंच गए' : language === 'mr' ? 'पोहोचले' : 'Arrived',
    distLeft: language === 'hi' ? 'दूरी शेष' : language === 'mr' ? 'अंतर शिल्लक' : 'Distance Left',
    fastRoute: language === 'hi' ? 'फास्ट इमरजेंसी रूट' : language === 'mr' ? 'फास्ट इमर्जन्सी मार्ग' : 'Fast Emergency Route',
    speed: language === 'hi' ? 'गाड़ी की गति' : language === 'mr' ? 'वाहनाचा वेग' : 'Vehicle Speed',
    greenWave: language === 'hi' ? 'ग्रीन वेव सीएडी' : language === 'mr' ? 'ग्रीन वेव्ह सीएडी' : 'Green Wave CAD',
    unitName: activeHold?.ambulanceCallSign || (language === 'hi' ? 'यूनिट 104 (एएलएस पैरामेडिक)' : language === 'mr' ? 'युनिट १०४ (एएलएस पॅरामेडिक)' : 'Unit 104 (ALS Paramedic)'),
    driverMedic: language === 'hi' ? 'पैरामेडिक माइक इवांस · डायरेक्ट रेडियो चैनल 4' : language === 'mr' ? 'पॅरामेडिक माइक इव्हान्स · थेट रेडिओ चॅनेल ४' : 'Paramedic Mike Evans · Direct Radio Channel 4',
    btnCallMedic: language === 'hi' ? 'कॉल करें' : language === 'mr' ? 'कॉल करा' : 'Call Medic',
    hospDestTitle: language === 'hi' ? 'आरक्षित अस्पताल विवरण' : language === 'mr' ? 'आरक्षित रुग्णालय तपशील' : 'Hospital Destination & Bed',
    confirmedBadge: language === 'hi' ? '100% आरक्षित' : language === 'mr' ? '१००% निश्चित' : '100% Confirmed',
    designation: language === 'hi' ? 'मान्यता:' : language === 'mr' ? 'मान्यता:' : 'Designation:',
    reservedBed: language === 'hi' ? 'आरक्षित बेड' : language === 'mr' ? 'आरक्षित बेड' : 'Reserved Bed',
    erTargetBay: language === 'hi' ? 'ईआर लक्ष्य बे' : language === 'mr' ? 'ईआर लक्ष्य बे' : 'ER Target Bay',
    receivingDoc: language === 'hi' ? 'उपस्थित डॉक्टर' : language === 'mr' ? 'उपस्थित डॉक्टर' : 'Receiving Doctor',
    telemetryTitle: language === 'hi' ? 'रास्ते में मरीज टेलीमेट्री' : language === 'mr' ? 'प्रवासातील रुग्ण टेलिमेट्री' : 'In-Transit Patient Telemetry',
    btnConfirmArrival: language === 'hi' ? 'मरीज आगमन व ईआर में हैंडओवर की पुष्टि करें' : language === 'mr' ? 'रुग्ण आगमन व ईआर दाखल पुष्टी करा' : 'Confirm Patient Arrival & Handover to ER',
    btnErBoard: language === 'hi' ? 'ईआर होल्ड स्क्रीन' : language === 'mr' ? 'ईआर होल्ड स्क्रीन' : 'ER Hold Screen',
    btnDoctorRoster: language === 'hi' ? 'डॉक्टर रोस्टर' : language === 'mr' ? 'डॉक्टर रोस्टर' : 'Doctor Roster',
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-2">
      {/* Top Clinical Header & Mode Switcher in Crisp Red & White */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider">
              {txt.headerBadge}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
              {txt.headerCad}
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mt-1">
            {txt.headerTitle}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {txt.headerSubtitle}
          </p>
        </div>

        {/* View Switcher: Patient View vs Hospital Command View */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setSelectedTrackerTab('patient_view')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTrackerTab === 'patient_view'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {txt.tabPatient}
          </button>
          <button
            type="button"
            onClick={() => setSelectedTrackerTab('hospital_board')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedTrackerTab === 'hospital_board'
                ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {txt.tabHospital}
          </button>
        </div>
      </div>

      {/* Primary Tracking Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: OpenStreetMap & Telemetry (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Real Leaflet OpenStreetMap Container */}
          <LeafletEmergencyMap
            patientCoords={patientCoords}
            hospitalCoords={hospitalCoords}
            progressPercent={progressPercent}
            speedKmH={speedKmH}
            etaFormatted={formatCountdown(etaSeconds)}
            language={language}
          />

          {/* Telemetry Metrics Grid in Red & White */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.estTime}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-red-600 mt-0.5 block">
                {formatCountdown(etaSeconds)}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">{etaSeconds > 0 ? txt.minSec : txt.arrivedText}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.distLeft}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-neutral-900 mt-0.5 block">
                {distanceRemainingKm} km
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">{txt.fastRoute}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {txt.speed}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-0.5 block">
                {speedKmH} km/h
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">{txt.greenWave}</span>
            </div>
          </div>

          {/* Paramedic Unit & Driver Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold shrink-0">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900">
                    {activeHold?.ambulanceCallSign || txt.unitName}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                    {activeHold?.ambulancePlate || 'MH-02-ER-104'}
                  </span>
                </div>
                <span className="text-neutral-500 text-[11px] block mt-0.5">
                  {language === 'hi' ? 'चालक:' : language === 'mr' ? 'चालक:' : 'Driver:'} {activeHold?.driverName || 'Paramedic Arjun Singh'} &middot; {activeHold?.driverPhone || '+91 98201 55104'}
                </span>
              </div>
            </div>

            <a
              href={`tel:${(activeHold?.driverPhone || '+919820155104').replace(/[^0-9+]/g, '')}`}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{txt.btnCallMedic}</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Patient Details & Hospital ER Destination (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Patient Details & Incident Location Card (Requirement 4) */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-600" />
                <span>{language === 'hi' ? 'मरीज विवरण एवं घटनास्थल' : language === 'mr' ? 'रुग्ण तपशील व घटनास्थळ' : 'Patient Details & Scene'}</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {activeHold?.triageAcuity || 'Red'} Level 1
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-neutral-950 block">
                    {activeHold?.patientName || activeCitizenSOS?.patientName || 'Rajesh Kumar'}
                  </span>
                  <span className="text-neutral-500 font-mono text-[11px]">
                    {language === 'hi' ? 'आयु/लिंग:' : language === 'mr' ? 'वय/लिंग:' : 'Age/Gender:'} {activeHold?.patientAgeGender || '58M'}
                  </span>
                </div>
                <a
                  href={`tel:${(activeHold?.patientPhone || activeCitizenSOS?.callerPhone || '+919820012345').replace(/[^0-9+]/g, '')}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold flex items-center gap-1 border border-slate-200 transition-colors"
                >
                  <Phone className="w-3 h-3 text-red-600" />
                  <span>{activeHold?.patientPhone || activeCitizenSOS?.callerPhone || '+91 98200 12345'}</span>
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  {language === 'hi' ? 'प्राथमिक आपातकाल:' : language === 'mr' ? 'प्राथमिक आणीबाणी:' : 'Chief Complaint:'}
                </span>
                <p className="text-xs font-bold text-red-900 mt-0.5">
                  {activeHold?.chiefComplaint || activeCitizenSOS?.notes || 'Acute Respiratory Distress / Severe Hypoxemia'}
                </p>
              </div>

              <div className="flex items-start gap-1.5 text-neutral-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-[11px] leading-snug">
                  <strong>{language === 'hi' ? 'पिकअप पता:' : language === 'mr' ? 'पिकअप पत्ता:' : 'Scene Pickup:'}</strong>{' '}
                  {activeHold?.patientAddress || activeCitizenSOS?.addressApprox || 'Bandra-Worli Sea Link / SV Road, Mumbai'}
                </span>
              </div>
            </div>
          </div>

          {/* Reserved Hospital Bay Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-red-600" />
                <span>{txt.hospDestTitle}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                {txt.confirmedBadge}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-red-50/60 border border-red-100">
                <span className="text-xs font-bold text-neutral-900 block text-base">
                  {destinationHospital.name}
                </span>
                <span className="text-xs text-neutral-600 block mt-0.5">
                  {destinationHospital.address}
                </span>
                <span className="text-[11px] text-red-700 font-mono block mt-1 font-semibold">
                  {txt.designation} {destinationHospital.designation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">{txt.reservedBed}</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block">
                    {activeHold?.bedType === 'icu_ventilator' ? 'ICU Ventilator' : activeHold?.bedType || 'ICU Ventilator'}
                  </span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">{txt.erTargetBay}</span>
                  <span className="font-mono font-bold text-emerald-700 mt-0.5 block">
                    {activeHold?.assignedBay || 'Resuscitation Bay 2'}
                  </span>
                </div>
              </div>

              {/* Attending Specialist */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">{txt.receivingDoc}</span>
                  <span className="font-bold text-neutral-900 block mt-0.5">{assignedDoctor.name}</span>
                  <span className="text-[11px] text-neutral-500">{assignedDoctor.specialty} &middot; Ext. {assignedDoctor.phoneExtension}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                  {assignedDoctor.status.toUpperCase()}
                </span>
              </div>

              {/* Critical Clinical Vitals Summary */}
              <div className="border border-neutral-200 rounded-xl p-3 space-y-2 text-xs bg-white">
                <span className="text-[10px] font-bold text-neutral-500 uppercase block">
                  {txt.telemetryTitle}
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                  <div className="bg-neutral-100 p-1.5 rounded-lg">
                    <span className="text-[9px] text-neutral-500 block">BP</span>
                    <span className="font-bold text-neutral-900">88/54</span>
                  </div>
                  <div className="bg-neutral-100 p-1.5 rounded-lg">
                    <span className="text-[9px] text-neutral-500 block">HR</span>
                    <span className="font-bold text-red-600">128</span>
                  </div>
                  <div className="bg-neutral-100 p-1.5 rounded-lg">
                    <span className="text-[9px] text-neutral-500 block">SpO2</span>
                    <span className="font-bold text-red-600">84%</span>
                  </div>
                  <div className="bg-neutral-100 p-1.5 rounded-lg">
                    <span className="text-[9px] text-neutral-500 block">GCS</span>
                    <span className="font-bold text-neutral-900">9/15</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Hospital / Nurse */}
              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <button
                  type="button"
                  onClick={handleConfirmArrival}
                  className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{txt.btnConfirmArrival}</span>
                </button>

                {onNavigateTab && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('er')}
                      className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold cursor-pointer text-center"
                    >
                      {txt.btnErBoard}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('doctors')}
                      className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold cursor-pointer text-center"
                    >
                      {txt.btnDoctorRoster}
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
