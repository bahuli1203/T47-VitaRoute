import React, { useState } from 'react';
import { useBedLink } from '../../context/BedLinkContext';
import { EmergencyCategory } from '../../types/bedlink';
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
} from 'lucide-react';
import { CitizenVoiceClassifier, ClassifiedEmergency } from './CitizenVoiceClassifier';

export const CitizenSOSView: React.FC = () => {
  const {
    triggerCitizenSOS,
    cancelCitizenSOS,
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
      callerPhone || '555-0199',
      transcript || 'Voice classified emergency'
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
    triggerCitizenSOS(selectedCategory, callerPhone, notes);
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

      {/* ACTIVE SOS STATUS CARD: FAST VERIFICATION AND PARALLEL CAD TELE-TRIAGE */}
      {activeCitizenSOS ? (
        <div className="bg-white border-2 border-rose-500 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'एम्बुलेंस आपके स्थान के लिए रवाना हो चुकी है' : language === 'mr' ? 'रुग्णवाहिका तुमच्या स्थानाकडे निघाली आहे' : 'Ambulance En Route to Your Location'}
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
              {language === 'hi' ? 'सक्रिय सीएडी डिस्पैच' : language === 'mr' ? 'सक्रिय सीएडी डिस्पॅच' : 'Active CAD Dispatch'}
            </span>
          </div>

          {/* Unit, ETA, Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                {language === 'hi' ? 'नियुक्त एम्बुलेंस' : language === 'mr' ? 'नियुक्त रुग्णवाहिका' : 'Assigned Unit'}
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Ambulance className="w-4 h-4 text-slate-700" />
                {activeCitizenSOS.assignedAmbulanceCallSign}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                {language === 'hi' ? 'अनुमानित आगमन' : language === 'mr' ? 'अंदाजित आगमन' : 'Estimated Arrival'}
              </span>
              <span className="text-sm font-bold text-rose-700 flex items-center gap-1.5 mt-0.5 font-mono">
                <Clock className="w-4 h-4" />
                ~{activeCitizenSOS.etaMinutes} {language === 'hi' ? 'मिनट' : language === 'mr' ? 'मिनिटे' : 'Minutes'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">
                {language === 'hi' ? 'आपातकाल प्रकार' : language === 'mr' ? 'आणीबाणी प्रकार' : 'Emergency Type'}
              </span>
              <span className="text-sm font-bold text-slate-900 uppercase mt-0.5 block">
                {activeCitizenSOS.category}
              </span>
            </div>
          </div>

          {/* FAST VERIFICATION AND PARALLEL CAD TELE-TRIAGE STRIP */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'सत्यापित घटना रिकॉर्ड:' : language === 'mr' ? 'पडताळणी घटना नोंद:' : 'Auto-Verified Incident Record:'}
                </span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-300 font-bold text-neutral-900">
                  #{activeCitizenSOS.id.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-600">
                {language === 'hi' ? 'पैरामेडिक सत्यापन पिन:' : language === 'mr' ? 'पॅरामेडिक पडताळणी पिन:' : 'Paramedic on-scene verification PIN:'}{' '}
                <strong className="text-slate-900 font-mono text-sm">
                  {sosVerification ? sosVerification.verificationPin : '4821'}
                </strong>
                . {language === 'hi' ? 'शून्य प्रतीक्षा समय, एम्बुलेंस तुरंत रवाना हुई।' : language === 'mr' ? 'शून्य प्रतीक्षा वेळ, रुग्णवाहिका लगेच निघाली.' : 'Zero waiting time, ambulance was dispatched immediately.'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="tel:108"
                className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 text-xs shadow-xs"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कॉल 108 / 112' : language === 'mr' ? 'कॉल 108 / 112' : 'Call 911 / 108'}</span>
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
                    <span>{language === 'hi' ? 'टेली-ट्राइएज ऑडियो सक्रिय' : language === 'mr' ? 'टेली-ट्रायेज ऑडिओ सक्रिय' : 'Tele-Triage Audio Active'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-neutral-700" />
                    <span>{language === 'hi' ? 'टेली-ट्राइएज कनेक्ट करें' : language === 'mr' ? 'टेली-ट्रायेज कनेक्ट करा' : 'Connect CAD Tele-Triage'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Guidelines Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs space-y-2 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-neutral-800" />
              <span>{language === 'hi' ? 'महत्वपूर्ण प्राथमिक उपचार निर्देश:' : language === 'mr' ? 'महत्त्वाच्या प्रथमोपचार सूचना:' : 'Critical First-Responder Instructions:'}</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>{language === 'hi' ? 'अपना फोन चालू रखें; सीएडी ऑपरेटर और पैरामेडिक्स सीधे आपसे संपर्क कर सकते हैं।' : language === 'mr' ? 'आपला फोन चालू ठेवा; सीएडी ऑपरेटर आणि पॅरामेडिक्स थेट संपर्क साधू शकतात.' : 'Keep your phone line open; CAD operators and paramedics can reach you directly.'}</li>
              <li>{language === 'hi' ? 'गंभीर चोट या रीढ़ की हड्डी के मरीजों को खतरे के बिना न हिलाएं।' : language === 'mr' ? 'गंभीर दुखापत किंवा मणक्याच्या रुग्णांना हलवू नका.' : 'Do not move trauma or spinal injury patients unless in immediate danger.'}</li>
              <li>{language === 'hi' ? 'मरीज बेहोश होने और सांस न लेने पर तुरंत छाती पर दबाव (सीपीआर) शुरू करें।' : language === 'mr' ? 'रुग्ण बेशुद्ध असल्यास त्वरित सीपीआर सुरू करा.' : 'If the patient is unresponsive and not breathing normally, begin continuous chest compressions.'}</li>
              <li>{language === 'hi' ? 'मुख्य द्वार की लाइट जलाएं और संभव हो तो किसी को प्रवेश द्वार पर खड़ा करें।' : language === 'mr' ? 'दाराची लाईट चालू ठेवा आणि शक्य असल्यास कोणाला तरी गेटवर उभे करा.' : 'Turn on front lights and have someone wait at the street entrance if possible.'}</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <button
              onClick={() => cancelCitizenSOS(activeCitizenSOS.id)}
              className="w-full sm:w-auto px-4 py-2 rounded border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'अनुरोध रद्द करें / मरीज पहुंच गया' : language === 'mr' ? 'विनंती रद्द करा / रुग्ण पोहोचला' : 'Cancel Request / Patient Transported'}
            </button>

            <button
              onClick={() => setRole('ambulance')}
              className="w-full sm:w-auto px-4 py-2 rounded bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              {language === 'hi' ? 'अस्पताल डिस्पैच मैट्रिक्स में देखें' : language === 'mr' ? 'रुग्णालय डिस्पॅच मॅट्रिक्समध्ये पहा' : 'Monitor in Regional Hospital Dispatch Matrix'}
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
                    placeholder={language === 'hi' ? 'उदा. 9876543210' : language === 'mr' ? 'उदा. 9876543210' : 'e.g. 555-0199 / 9876543210'}
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
