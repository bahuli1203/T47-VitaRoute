import React, { useState, useEffect } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { LeafletEmergencyMap } from './LeafletEmergencyMap';
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
    label: activeCitizenSOS?.addressApprox || 'Incident Scene (Emergency SOS)',
  };

  const hospitalCoords = {
    lat: destinationHospital.lat || 40.7282,
    lng: destinationHospital.lng || -73.9942,
    name: destinationHospital.name,
  };

  const speedKmH = progressPercent >= 100 ? 0 : 54;
  const distanceRemainingKm = progressPercent >= 100 ? '0.0' : (Math.max(0.2, (1 - progressPercent / 100) * 4.2)).toFixed(1);

  return (
    <div className="space-y-4 max-w-6xl mx-auto py-2">
      {/* Top Clinical Header & Mode Switcher in Crisp Red & White */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-extrabold text-red-700 uppercase tracking-wider">
              {language === 'hi' ? 'लाइव एम्बुलेंस जीपीएस नक्शा' : language === 'mr' ? 'थेट रुग्णवाहिका जीपीएस नकाशा' : 'Live Ambulance Telematics & GPS Map'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold">
              CAD GPS ACTIVE
            </span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mt-1">
            {language === 'hi' ? 'एम्बुलेंस मार्ग और ईआर आगमन मॉनिटर' : language === 'mr' ? 'रुग्णवाहिका मार्ग आणि ईआर आगमन मॉनिटर' : 'Live Road Route & ER Arrival Monitor'}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'hi' ? 'मरीज और अस्पताल दोनों के लिए लाइव जीपीएस नक्शा और समय गणना।' : language === 'mr' ? 'रुग्ण आणि रुग्णालय दोघांसाठी थेट जीपीएस नकाशा आणि वेळ गणना.' : 'Real-time GPS OpenStreetMap tracking, speed telemetry, and hospital ER bay coordination.'}
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
            {language === 'hi' ? 'मरीज दृश्य' : language === 'mr' ? 'रुग्ण दृश्य' : 'Patient View'}
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
            {language === 'hi' ? 'अस्पताल ईआर बोर्ड' : language === 'mr' ? 'रुग्णालय ईआर बोर्ड' : 'Hospital ER Board'}
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
          />

          {/* Telemetry Metrics Grid in Red & White */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {language === 'hi' ? 'अनुमानित समय' : language === 'mr' ? 'अंदाजित वेळ' : 'Estimated Time'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-red-600 mt-0.5 block">
                {formatCountdown(etaSeconds)}
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">{etaSeconds > 0 ? 'Minutes : Seconds' : 'Arrived'}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {language === 'hi' ? 'दूरी' : language === 'mr' ? 'अंतर' : 'Distance Left'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-neutral-900 mt-0.5 block">
                {distanceRemainingKm} km
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">Fast Emergency Route</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                {language === 'hi' ? 'गति' : language === 'mr' ? 'वेग' : 'Vehicle Speed'}
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-0.5 block">
                {speedKmH} km/h
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">Green Wave CAD</span>
            </div>
          </div>

          {/* Paramedic Unit Card in Crisp White */}
          <div className="bg-white border border-neutral-200 rounded-xl p-3.5 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold">
                <Ambulance className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-neutral-900 block">
                  {activeHold?.ambulanceCallSign || 'Unit 104 (ALS Paramedic)'}
                </span>
                <span className="text-neutral-500 text-[11px]">Paramedic Mike Evans &middot; Direct Radio Channel 4</span>
              </div>
            </div>

            <a
              href="tel:108"
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Medic</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Hospital ER Destination & Bed Reservation (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Reserved Hospital Bay Card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-red-600" />
                <span>{language === 'hi' ? 'आरक्षित अस्पताल विवरण' : language === 'mr' ? 'आरक्षित रुग्णालय तपशील' : 'Hospital Destination & Bed'}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                100% Confirmed
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
                  Designation: {destinationHospital.designation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">Reserved Bed</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block">
                    {activeHold?.bedType === 'icu_ventilator' ? 'ICU (Ventilator Bay)' : activeHold?.bedType || 'ICU Ventilator'}
                  </span>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">ER Target Bay</span>
                  <span className="font-mono font-bold text-emerald-700 mt-0.5 block">
                    {activeHold?.assignedBay || 'Resuscitation Bay 2'}
                  </span>
                </div>
              </div>

              {/* Attending Specialist */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-bold text-neutral-500 uppercase block">Receiving Doctor</span>
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
                  In-Transit Patient Telemetry
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
                  <span>{language === 'hi' ? 'मरीज आगमन व आईसीयू में प्रवेश की पुष्टि करें' : language === 'mr' ? 'रुग्ण आगमन व आयसीयू दाखल पुष्टी करा' : 'Confirm Patient Arrival & Handover to ER'}</span>
                </button>

                {onNavigateTab && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('er')}
                      className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold cursor-pointer text-center"
                    >
                      {language === 'hi' ? 'ईआर होल्ड बोर्ड' : language === 'mr' ? 'ईआर होल्ड बोर्ड' : 'ER Hold Screen'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateTab('doctors')}
                      className="py-2 px-3 rounded-lg border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold cursor-pointer text-center"
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
