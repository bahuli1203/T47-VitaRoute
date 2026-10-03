import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { EmergencyCategory } from '../../types/bedlink';
import { METRO_SECTORS } from '../../utils/geo';
import {
  AlertCircle,
  PhoneCall,
  MapPin,
  Clock,
  Shield,
  CheckCircle,
  Ambulance,
  Compass,
  FileText,
  Mic,
  MicOff,
  Radio,
  KeyRound,
  Building2,
  UserCheck,
  RotateCcw,
  Navigation,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { CitizenVoiceClassifier, ClassifiedEmergency } from './CitizenVoiceClassifier';

export const CitizenSOSView: React.FC = () => {
  const {
    triggerCitizenSOS,
    cancelCitizenSOS,
    revokeCitizenSOS,
    activeCitizenSOS,
    sosVerification,
    connectTeleTriageAudio,
    liveCoordinates,
    gpsAccuracy,
    gpsError,
    isLocating,
    requestLiveLocation,
    setRole,
    language,
    t,
  } = useBedLink();

  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('cardiac');
  const [callerPhone, setCallerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec-bandra');

  // Mumbai sector definitions for routing (matches METRO_SECTORS in geo.ts)
  const mumbaySectors = [
    { id: 'sec-bandra', label: language === 'hi' ? 'बांद्रा पश्चिम / बीकेसी' : language === 'mr' ? 'वांद्रे पश्चिम / बीकेसी' : 'Bandra West / BKC', nearHospital: 'Lilavati' },
    { id: 'sec-mahim',  label: language === 'hi' ? 'माहिम / कैडेल रोड' : language === 'mr' ? 'माहिम / कॅडेल रोड' : 'Mahim / Cadell Road', nearHospital: 'Hinduja' },
    { id: 'sec-parel',  label: language === 'hi' ? 'परेल / डॉ. अम्बेडकर रोड' : language === 'mr' ? 'परळ / डॉ. आंबेडकर रोड' : 'Parel / Lower Parel', nearHospital: 'KEM' },
    { id: 'sec-sion',   label: language === 'hi' ? 'सायन / पूर्वी एक्सप्रेसवे' : language === 'mr' ? 'सायन / पूर्व द्रुतगती' : 'Sion / Eastern Expy', nearHospital: 'Sion' },
    { id: 'sec-andheri',label: language === 'hi' ? 'अंधेरी पश्चिम / लिंक रोड' : language === 'mr' ? 'अंधेरी पश्चिम / लिंक रोड' : 'Andheri West / Link Rd', nearHospital: 'Kokilaben' },
    { id: 'sec-southmumbai', label: language === 'hi' ? 'मरीन लाइन्स / फोर्ट' : language === 'mr' ? 'मरीन लाइन्स / फोर्ट' : 'Marine Lines / South Mumbai', nearHospital: 'Bombay Hospital' },
  ];

  const selectedSector = METRO_SECTORS[selectedSectorId] || METRO_SECTORS['sec-bandra'];

  const handleVoiceClassified = (result: ClassifiedEmergency, transcript: string) => {
    setSelectedCategory(result.category);
    if (!notes) {
      setNotes(transcript);
    }
  };

  const handleVoiceAutoConfirm = (result: ClassifiedEmergency, transcript: string) => {
    setSelectedCategory(result.category);
    triggerCitizenSOS(
      result.category,
      callerPhone || '+91 98200 12345',
      transcript || 'Voice classified emergency',
      selectedSector.coords.lat,
      selectedSector.coords.lng,
      selectedSector.label
    );
  };

  const emergencyCategories: {
    id: EmergencyCategory;
    title: string;
    description: string;
  }[] = [
    {
      id: 'cardiac',
      title: t.catCardiac,
      description: t.catCardiacDesc,
    },
    {
      id: 'respiratory',
      title: t.catRespiratory,
      description: t.catRespiratoryDesc,
    },
    {
      id: 'trauma',
      title: t.catTrauma,
      description: t.catTraumaDesc,
    },
    {
      id: 'stroke',
      title: t.catStroke,
      description: t.catStrokeDesc,
    },
    {
      id: 'burn',
      title: t.catBurns,
      description: t.catBurnsDesc,
    },
  ];

  const handleTriggerSOS = () => {
    triggerCitizenSOS(
      selectedCategory,
      callerPhone,
      notes,
      selectedSector.coords.lat,
      selectedSector.coords.lng,
      selectedSector.label
    );
    setIsConfirming(false);
  };


  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
              {language === 'hi' ? 'नागरिक आपातकालीन एसओएस पोर्टल' : language === 'mr' ? 'नागरिक आणीबाणी एसओएस पोर्टल' : 'Citizen Emergency SOS Portal'}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {language === 'hi' ? 'तत्काल मेडिकल डिस्पैच' : language === 'mr' ? 'तात्काळ वैद्यकीय डिस्पॅच' : 'Immediate Medical Dispatch'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'hi' ? 'शून्य-प्रतीक्षा स्वचालित एम्बुलेंस डिस्पैच एवं लाइव टेलीमेट्री।' : language === 'mr' ? 'शून्य-प्रतीक्षा स्वयंचलित रुग्णवाहिका डिस्पॅच आणि थेट टेलिमेट्री.' : 'Zero-wait automatic ambulance CAD dispatch and live telemetry verification.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRole('ambulance')}
              className="text-xs font-semibold px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'एम्बुलेंस सीएडी पर जाएं' : language === 'mr' ? 'रुग्णवाहिका सीएडीवर जा' : 'Switch to Ambulance CAD'}
            </button>
          </div>
        </div>

        {/* Live GPS Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>{language === 'hi' ? 'जीपीएस टेलीमेट्री:' : language === 'mr' ? 'जीपीएस टेलिमेट्री:' : 'GPS Telemetry:'}</strong>{' '}
              {isLocating ? (
                <span className="text-slate-500">{language === 'hi' ? 'सैटेलाइट सिग्नल खोज रहे हैं...' : language === 'mr' ? 'सॅटेलाइट सिग्नल शोधत आहे...' : 'Acquiring satellite lock...'}</span>
              ) : gpsError ? (
                <span className="text-amber-700">{gpsError}</span>
              ) : (
                <span className="font-mono text-slate-800">
                  {liveCoordinates.lat.toFixed(4)} N, {Math.abs(liveCoordinates.lng).toFixed(4)} W
                  {gpsAccuracy !== null && ` (Accuracy: +/-${gpsAccuracy}m)`}
                </span>
              )}
            </span>
          </div>

          <button
            onClick={requestLiveLocation}
            className="text-xs text-neutral-700 hover:text-neutral-900 font-medium flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'स्थान रिफ्रेश करें' : language === 'mr' ? 'स्थान रिफ्रेश करा' : 'Refresh Location'}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE SOS STATUS CARD: PATIENT LIVE AMBULANCE & HOSPITAL ALLOCATION */}
      {activeCitizenSOS ? (
        <div className="bg-white border-2 border-rose-500 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-pulse"></span>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {language === 'hi' ? 'एम्बुलेंस रवाना एवं अस्पताल बेड आरक्षित' : language === 'mr' ? 'रुग्णवाहिका रवाना आणि रुग्णालय बेड आरक्षित' : 'Ambulance Dispatched & Hospital Bed Reserved'}
                </h3>
                <p className="text-xs text-rose-700 font-medium">
                  {language === 'hi' ? 'निकटतम ईआर से सीधा संपर्क स्थापित' : language === 'mr' ? 'जवळच्या ईआरशी थेट संपर्क जोडला' : 'Direct emergency link locked with nearest tertiary ER'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                ETA: ~{activeCitizenSOS.etaMinutes} {language === 'hi' ? 'मिनट' : language === 'mr' ? 'मिनिटे' : 'mins'}
              </span>
            </div>
          </div>

          {/* TWO MAIN CARDS: 1) ASSIGNED HOSPITAL  2) ASSIGNED AMBULANCE & DRIVER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. ASSIGNED HOSPITAL CARD */}
            <div className="bg-rose-50/40 border border-rose-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-rose-600" />
                    {language === 'hi' ? 'नियुक्त अस्पताल (ईआर)' : language === 'mr' ? 'नेमून दिलेले रुग्णालय (ईआर)' : 'Assigned Hospital ER'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {language === 'hi' ? 'बेड होल्ड सक्रिय' : language === 'mr' ? 'बेड होल्ड सुरू' : 'Bed Hold Active'}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 mt-1.5">
                  {activeCitizenSOS.assignedHospitalName || 'King Edward Memorial Hospital (KEM)'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  {activeCitizenSOS.assignedHospitalAddress || 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012'}
                </p>

                <div className="mt-2 pt-2 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {language === 'hi' ? 'निर्धारित बे:' : language === 'mr' ? 'नेमून दिलेले बे:' : 'Reserved Bay:'}
                  </span>
                  <span className="font-mono font-bold text-rose-700">
                    {activeCitizenSOS.assignedBay || 'Resuscitation Bay 1 - ICU'}
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-slate-600">
                  {activeCitizenSOS.assignedHospitalPhone || '022-2410 7000'}
                </span>
                <a
                  href={`tel:${(activeCitizenSOS.assignedHospitalPhone || '02224107000').replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-3 h-3 text-rose-600" />
                  <span>{language === 'hi' ? 'अस्पताल को कॉल करें' : language === 'mr' ? 'रुग्णालयाला कॉल करा' : 'Call Hospital'}</span>
                </a>
              </div>
            </div>

            {/* 2. ASSIGNED AMBULANCE & DRIVER CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <Ambulance className="w-3.5 h-3.5 text-slate-700" />
                    {language === 'hi' ? 'नियुक्त एम्बुलेंस व चालक' : language === 'mr' ? 'नेमून दिलेली रुग्णवाहिका व चालक' : 'Assigned Unit & Driver'}
                  </span>
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 border border-slate-300">
                    {activeCitizenSOS.assignedAmbulancePlate || 'MH-02-ER-104'}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
                  <span>{activeCitizenSOS.assignedAmbulanceCallSign || 'Ambulance 104 (ALS Paramedic Unit)'}</span>
                </h4>

                <div className="mt-1 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span><strong>{language === 'hi' ? 'चालक / पैरामेडिक:' : language === 'mr' ? 'चालक / पॅरामेडिक:' : 'Driver / Paramedic:'}</strong> {activeCitizenSOS.driverName || 'Paramedic Arjun Singh'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeCitizenSOS.addressApprox || 'Bandra-Worli Sea Link / SV Road, Mumbai'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-800">
                  {activeCitizenSOS.driverPhone || '+91 98201 55104'}
                </span>
                <a
                  href={`tel:${(activeCitizenSOS.driverPhone || '+919820155104').replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>{language === 'hi' ? 'ड्राइवर को कॉल करें' : language === 'mr' ? 'चालकाला कॉल करा' : 'Call Driver'}</span>
                </a>
              </div>
            </div>

          </div>

          {/* Incident Verification & Paramedic PIN */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900">
                  {language === 'hi' ? 'मरीज:' : language === 'mr' ? 'रुग्ण:' : 'Patient:'} {activeCitizenSOS.patientName || 'Rajesh Kumar'}
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-300 font-bold text-neutral-900">
                  #{activeCitizenSOS.id.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-600">
                {language === 'hi' ? 'पैरामेडिक सत्यापन पिन:' : language === 'mr' ? 'पॅरामेडिक पडताळणी पिन:' : 'On-Scene Paramedic Verification PIN:'}{' '}
                <strong className="text-slate-900 font-mono text-sm bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {sosVerification ? sosVerification.verificationPin : '4821'}
                </strong>
                {' '}&middot; {activeCitizenSOS.callerPhone}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:108"
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 text-xs shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कॉल 108 / 112' : language === 'mr' ? 'कॉल 108 / 112' : 'Call 108 / 112'}</span>
              </a>

              <button
                type="button"
                onClick={connectTeleTriageAudio}
                className={`px-3 py-1.5 rounded font-bold flex items-center gap-1.5 text-xs border transition-colors ${
                  sosVerification?.teleTriageAudioConnected
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white hover:bg-neutral-50 text-neutral-800 border-neutral-300'
                }`}
              >
                {sosVerification?.teleTriageAudioConnected ? (
                  <>
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>{language === 'hi' ? 'टेली-ट्राइएज सक्रिय' : language === 'mr' ? 'टेली-ट्रायेज सक्रिय' : 'Tele-Triage Active'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-neutral-700" />
                    <span>{language === 'hi' ? 'सीएडी ऑडियो कनेक्ट' : language === 'mr' ? 'सीएडी ऑडिओ कनेक्ट' : 'Connect CAD Audio'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* REVOKE REQUEST WITH 3-MINUTE GRACE PERIOD (Requirement 1) */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-amber-900 block">
                {language === 'hi' ? 'आपातकालीन कॉल निरस्तीकरण (ग्रेस पीरियड):' : language === 'mr' ? 'आणीबाणी कॉल रद्द करणे (ग्रेस पिरियड):' : 'Emergency Cancellation Window (Grace Period):'}
              </span>
              <p className="text-amber-800 mt-0.5 text-[11px]">
                {language === 'hi' 
                  ? 'यदि यह अनुरोध गलती से भेजा गया है, तो आप इसे रद्द कर सकते हैं। आरक्षित अस्पताल बेड तुरंत मुक्त हो जाएगा।' 
                  : language === 'mr' 
                  ? 'जर ही विनंती चुकून पाठवली गेली असेल, तर आपण रद्द करू शकता. आरक्षित बेड लगेच मोकळे होईल.' 
                  : 'If triggered by mistake, you can revoke this request. The ambulance will stand down and the reserved hospital bed will be released.'}
              </p>
            </div>

            {isRevoking ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-red-700 text-xs">
                  {language === 'hi' ? 'कॉल रद्द करें?' : language === 'mr' ? 'कॉल रद्द करायचा?' : 'Confirm Revoke?'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    revokeCitizenSOS(activeCitizenSOS.id);
                    setIsRevoking(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {language === 'hi' ? 'हाँ, रद्द करें' : language === 'mr' ? 'होय, रद्द करा' : 'Yes, Revoke'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRevoking(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  {language === 'hi' ? 'वापस' : language === 'mr' ? 'मागे' : 'Back'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsRevoking(true)}
                className="px-3.5 py-2 rounded-lg bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>{language === 'hi' ? 'अनुरोध रद्द करें (कॉल हटाएं)' : language === 'mr' ? 'विनंती रद्द करा' : 'Revoke / Cancel Request'}</span>
              </button>
            )}
          </div>

          {/* Action CTAs: Live Map & Dispatch */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <button
              onClick={() => cancelCitizenSOS(activeCitizenSOS.id)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'मरीज अस्पताल पहुंच गया' : language === 'mr' ? 'रुग्ण रुग्णालयात पोहोचला' : 'Mark Patient Transported'}
            </button>

            <button
              onClick={() => setRole('tracking')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>{language === 'hi' ? 'लाइव नक्शे पर एम्बुलेंस ट्रैक करें' : language === 'mr' ? 'थेट नकाशावर रुग्णवाहिका ट्रॅक करा' : 'Track Ambulance on Live Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* SOS TRIGGER FORM */
        <div className="flex flex-col gap-5">
          {/* Multilingual Speech-to-Text & Automatic Emergency Classifier */}
          <CitizenVoiceClassifier
            language={language}
            t={t}
            onClassified={handleVoiceClassified}
            onAutoConfirmSOS={handleVoiceAutoConfirm}
          />

          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col gap-5">

            {/* MUMBAI AREA / SECTOR SELECTOR */}
            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                <MapPin className="w-3.5 h-3.5 inline mr-1 text-rose-600" />
                {language === 'hi' ? 'आपका क्षेत्र / मोहल्ला (मुंबई)' : language === 'mr' ? 'तुमचा भाग / क्षेत्र (मुंबई)' : 'Your Area in Mumbai'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {mumbaySectors.map((sector) => {
                  const isSel = selectedSectorId === sector.id;
                  return (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => setSelectedSectorId(sector.id)}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                        isSel
                          ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSel ? 'text-rose-900' : 'text-slate-700'}`}>
                        {sector.label}
                      </span>
                      <span className={`text-[10px] mt-0.5 block ${isSel ? 'text-rose-600' : 'text-slate-400'}`}>
                        {language === 'hi' ? 'निकट:' : language === 'mr' ? 'जवळ:' : 'Near:'} {sector.nearHospital}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                {language === 'hi'
                  ? 'आपका चुना गया क्षेत्र अनुसार निकटतम उपलब्ध अस्पताल स्वतः चुना जाएगा।'
                  : language === 'mr'
                  ? 'तुमच्या निवडलेल्या क्षेत्रानुसार जवळचे उपलब्ध रुग्णालय आपोआप निवडले जाईल.'
                  : 'The nearest available ER to your selected area will be auto-matched.'}
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                {t.selectEmergencyType}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {emergencyCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-lg border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/60 ring-1 ring-rose-500'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isSelected ? 'text-rose-900' : 'text-slate-800'
                          }`}
                        >
                          {cat.title}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">
                        {cat.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact and Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'hi' ? 'संपर्क फोन नंबर:' : language === 'mr' ? 'संपर्क फोन नंबर:' : 'Callback Phone Number:'}
                </label>
                <div className="relative">
                  <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. +91 98200 12345' : language === 'mr' ? 'उदा. +91 98200 12345' : 'e.g. +91 98200 12345'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  {language === 'hi' ? 'लैंडमार्क या स्थिति विवरण:' : language === 'mr' ? 'लँडमार्क किंवा स्थिती तपशील:' : 'Landmark or Spoken Condition Note:'}
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. दूसरी मंजिल, फ्लैट 4B या मरीज की स्थिति' : language === 'mr' ? 'उदा. दुसरा मजला, फ्लॅट 4B किंवा स्थिती' : 'e.g. 2nd floor, Apartment 4B or condition details'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* MAIN BIG RED SOS TRIGGER BUTTON */}
            <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center">
              {isConfirming ? (
                <div className="w-full max-w-md bg-rose-50 border border-rose-300 rounded-lg p-4 text-center space-y-3">
                  <p className="text-xs font-bold text-rose-900">
                    {t.confirmEmergencyDispatch}
                  </p>
                  <p className="text-xs text-rose-700">
                    Zero wait: Advanced Life Support ambulance will be routed immediately and hospital bed will be held.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsConfirming(false)}
                      className="py-2.5 rounded border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={handleTriggerSOS}
                      className="py-2.5 rounded bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {t.sosEmergencyButton}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirming(true)}
                  className="w-full py-4 px-6 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-[0.99] cursor-pointer"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>{t.sosEmergencyButton}</span>
                </button>
              )}
            </div>
            <span className="text-[11px] text-slate-500 mt-2 text-center">
              Zero-wait automatic verification. Connects tele-triage audio without delay.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
