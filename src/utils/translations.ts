export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface TranslationDictionary {
  // Navigation & Common
  appName: string;
  tagline: string;
  home: string;
  citizenSOS: string;
  nurseUpdate: string;
  ambulanceDispatch: string;
  erConfirmHold: string;
  adminDashboard: string;
  languageSelect: string;
  statusOnline: string;
  statusOffline: string;
  soundOn: string;
  soundMuted: string;
  backToHome: string;

  // Header & Roles
  roleCitizen: string;
  roleNurse: string;
  roleAmbulance: string;
  roleERDoctor: string;
  roleAdmin: string;

  // Home Page
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroSOSButton: string;
  heroExploreRoles: string;
  flowTitle: string;
  flowSubtitle: string;
  flowStep1Title: string;
  flowStep1Desc: string;
  flowStep2Title: string;
  flowStep2Desc: string;
  flowStep3Title: string;
  flowStep3Desc: string;
  flowStep4Title: string;
  flowStep4Desc: string;
  loginPortalTitle: string;
  loginPortalSubtitle: string;
  quickAccessAs: string;
  oneTapDemoLogin: string;

  // Citizen SOS
  voiceInputTitle: string;
  voiceInputPrompt: string;
  voiceListening: string;
  voiceSpeakNow: string;
  voiceStopListening: string;
  voiceClassifiedAs: string;
  voiceAutoConfirmText: string;
  sosEmergencyButton: string;
  confirmEmergencyDispatch: string;
  cancel: string;
  selectEmergencyType: string;
  gpsTelematics: string;
  acquiringGps: string;
  refreshLocation: string;
  activeDispatchTitle: string;
  assignedUnit: string;
  estimatedArrival: string;
  autoVerifiedIncident: string;
  paramedicPin: string;
  call911: string;
  teleTriageAudio: string;
  firstResponderInstructions: string;
  timelineSOSTriggered: string;
  timelineLocationAcquired: string;
  timelineAmbulanceAssigned: string;
  timelineHospitalSelected: string;
  timelineHospitalAccepted: string;
  timelineEnRoute: string;
  timelineArrived: string;
  timelineCompleted: string;

  // Categories
  catCardiac: string;
  catCardiacDesc: string;
  catRespiratory: string;
  catRespiratoryDesc: string;
  catTrauma: string;
  catTraumaDesc: string;
  catBurns: string;
  catBurnsDesc: string;
  catStroke: string;
  catStrokeDesc: string;

  // Nurse Screen
  nurseScreenTitle: string;
  nurseScreenSubtitle: string;
  updateBedsPrompt: string;
  wardCensus: string;
  updatedJustNow: string;
  updatedMinsAgo: string;
  staleWarning: string;
  tapToIncrement: string;
  tapToDecrement: string;
  availableBeds: string;
  totalBeds: string;
  heldBeds: string;
  hospitalDiversionToggle: string;
  onDiversion: string;
  normalIntake: string;

  // Dispatch Screen
  dispatchConsoleTitle: string;
  inVehicleMdt: string;
  triageAcuity: string;
  requiredBedType: string;
  requiredSpecialties: string;
  matchingHospitals: string;
  holdBed120s: string;
  holdingActive: string;
  navigateGoogleMaps: string;
  dataFreshness: string;
  erLoad: string;
  travelEta: string;

  // ER Confirm Hold Screen
  erStationTitle: string;
  incomingAmbulance: string;
  holdCountdownTitle: string;
  holdSecondsRemaining: string;
  acceptHoldButton: string;
  rejectHoldButton: string;
  heldBedConfirmed: string;
  autoCascadeNextHospital: string;
  patientVitals: string;

  // Omnidimension Voice Agent
  voiceAgentTitle: string;
  voiceAgentSubtitle: string;
  askAnything: string;
  askVoicePrompt: string;
  voiceAgentPlaceholder: string;
  sendQuestion: string;
  connectingAgent: string;
  suggestedQuestions: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'VitaRoute',
    tagline: 'Emergency Hospital Bed Allocation & Ambulance Dispatch',
    home: 'Home',
    citizenSOS: 'Citizen SOS',
    nurseUpdate: 'Nurse Bed Update',
    ambulanceDispatch: 'Ambulance Dispatch',
    erConfirmHold: 'Confirm ER & Hold',
    adminDashboard: 'Command Admin',
    languageSelect: 'Language',
    statusOnline: 'Operational',
    statusOffline: 'Offline Cache Active',
    soundOn: 'Audio Chimes Active',
    soundMuted: 'Muted',
    backToHome: 'Back to Home',

    roleCitizen: 'Emergency Citizen / Patient',
    roleNurse: 'Ward Staff Nurse',
    roleAmbulance: 'Ambulance Paramedic Unit',
    roleERDoctor: 'Emergency Room Physician',
    roleAdmin: 'EMS Regional Coordinator',

    heroTitle: 'Emergency Hospital Bed Allocation',
    heroHighlight: 'In Seconds, Not Minutes.',
    heroSubtitle: 'Connecting 1-tap citizen SOS calls, 10-second nurse ward bed census updates, and 120-second ER confirm-and-hold guarantees.',
    heroSOSButton: '🚨 SOS Emergency Call',
    heroExploreRoles: 'Open Hospital Role Portal',
    flowTitle: 'Life-Saving Emergency Pipeline',
    flowSubtitle: 'How VitaRoute coordinates emergencies from bystander call to bedside admission',
    flowStep1Title: '1. Citizen Voice & SOS',
    flowStep1Desc: 'Citizen speaks emergency in native language or taps SOS with instant GPS coordinates and verification PIN.',
    flowStep2Title: '2. 10s Nurse Bed Updates',
    flowStep2Desc: 'Floor nurses update ward counts with a single tap on cheap mobile phones. Zero bloated EHR menus.',
    flowStep3Title: '3. Multi-Constraint CAD Match',
    flowStep3Desc: 'Ambulance CAD ranks hospitals by clinical specialty, actual road driving ETA, bed stock, and data freshness.',
    flowStep4Title: '4. 120s Confirm & Hold',
    flowStep4Desc: 'ER doctor accepts within 2 minutes. Bed is reserved before arrival. Rejections automatically failover to next hospital.',
    loginPortalTitle: 'Emergency Role Portal & Fast-Fill Logins',
    loginPortalSubtitle: 'Select a clinical role to test real-time emergency workflows:',
    quickAccessAs: 'Quick Access As',
    oneTapDemoLogin: '1-Tap Clinical Role Access',

    voiceInputTitle: 'AI Emergency Voice Assistant',
    voiceInputPrompt: 'Speak your emergency condition in English, Hindi, or Marathi...',
    voiceListening: 'Listening to your emergency condition...',
    voiceSpeakNow: 'Tap microphone and describe what happened',
    voiceStopListening: 'Stop Listening & Analyze',
    voiceClassifiedAs: 'Emergency Classified As:',
    voiceAutoConfirmText: 'Auto-confirming emergency dispatch in',
    sosEmergencyButton: '🚨 CONFIRM SOS DISPATCH',
    confirmEmergencyDispatch: 'Confirm Immediate Emergency Dispatch?',
    cancel: 'Cancel',
    selectEmergencyType: 'Select Emergency Classification:',
    gpsTelematics: 'Dispatch GPS Telematics',
    acquiringGps: 'Acquiring high-accuracy GPS signal...',
    refreshLocation: 'Refresh GPS Location',
    activeDispatchTitle: 'Ambulance Dispatched & En Route',
    assignedUnit: 'Assigned Ambulance Unit',
    estimatedArrival: 'Estimated Arrival',
    autoVerifiedIncident: 'Auto-Verified Incident Record',
    paramedicPin: 'Paramedic On-Scene Verification PIN',
    call911: 'Call 911 / 108 Emergency',
    teleTriageAudio: 'Connect CAD Tele-Triage Audio',
    firstResponderInstructions: 'Critical First-Responder Instructions:',
    timelineSOSTriggered: 'SOS Emergency Triggered',
    timelineLocationAcquired: 'GPS Telematics Acquired',
    timelineAmbulanceAssigned: 'Ambulance Unit Dispatched',
    timelineHospitalSelected: 'Optimal Hospital Matched',
    timelineHospitalAccepted: 'ER Bay Reserved & Confirmed',
    timelineEnRoute: 'Ambulance En Route',
    timelineArrived: 'Paramedics Arrived On Scene',
    timelineCompleted: 'Patient Admitted to Bed',

    catCardiac: 'Cardiac Arrest / Chest Pain',
    catCardiacDesc: 'Severe crushing chest pain, radiating pain, arrhythmia, unconsciousness',
    catRespiratory: 'Severe Respiratory Distress',
    catRespiratoryDesc: 'Severe breathlessness, SpO2 under 85%, asthma crisis, choking',
    catTrauma: 'Accident / Severe Trauma',
    catTraumaDesc: 'Vehicle collision, heavy bleeding, compound fractures, head trauma',
    catBurns: 'Severe Burns / Scalds',
    catBurnsDesc: 'Extensive flame burns, chemical exposure, electrical contact',
    catStroke: 'Acute Stroke Symptoms',
    catStrokeDesc: 'Facial drooping, arm weakness, slurred speech, sudden loss of vision',

    nurseScreenTitle: 'Ward Nurse 10-Second Bed Census',
    nurseScreenSubtitle: 'One-tap tactile updates designed for high-stress shifts and budget smartphones',
    updateBedsPrompt: 'Tap (+) to admit or (-) to discharge beds in your ward:',
    wardCensus: 'Ward Capacity Census',
    updatedJustNow: 'Updated just now',
    updatedMinsAgo: 'Updated {mins}m ago',
    staleWarning: '⚠ Data is over 30 mins old. Please tap to re-verify.',
    tapToIncrement: 'Admit Patient (+1)',
    tapToDecrement: 'Discharge / Clear Bed (-1)',
    availableBeds: 'Available Now',
    totalBeds: 'Total Beds',
    heldBeds: 'Currently Held',
    hospitalDiversionToggle: 'Facility Emergency Diversion Status:',
    onDiversion: 'ON DIVERSION (ER Full)',
    normalIntake: 'Normal Emergency Intake',

    dispatchConsoleTitle: 'Regional CAD Ambulance Dispatch',
    inVehicleMdt: 'In-Vehicle Rugged MDT Tablet',
    triageAcuity: 'Patient Triage Acuity',
    requiredBedType: 'Required Resuscitation Bed Type',
    requiredSpecialties: 'Required Clinical Specialties',
    matchingHospitals: 'Ranked Hospital Recommendations',
    holdBed120s: 'Request 120s Hold',
    holdingActive: '120s Hold Active...',
    navigateGoogleMaps: 'Navigate to Hospital (Google Maps)',
    dataFreshness: 'Bed Data Freshness',
    erLoad: 'ER Intake Load',
    travelEta: 'Road Travel ETA',

    erStationTitle: 'Emergency Department Receiving Station',
    incomingAmbulance: 'Urgent Inbound Ambulance Transfer Request',
    holdCountdownTitle: '120-Second Reservation Countdown',
    holdSecondsRemaining: 'Seconds Remaining to Accept',
    acceptHoldButton: 'ACCEPT BED HOLD & HOLD BAY',
    rejectHoldButton: 'REJECT / REDIRECT TO NEXT HOSPITAL',
    heldBedConfirmed: 'Resuscitation Bay Confirmed & Held',
    autoCascadeNextHospital: 'If unconfirmed within 120 seconds, VitaRoute automatically cascades to the next best facility.',
    patientVitals: 'Patient Field Vitals & Trauma Summary',

    voiceAgentTitle: 'Omnidimension Emergency Voice Agent',
    voiceAgentSubtitle: 'Real-time conversational medical coordination assistant',
    askAnything: 'Ask VitaRoute Voice Assistant...',
    askVoicePrompt: 'Ask about available ICU beds, closest hospital, triage protocols, or hold status',
    voiceAgentPlaceholder: 'Ask in English, Hindi, or Marathi (e.g. "Where is the nearest cardiac ICU bed?")...',
    sendQuestion: 'Ask Agent',
    connectingAgent: 'Connecting to Omnidimension Voice Agent...',
    suggestedQuestions: 'Quick Inquiries:',
  },

  hi: {
    appName: 'वीटारूट (VitaRoute)',
    tagline: 'आपातकालीन अस्पताल बेड आवंटन और एम्बुलेंस प्रेषण',
    home: 'होम',
    citizenSOS: 'नागरिक एसओएस (SOS)',
    nurseUpdate: 'नर्स बेड अपडेट',
    ambulanceDispatch: 'एम्बुलेंस डिस्पैच',
    erConfirmHold: 'ईआर पुष्टि और होल्ड',
    adminDashboard: 'कमांड एडमिन',
    languageSelect: 'भाषा',
    statusOnline: 'प्रणाली सक्रिय',
    statusOffline: 'ऑफ़लाइन कैश सक्रिय',
    soundOn: 'ध्वनि संकेत सक्रिय',
    soundMuted: 'मौन',
    backToHome: 'होम पर वापस जाएं',

    roleCitizen: 'आपातकालीन नागरिक / मरीज',
    roleNurse: 'वार्ड स्टाफ नर्स',
    roleAmbulance: 'एम्बुलेंस पैरामेडिक यूनिट',
    roleERDoctor: 'आपातकालीन चिकित्सा अधिकारी',
    roleAdmin: 'ईएमएस क्षेत्रीय समन्वयक',

    heroTitle: 'आपातकालीन अस्पताल बेड आवंटन',
    heroHighlight: 'मिनटों में नहीं, सेकंडों में।',
    heroSubtitle: '1-टैप नागरिक एसओएस, 10-सेकंड नर्स वार्ड बेड अपडेट, और 120-सेकंड अस्पताल ईआर बेड होल्ड की गारंटी।',
    heroSOSButton: '🚨 आपातकालीन एसओएस (SOS)',
    heroExploreRoles: 'अस्पताल भूमिका पोर्टल खोलें',
    flowTitle: 'जीवन रक्षक आपातकालीन प्रक्रिया',
    flowSubtitle: 'नागरिक के कॉल से लेकर अस्पताल में भर्ती होने तक वीटारूट कैसे समन्वय करता है',
    flowStep1Title: '1. नागरिक वॉइस और एसओएस',
    flowStep1Desc: 'नागरिक अपनी भाषा में बोलकर या 1-टैप में तत्काल जीपीएस और सत्यापन पिन के साथ एसओएस भेजते हैं।',
    flowStep2Title: '2. 10 सेकंड में नर्स बेड अपडेट',
    flowStep2Desc: 'वार्ड नर्स सामान्य मोबाइल फोन पर सिर्फ एक टैप से उपलब्ध बेड की संख्या तुरंत अपडेट करती हैं।',
    flowStep3Title: '3. बहु-मानदंड एम्बुलेंस मिलान',
    flowStep3Desc: 'एम्बुलेंस प्रणाली विशेषज्ञता, वास्तविक सड़क दूरी, बेड उपलब्धता और डेटा की ताजगी से सही अस्पताल चुनती है।',
    flowStep4Title: '4. 120 सेकंड में पुष्टि और होल्ड',
    flowStep4Desc: 'अस्पताल 2 मिनट में बेड रिजर्व करता है। अस्वीकार होने पर सिस्टम स्वतः अगले सर्वश्रेष्ठ अस्पताल को चुनता है।',
    loginPortalTitle: 'आपातकालीन भूमिका पोर्टल और डेमो लॉगिन',
    loginPortalSubtitle: 'वास्तविक आपातकालीन प्रक्रियाओं का परीक्षण करने के लिए एक भूमिका चुनें:',
    quickAccessAs: 'इस रूप में तुरंत प्रवेश करें',
    oneTapDemoLogin: '1-टैप चिकित्सीय भूमिका लॉगिन',

    voiceInputTitle: 'एआई आपातकालीन वॉइस सहायक',
    voiceInputPrompt: 'अपनी आपातकालीन स्थिति हिंदी, मराठी या अंग्रेजी में बोलें...',
    voiceListening: 'आपकी आपातकालीन स्थिति सुनी जा रही है...',
    voiceSpeakNow: 'माइक दबाएं और बताएं क्या हुआ है',
    voiceStopListening: 'सुनना बंद करें और विश्लेषण करें',
    voiceClassifiedAs: 'पहचानी गई आपातकालीन श्रेणी:',
    voiceAutoConfirmText: 'एम्बुलेंस प्रेषण स्वतः पुष्टि होने में शेष समय:',
    sosEmergencyButton: '🚨 आपातकालीन एसओएस की पुष्टि करें',
    confirmEmergencyDispatch: 'क्या आप तुरंत एम्बुलेंस भेजना चाहते हैं?',
    cancel: 'रद्द करें',
    selectEmergencyType: 'आपातकाल का प्रकार चुनें:',
    gpsTelematics: 'प्रेषण जीपीएस टेलीमैटिक्स',
    acquiringGps: 'सटीक जीपीएस सिग्नल प्राप्त किया जा रहा है...',
    refreshLocation: 'जीपीएस स्थान रीफ्रेश करें',
    activeDispatchTitle: 'एम्बुलेंस रवाना हो चुकी है',
    assignedUnit: 'आवंटित एम्बुलेंस यूनिट',
    estimatedArrival: 'पहुंचने का अनुमानित समय',
    autoVerifiedIncident: 'स्वतः-सत्यापित घटना रिकॉर्ड',
    paramedicPin: 'पैरामेडिक ऑन-सीन सत्यापन पिन (PIN)',
    call911: '108 / 112 आपातकालीन कॉल करें',
    teleTriageAudio: 'टेली-ट्राइएज ऑडियो से जुड़ें',
    firstResponderInstructions: 'प्राथमिक उपचार के महत्वपूर्ण निर्देश:',
    timelineSOSTriggered: 'एसओएस आपातकाल शुरू हुआ',
    timelineLocationAcquired: 'जीपीएस स्थान प्राप्त हुआ',
    timelineAmbulanceAssigned: 'एम्बुलेंस यूनिट रवाना',
    timelineHospitalSelected: 'सर्वोत्तम अस्पताल का चयन',
    timelineHospitalAccepted: 'ईआर बेड सुरक्षित और आरक्षित',
    timelineEnRoute: 'एम्बुलेंस रास्ते में है',
    timelineArrived: 'पैरामेडिक घटनास्थल पर पहुंचे',
    timelineCompleted: 'मरीज को अस्पताल बेड में भर्ती किया गया',

    catCardiac: 'हार्ट अटैक / छाती में दर्द',
    catCardiacDesc: 'छाती में तेज दबाव, दर्द का हाथ/जबड़े में फैलना, पसीना, सांस लेने में परेशानी',
    catRespiratory: 'गंभीर सांस की तकलीफ',
    catRespiratoryDesc: 'सांस फूलना, ऑक्सीजन का 85% से नीचे गिरना, दम घुटना',
    catTrauma: 'सड़क दुर्घटना / गंभीर चोट',
    catTraumaDesc: 'गाड़ी की टक्कर, अत्यधिक रक्तस्राव, सिर की चोट, फ्रैक्चर',
    catBurns: 'आग या केमिकल से जलना',
    catBurnsDesc: 'गंभीर रूप से जलना, केमिकल का संपर्क, बिजली का झटका',
    catStroke: 'लकवा / स्ट्रोक के लक्षण',
    catStrokeDesc: 'मुंह का टेढ़ा होना, हाथ-पैर में कमजोरी, आवाज लड़खड़ाना',

    nurseScreenTitle: 'वार्ड नर्स 10-सेकंड बेड गणना',
    nurseScreenSubtitle: 'व्यस्त अस्पताल शिफ्ट और सामान्य स्मार्टफोन के लिए डिजाइन किया गया 1-टैप सिस्टम',
    updateBedsPrompt: 'वार्ड में बेड जोड़ने (+) या खाली करने (-) के लिए टैप करें:',
    wardCensus: 'वार्ड बेड स्थिति',
    updatedJustNow: 'अभी-अभी अपडेट हुआ',
    updatedMinsAgo: '{mins} मिनट पहले अपडेट हुआ',
    staleWarning: '⚠ डेटा 30 मिनट से अधिक पुराना है। कृपया पुनः सत्यापित करें।',
    tapToIncrement: 'मरीज भर्ती करें (+1)',
    tapToDecrement: 'मरीज डिस्चार्ज / बेड खाली (-1)',
    availableBeds: 'अभी उपलब्ध',
    totalBeds: 'कुल बेड',
    heldBeds: 'वर्तमान में आरक्षित',
    hospitalDiversionToggle: 'अस्पताल आपातकालीन डायवर्जन स्थिति:',
    onDiversion: 'डायवर्जन पर (ईआर पूरी तरह भरा है)',
    normalIntake: 'सामान्य आपातकालीन प्रवेश',

    dispatchConsoleTitle: 'क्षेत्रीय सीएडी एम्बुलेंस डिस्पैच',
    inVehicleMdt: 'वाहन में लगा एमडीटी टैबलेट',
    triageAcuity: 'मरीज की गंभीरता (ट्राइएज)',
    requiredBedType: 'आवश्यक अस्पताल बेड का प्रकार',
    requiredSpecialties: 'आवश्यक विशेषज्ञता (Specialties)',
    matchingHospitals: 'रैंक किए गए उपयुक्त अस्पताल',
    holdBed120s: '120 सेकंड होल्ड अनुरोध भेजें',
    holdingActive: '120 सेकंड होल्ड सक्रिय है...',
    navigateGoogleMaps: 'अस्पताल का रास्ता देखें (गूगल मैप्स)',
    dataFreshness: 'डेटा की ताजगी',
    erLoad: 'ईआर पर वर्तमान लोड',
    travelEta: 'सड़क मार्ग से समय',

    erStationTitle: 'इमरजेंसी रूम (ER) रिसेप्शन डेस्क',
    incomingAmbulance: 'आगमन पर एम्बुलेंस बेड आरक्षण अनुरोध',
    holdCountdownTitle: '120-सेकंड बेड आरक्षण उल्टी गिनती',
    holdSecondsRemaining: 'स्वीकार करने के लिए शेष सेकंड',
    acceptHoldButton: 'बेड होल्ड स्वीकार करें और बे सुरक्षित रखें',
    rejectHoldButton: 'अस्वीकार करें / अगले अस्पताल को भेजें',
    heldBedConfirmed: 'मरीज के लिए बेड सफलतापूर्वक आरक्षित कर लिया गया',
    autoCascadeNextHospital: 'यदि 120 सेकंड में पुष्टि नहीं होती, तो वीटारूट स्वतः अगले अस्पताल को ऑफर करता है।',
    patientVitals: 'मरीज के वाइटल लक्षण और आपातकालीन सारांश',

    voiceAgentTitle: 'ओम्नीडायमेंशन (Omnidimension) वॉइस एजेंट',
    voiceAgentSubtitle: 'रियल-टाइम संवादात्मक आपातकालीन चिकित्सा सहायक',
    askAnything: 'वीटारूट वॉइस एजेंट से कुछ भी पूछें...',
    askVoicePrompt: 'आईसीयू बेड, निकटतम अस्पताल, या प्रक्रिया के बारे में पूछें',
    voiceAgentPlaceholder: 'हिंदी, मराठी या अंग्रेजी में पूछें (उदा: "निकटतम कार्डियक आईसीयू बेड कहाँ है?")...',
    sendQuestion: 'पूछें',
    connectingAgent: 'ओम्नीडायमेंशन वॉइस एजेंट से जोड़ा जा रहा है...',
    suggestedQuestions: 'त्वरित प्रश्न:',
  },

  mr: {
    appName: 'व्हिटारूट (VitaRoute)',
    tagline: 'तातडीचे रुग्णालय बेड वाटप आणि रुग्णवाहिका डिस्पॅच',
    home: 'मुख्यपृष्ठ',
    citizenSOS: 'नागरिक एसओएस (SOS)',
    nurseUpdate: 'नर्स बेड अपडेट',
    ambulanceDispatch: 'रुग्णवाहिका डिस्पॅच',
    erConfirmHold: 'ईआर खात्री आणि होल्ड',
    adminDashboard: 'कमांड ॲडमिन',
    languageSelect: 'भाषा',
    statusOnline: 'प्रणाली कार्यरत',
    statusOffline: 'ऑफलाइन कॅशे कार्यरत',
    soundOn: 'ध्वनी संकेत सुरू',
    soundMuted: 'मौन',
    backToHome: 'मुख्यपृष्ठावर परत जा',

    roleCitizen: 'आपत्कालीन नागरिक / रुग्ण',
    roleNurse: 'वॉर्ड स्टाफ नर्स',
    roleAmbulance: 'रुग्णवाहिका पॅरामेडिक युनिट',
    roleERDoctor: 'तातडीचे वैद्यकीय अधिकारी',
    roleAdmin: 'ईएमएस प्रादेशिक समन्वयक',

    heroTitle: 'तातडीचे रुग्णालय बेड वाटप',
    heroHighlight: 'मिनिटांत नाही, सेकंदात.',
    heroSubtitle: '1-टॅप नागरिक एसओएस, 10-सेकंद नर्स वॉर्ड बेड अपडेट आणि 120-सेकंद ईआर बेड आरक्षण हमी.',
    heroSOSButton: '🚨 आणीबाणी एसओएस (SOS)',
    heroExploreRoles: 'रुग्णालय भूमिका पोर्टल उघडा',
    flowTitle: 'जीवनरक्षक आणीबाणी कार्यप्रणाली',
    flowSubtitle: 'नागरिकांच्या आणीबाणी कॉल्सपासून ते रुग्णालयात दाखल होईपर्यंत व्हिटारूट कसा समन्वय साधतो',
    flowStep1Title: '1. नागरिक व्हॉइस आणि एसओएस',
    flowStep1Desc: 'नागरिक आपल्या भाषेत बोलून किंवा 1-टॅपमध्ये त्वरित जीपीएस आणि पिनसह एसओएस पाठवतात.',
    flowStep2Title: '2. 10 सेकंदात नर्स बेड अपडेट',
    flowStep2Desc: 'वॉर्ड नर्स साध्या मोबाईलवर फक्त एका टॅपमध्ये उपलब्ध बेड्सची संख्या त्वरित अद्ययावत करतात.',
    flowStep3Title: '3. बहु-निकष रुग्णवाहिका जुळणी',
    flowStep3Desc: 'रुग्णवाहिका प्रणाली तज्ज्ञता, रस्त्यावरील अंतर, बेड उपलब्धता आणि माहितीच्या ताजेपणावरून योग्य रुग्णालय निवडते.',
    flowStep4Title: '4. 120 सेकंदात खात्री आणि होल्ड',
    flowStep4Desc: 'रुग्णालय 2 मिनिटांत बेड आरक्षित करते. नकार आल्यास प्रणाली आपोआप पुढचे सर्वोत्तम रुग्णालय निवडते.',
    loginPortalTitle: 'आणीबाणी भूमिका पोर्टल आणि डेमो लॉगिन',
    loginPortalSubtitle: 'प्रत्यक्ष आणीबाणी कार्यप्रणालीची चाचणी घेण्यासाठी एक भूमिका निवडा:',
    quickAccessAs: 'या भूमिकेत थेट प्रवेश करा',
    oneTapDemoLogin: '1-टॅप वैद्यकीय भूमिका लॉगिन',

    voiceInputTitle: 'एआय आणीबाणी व्हॉइस सहाय्यक',
    voiceInputPrompt: 'तुमची आणीबाणी स्थिती मराठी, हिंदी किंवा इंग्रजीत बोला...',
    voiceListening: 'तुमची आणीबाणी स्थिती ऐकली जात आहे...',
    voiceSpeakNow: 'माईक दाबा आणि काय घडले ते सांगा',
    voiceStopListening: 'ऐकणे थांबवा आणि विश्लेषण करा',
    voiceClassifiedAs: 'ओळखलेला आणीबाणीचा प्रकार:',
    voiceAutoConfirmText: 'रुग्णवाहिका आपोआप पाठवण्यासाठी उर्वरित वेळ:',
    sosEmergencyButton: '🚨 आणीबाणी एसओएसची पुष्टी करा',
    confirmEmergencyDispatch: 'तुम्हाला त्वरित रुग्णवाहिका बोलवायची आहे का?',
    cancel: 'रद्द करा',
    selectEmergencyType: 'आणीबाणीचा प्रकार निवडा:',
    gpsTelematics: 'डिस्पॅच जीपीएस टेलिमॅटिक्स',
    acquiringGps: 'अचूक जीपीएस सिग्नल शोधत आहे...',
    refreshLocation: 'जीपीएस स्थान रिफ्रेश करा',
    activeDispatchTitle: 'रुग्णवाहिका रवाना झाली आहे',
    assignedUnit: 'नेमलेली रुग्णवाहिका युनिट',
    estimatedArrival: 'पोहोचण्याची अंदाजे वेळ',
    autoVerifiedIncident: 'स्वयं-सत्यापित घटना नोंद',
    paramedicPin: 'पॅरामेडिक ऑन-सीन पडताळणी पिन (PIN)',
    call911: '108 / 112 आणीबाणी कॉल करा',
    teleTriageAudio: 'टेलि-ट्रायज ऑडिओशी कनेक्ट करा',
    firstResponderInstructions: 'तातडीचे प्राथमिक उपचार निर्देश:',
    timelineSOSTriggered: 'एसओएस आणीबाणी सुरू झाली',
    timelineLocationAcquired: 'जीपीएस स्थान प्राप्त झाले',
    timelineAmbulanceAssigned: 'रुग्णवाहिका युनिट रवाना',
    timelineHospitalSelected: 'सर्वोत्तम रुग्णालय निवडले',
    timelineHospitalAccepted: 'ईआर बेड सुरक्षित आणि आरक्षित',
    timelineEnRoute: 'रुग्णवाहिका रस्त्यात आहे',
    timelineArrived: 'पॅरामेडिक घटनास्थळी पोहोचले',
    timelineCompleted: 'रुग्णाला बेडवर दाखल करण्यात आले',

    catCardiac: 'हार्ट अटॅक / छातीत दुखणे',
    catCardiacDesc: 'छातीत तीव्र वेदना, डाव्या हातात कळ, घाम येणे, अस्वस्थता',
    catRespiratory: 'श्वास घेण्यास तीव्र त्रास',
    catRespiratoryDesc: 'श्वास गुदमरणे, ऑक्सिजन 85% पेक्षा कमी होणे, दम्याचा झटका',
    catTrauma: 'रस्ता अपघात / गंभीर दुखापत',
    catTraumaDesc: 'वाहनाची धडक, अति रक्तस्त्राव, डोक्याला मार, हाड मोडणे',
    catBurns: 'आग किंवा केमिकलने भाजणे',
    catBurnsDesc: 'गंभीरपणे भाजणे, ॲसिड/केमिकल संपर्क, विजेचा धक्का',
    catStroke: 'पक्षाघात / स्ट्रोकची लक्षणे',
    catStrokeDesc: 'तोंड वाकडे होणे, हात-पाय लुळे पडणे, बोलताना अडखळणे',

    nurseScreenTitle: 'वॉर्ड नर्स 10-सेकंद बेड गणना',
    nurseScreenSubtitle: 'धावपळीच्या ड्युटीसाठी आणि सामान्य स्मार्टफोनसाठी तयार केलेली 1-टॅप प्रणाली',
    updateBedsPrompt: 'वॉर्डमधील बेड वाढवण्यासाठी (+) किंवा कमी करण्यासाठी (-) टॅप करा:',
    wardCensus: 'वॉर्ड बेड सद्यस्थिती',
    updatedJustNow: 'आत्ताच अपडेट केले',
    updatedMinsAgo: '{mins} मिनिटांपूर्वी अपडेट केले',
    staleWarning: '⚠ माहिती 30 मिनिटांपेक्षा जुनी आहे. कृपया पुन्हा तपासा.',
    tapToIncrement: 'रुग्ण दाखल करा (+1)',
    tapToDecrement: 'रुग्ण डिस्चार्ज / बेड मोकळा करा (-1)',
    availableBeds: 'आत्ता उपलब्ध',
    totalBeds: 'एकूण बेड्स',
    heldBeds: 'सध्या आरक्षित बेड्स',
    hospitalDiversionToggle: 'रुग्णालय डायव्हर्शन स्थिती:',
    onDiversion: 'डायव्हर्शनवर (ईआर पूर्णपणे भरले आहे)',
    normalIntake: 'सामान्य रुग्ण प्रवेश सुरू',

    dispatchConsoleTitle: 'प्रादेशिक सीएडी रुग्णवाहिका डिस्पॅच',
    inVehicleMdt: 'गाडीतील एमडीटी टॅब्लेट स्क्रीन',
    triageAcuity: 'रुग्णाची तीव्रता (ट्रायज)',
    requiredBedType: 'आवश्यक रुग्णालय बेडचा प्रकार',
    requiredSpecialties: 'आवश्यक वैद्यकीय तज्ज्ञता',
    matchingHospitals: 'क्रमवारीनुसार निवडलेली रुग्णालये',
    holdBed120s: '120 सेकंद होल्ड विनंती पाठवा',
    holdingActive: '120 सेकंद होल्ड सुरू आहे...',
    navigateGoogleMaps: 'रुग्णालयाचा रस्ता पहा (गुगल मॅप्स)',
    dataFreshness: 'माहितीचा ताजेपणा',
    erLoad: 'ईआरवरील सध्याचा ताण',
    travelEta: 'रस्त्यावरील प्रवासाची वेळ',

    erStationTitle: 'इमर्जन्सी रूम (ER) रिसेप्शन डेस्क',
    incomingAmbulance: 'येणाऱ्या रुग्णवाहिकेची बेड आरक्षण विनंती',
    holdCountdownTitle: '120-सेकंद बेड आरक्षण उलटी गिनती',
    holdSecondsRemaining: 'स्वीकारण्यासाठी शिल्लक सेकंद',
    acceptHoldButton: 'बेड होल्ड स्वीकारा आणि बे आरक्षित करा',
    rejectHoldButton: 'नकार द्या / पुढील रुग्णालयाकडे पाठवा',
    heldBedConfirmed: 'रुग्णासाठी बेड यशस्वीपणे आरक्षित करण्यात आला',
    autoCascadeNextHospital: '120 सेकंदात खात्री न झाल्यास, व्हिटारूट आपोआप पुढील सर्वोत्तम रुग्णालयाची निवड करतो.',
    patientVitals: 'रुग्णाची वैद्यकीय माहिती व सारांश',

    voiceAgentTitle: 'ओम्नीडायमेन्शन (Omnidimension) व्हॉइस एजंट',
    voiceAgentSubtitle: 'थेट संवादात्मक आपत्कालीन वैद्यकीय सहाय्यक',
    askAnything: 'व्हिटारूट व्हॉइस एजंटला काहीही विचारा...',
    askVoicePrompt: 'आयसीयू बेड्स, जवळचे रुग्णालय किंवा नियमांबद्दल विचारा',
    voiceAgentPlaceholder: 'मराठी, हिंदी किंवा इंग्रजीत विचारा (उदा: "जवळचे कार्डियाक आयसीयू बेड कुठे आहे?")...',
    sendQuestion: 'विचारा',
    connectingAgent: 'ओम्नीडायमेन्शन व्हॉइस एजंटशी जोडत आहे...',
    suggestedQuestions: 'जलद प्रश्न:',
  },
};

export const getTranslation = (lang: SupportedLanguage = 'en'): TranslationDictionary => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};
