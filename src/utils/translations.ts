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
  signOut: string;
  emergencyCoordination: string;

  // Header & Roles
  roleCitizen: string;
  roleNurse: string;
  roleAmbulance: string;
  roleERDoctor: string;
  roleAdmin: string;

  // Home Page Hero & Nav
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroSOSButton: string;
  heroExploreRoles: string;
  howItWorks: string;
  clinicalScenarios: string;
  signIn: string;
  launchDispatch: string;
  testNurseBeds: string;
  openParamedicDemo: string;
  nurseBedUpdateStat: string;
  constraintsStat: string;
  holdTimerStat: string;
  autoRerouteStat: string;

  // Pipeline Steps (Transparent Route Hero)
  pipelineStep1: string;
  pipelineStep2: string;
  pipelineStep3: string;
  pipelineStep4: string;

  // The 3 Core Parts of VitaRoute
  partsTitle: string;
  partsSubtitle: string;
  part1Title: string;
  part1Desc: string;
  part2Title: string;
  part2Desc: string;
  part3Title: string;
  part3Desc: string;

  // Flow Section
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
  dutyChargeNurse: string;
  wardBedCounter: string;
  syncAllBedData: string;
  syncedToDispatch: string;
  offlineQueueActive: string;
  pwaCaching: string;
  hospitalEhrFeed: string;
  activeConnected: string;
  ehrDesc: string;
  testEhrFeed: string;
  admitPatientBtn: string;
  dischargePatientBtn: string;
  wardOverrides: string;
  allFullBtn: string;
  resetBenchmarkBtn: string;
  bedFilled: string;
  bedFree: string;
  saved: string;
  full0Beds: string;
  bedsLeft: string;
  occupied: string;

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
  consoleModeLabel: string;
  consoleModeDesc: string;
  dispatchConsoleTab: string;
  inVehicleMdtTab: string;
  dispatchHospitalMatchTitle: string;
  dispatchHospitalMatchSubtitle: string;
  quickPresetsLabel: string;
  ambulanceIdLabel: string;
  triageAcuityLabel: string;
  requiredBedTypeLabel: string;
  ambulanceLocationLabel: string;
  useSectorBtn: string;
  useLiveGpsBtn: string;
  locatingGpsText: string;
  refreshGpsText: string;
  scanOsmApiBtn: string;
  queryingOsmText: string;
  activeSpecialtiesCount: string;
  patientFieldNoteLabel: string;
  recHospitalsFor: string;
  recHospitalsSubtitle: string;
  freshnessFresh: string;
  freshnessModerate: string;
  freshnessStale: string;
  staleDataNote: string;
  liveDataNote: string;
  metricBedMatch: string;
  metricSpecialties: string;
  metricTravelTime: string;
  metricFreshness: string;
  metricErStrain: string;
  noSpecialtyFilter: string;
  specialtyMatch100: string;
  missingSpecialtyCount: string;
  requestBedHoldBtn: string;
  noBedToHoldBtn: string;
  viewHoldBoardBtn: string;
  bestMatchBadge: string;
  bedsFreeText: string;
  heldByEmsText: string;
  holdWindow120Title: string;
  rejectDivertBtn: string;
  acceptLockBedBtn: string;
  bedHeldReservationLocked: string;
  viewInHoldScreen: string;
  backToRecommendations: string;
  hospitalDidNotConfirm: string;

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
  receivingStationHeader: string;
  simulateIncoming: string;
  incomingHoldAlert: string;
  window120Badge: string;
  reservationTarget: string;
  bedRequestSentTo: string;
  ambulanceCallSign: string;
  estimatedArrivalLabel: string;
  hospitalConfirmNotice: string;

  // Bed Types
  bedIcuVent: string;
  bedCardiac: string;
  bedOxygen: string;
  bedBurns: string;
  bedTrauma: string;

  // Voice Agent
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
    signOut: 'Sign Out',
    emergencyCoordination: 'Emergency Bed Coordination',

    roleCitizen: 'Emergency Citizen / Patient',
    roleNurse: 'Ward Staff Nurse',
    roleAmbulance: 'Ambulance Paramedic Unit',
    roleERDoctor: 'Emergency Room Physician',
    roleAdmin: 'EMS Regional Coordinator',

    heroTitle: 'Get critical patients to the right bed.',
    heroHighlight: 'Right now.',
    heroSubtitle: 'An ambulance crew with a patient in cardiac arrest or respiratory failure cannot afford to drive 20 minutes to an ER with no open ICU beds. VitaRoute matches patient needs with live bed counts, road travel times, and guarantees a 2-minute bed hold.',
    heroSOSButton: '🚨 SOS Emergency Call',
    heroExploreRoles: 'Open Hospital Role Portal',
    howItWorks: 'How It Works',
    clinicalScenarios: 'Clinical Scenarios',
    signIn: 'Sign In',
    launchDispatch: 'Launch Ambulance Dispatch',
    testNurseBeds: 'Test 10s Nurse Bed Counter',
    openParamedicDemo: 'Paramedic Demo',
    nurseBedUpdateStat: 'Nurse Bed Update',
    constraintsStat: 'Beds, ETA, Freshness & Load',
    holdTimerStat: 'ER Bed Hold Timer',
    autoRerouteStat: 'Cascading Re-route on Reject',

    pipelineStep1: '1. Citizen SOS Voice',
    pipelineStep2: '2. Live GPS & Road CAD',
    pipelineStep3: '3. 120s ER Hold Window',
    pipelineStep4: '4. ICU Bed Reserved',

    partsTitle: 'The 3 Parts of VitaRoute',
    partsSubtitle: 'Designed to solve the real bottleneck in emergency room admissions: reliable information in real time.',
    part1Title: 'Part 1: 10-Second Bed Updates',
    part1Desc: 'Ward nurses update available beds in seconds with 1 tap per bed type on standard smartphones. Zero bloated EHR forms.',
    part2Title: 'Part 2: Multi-Constraint CAD Match',
    part2Desc: 'Takes patient clinical needs and live location, ranking hospitals by specialty match, real road travel time, data freshness, and ER intake load.',
    part3Title: 'Part 3: 120s Confirm & Hold Window',
    part3Desc: 'Receiving ER accepts or rejects within 2 minutes. The bed is held for the ambulance, and next-best hospital is offered automatically on reject or timeout.',

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
    dutyChargeNurse: 'Duty Charge Nurse',
    wardBedCounter: 'Ward Bed Counter',
    syncAllBedData: 'Sync All Bed Data',
    syncedToDispatch: 'Synced to Dispatch!',
    offlineQueueActive: 'Ward Offline Queue Active: Operating without network signal.',
    pwaCaching: 'PWA Caching',
    hospitalEhrFeed: 'Hospital EHR Feed (HL7 v2 / FHIR ADT):',
    activeConnected: 'Active & Connected',
    ehrDesc: 'Bed inventory adjusts automatically upon ADT admission or discharge events.',
    testEhrFeed: 'Test EHR Feed:',
    admitPatientBtn: '+ Admit Patient',
    dischargePatientBtn: '- Discharge Patient',
    wardOverrides: 'Ward Overrides:',
    allFullBtn: 'All Full (0)',
    resetBenchmarkBtn: 'Reset Benchmark',
    bedFilled: 'Bed Filled',
    bedFree: 'Bed Free',
    saved: 'Saved',
    full0Beds: 'Full (0 Beds)',
    bedsLeft: 'Left',
    occupied: 'Occupied',

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
    consoleModeLabel: 'Console Mode:',
    consoleModeDesc: 'Ambulance Dispatch & Road Routing',
    dispatchConsoleTab: 'Dispatch Console',
    inVehicleMdtTab: 'In-Vehicle Tablet (MDT)',
    dispatchHospitalMatchTitle: 'Ambulance Dispatch & Hospital Matching',
    dispatchHospitalMatchSubtitle: 'Ranks hospitals by actual road travel time, bed availability, surgical teams, and ER crowding.',
    quickPresetsLabel: 'Quick Clinical Presets:',
    ambulanceIdLabel: 'Ambulance ID / Unit',
    triageAcuityLabel: 'Triage Acuity',
    requiredBedTypeLabel: 'Required Bed Type',
    ambulanceLocationLabel: 'Ambulance Location',
    useSectorBtn: 'Use Sector',
    useLiveGpsBtn: 'Use Live GPS',
    locatingGpsText: 'Locating...',
    refreshGpsText: 'Refresh GPS',
    scanOsmApiBtn: 'Scan Nearby Area (OSM API)',
    queryingOsmText: 'Querying OpenStreetMap...',
    activeSpecialtiesCount: 'specialty criteria active',
    patientFieldNoteLabel: 'Patient Complaint / Field Note:',
    recHospitalsFor: 'Recommended Hospitals: Matched for',
    recHospitalsSubtitle: 'Sorted by live bed inventory, specialty compatibility, GPS road distance, data freshness, and ER load.',
    freshnessFresh: '<15 min (Fresh)',
    freshnessModerate: '15-45 min',
    freshnessStale: '>45 min (Stale)',
    staleDataNote: '(Stale data)',
    liveDataNote: '(Live)',
    metricBedMatch: '1. Bed Match',
    metricSpecialties: '2. Specialties',
    metricTravelTime: '3. Travel Time',
    metricFreshness: '4. Data Freshness',
    metricErStrain: '5. ER Strain',
    noSpecialtyFilter: 'No specialty filter',
    specialtyMatch100: '100% Match',
    missingSpecialtyCount: 'Missing specialty',
    requestBedHoldBtn: 'Request Bed Hold',
    noBedToHoldBtn: 'No Bed to Hold',
    viewHoldBoardBtn: 'View Bed Hold Board',
    bestMatchBadge: '#1 Recommended Match',
    bedsFreeText: 'beds free',
    heldByEmsText: 'held by EMS',
    holdWindow120Title: '2-Minute Bed Hold Confirmation Window',
    rejectDivertBtn: 'Reject (Divert)',
    acceptLockBedBtn: 'Accept (Lock Bed)',
    bedHeldReservationLocked: 'BED HELD: RESERVATION LOCKED',
    viewInHoldScreen: 'View in Bed Hold Screen',
    backToRecommendations: 'Back to Recommendations',
    hospitalDidNotConfirm: 'Hospital did not confirm. Contacting next available hospital...',

    erStationTitle: 'Emergency Department Receiving Station',
    incomingAmbulance: 'Urgent Inbound Ambulance Transfer Request',
    holdCountdownTitle: '120-Second Reservation Countdown',
    holdSecondsRemaining: 'Seconds Remaining to Accept',
    acceptHoldButton: 'ACCEPT BED HOLD & HOLD BAY',
    rejectHoldButton: 'REJECT / REDIRECT TO NEXT HOSPITAL',
    heldBedConfirmed: 'Resuscitation Bay Confirmed & Held',
    autoCascadeNextHospital: 'If unconfirmed within 120 seconds, VitaRoute automatically cascades to the next best facility.',
    patientVitals: 'Patient Field Vitals & Trauma Summary',
    receivingStationHeader: 'Receiving ER Desk · Trauma Bay Coordination',
    simulateIncoming: 'Simulate Incoming Request',
    incomingHoldAlert: 'Incoming bed hold request from',
    window120Badge: '120s Confirmation Window',
    reservationTarget: 'Reservation Target:',
    bedRequestSentTo: 'Bed request sent to',
    ambulanceCallSign: 'Ambulance Call Sign:',
    estimatedArrivalLabel: 'Estimated Arrival:',
    hospitalConfirmNotice: 'Hospital receiving desk has 120 seconds to confirm. On rejection or timeout, VitaRoute automatically escalates to the next hospital.',

    bedIcuVent: 'ICU (Ventilator)',
    bedCardiac: 'Cardiac Monitored Bed',
    bedOxygen: 'Oxygen Supported Bed',
    bedBurns: 'Burns Isolation Bay',
    bedTrauma: 'Trauma Resuscitation Bay',

    voiceAgentTitle: 'Voice Agent',
    voiceAgentSubtitle: 'Real-time conversational medical coordination assistant',
    askAnything: 'Ask VitaRoute Voice Agent...',
    askVoicePrompt: 'Ask about available ICU beds, closest hospital, triage protocols, or hold status',
    voiceAgentPlaceholder: 'Ask in English, Hindi, or Marathi (e.g. "Where is the nearest cardiac ICU bed?")...',
    sendQuestion: 'Ask Agent',
    connectingAgent: 'Connecting to Voice Agent...',
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
    signOut: 'साइन आउट',
    emergencyCoordination: 'आपातकालीन बेड समन्वय',

    roleCitizen: 'आपातकालीन नागरिक / मरीज',
    roleNurse: 'वार्ड स्टाफ नर्स',
    roleAmbulance: 'एम्बुलेंस पैरामेडिक यूनिट',
    roleERDoctor: 'आपातकालीन चिकित्सा अधिकारी',
    roleAdmin: 'ईएमएस क्षेत्रीय समन्वयक',

    heroTitle: 'गंभीर मरीजों को सही बेड तक पहुंचाएं।',
    heroHighlight: 'मिनटों में नहीं, सेकंडों में।',
    heroSubtitle: 'हार्ट अटैक या सांस रुकने जैसी स्थिति में एम्बुलेंस 20 मिनट ऐसे अस्पताल नहीं जा सकती जहाँ आईसीयू बेड खाली न हो। वीटारूट मरीज की जरूरत, लाइव बेड संख्या और सड़क यात्रा समय को मिलाकर 2 मिनट में बेड रिजर्व करता है।',
    heroSOSButton: '🚨 आपातकालीन एसओएस (SOS)',
    heroExploreRoles: 'अस्पताल भूमिका पोर्टल खोलें',
    howItWorks: 'यह कैसे काम करता है',
    clinicalScenarios: 'चिकित्सीय परिदृश्य',
    signIn: 'लॉगिन करें',
    launchDispatch: 'एम्बुलेंस डिस्पैच शुरू करें',
    testNurseBeds: '10-सेकंड नर्स बेड काउंटर जांचें',
    openParamedicDemo: 'पैरामेडिक डेमो',
    nurseBedUpdateStat: 'नर्स बेड अपडेट',
    constraintsStat: 'बेड, समय, ताजगी और लोड',
    holdTimerStat: 'ईआर बेड होल्ड टाइमर',
    autoRerouteStat: 'अस्वीकृति पर स्वतः पुनः मार्ग',

    pipelineStep1: '1. नागरिक एसओएस वॉइस',
    pipelineStep2: '2. लाइव जीपीएस और सीएडी डिस्पैच',
    pipelineStep3: '3. 120 सेकंड ईआर होल्ड विंडो',
    pipelineStep4: '4. आईसीयू बेड आरक्षित',

    partsTitle: 'वीटारूट के 3 मुख्य भाग',
    partsSubtitle: 'आपातकालीन कक्ष में देरी की सबसे बड़ी समस्या—सटीक लाइव जानकारी की कमी—को हल करने के लिए निर्मित।',
    part1Title: 'भाग 1: 10 सेकंड में नर्स बेड अपडेट',
    part1Desc: 'वार्ड नर्स सामान्य स्मार्टफोन पर प्रति बेड 1-टैप करके सेकंडों में उपलब्ध बेड संख्या अपडेट करती हैं। कोई जटिल ईएचआर फॉर्म नहीं।',
    part2Title: 'भाग 2: बहु-मानदंड सीएडी डिस्पैच',
    part2Desc: 'मरीज की बीमारी और लाइव जीपीएस स्थान के अनुसार विशेषज्ञता, सड़क मार्ग से यात्रा समय, डेटा ताजगी और लोड के आधार पर अस्पतालों को रैंक करता है।',
    part3Title: 'भाग 3: 120 सेकंड में पुष्टि और होल्ड',
    part3Desc: 'अस्पताल ईआर डॉक्टर 2 मिनट में बेड स्वीकार या अस्वीकार करते हैं। अस्वीकार या समय समाप्त होने पर वीटारूट स्वतः अगले सर्वश्रेष्ठ अस्पताल को ऑफर करता है।',

    flowTitle: 'जीवन रक्षक आपातकालीन प्रक्रिया',
    flowSubtitle: 'नागरिक के कॉल से लेकर अस्पताल में भर्ती होने तक वीटारूट कैसे समन्वय करता है',
    flowStep1Title: '1. नागरिक वॉइस और एसओएस',
    flowStep1Desc: 'नागरिक अपनी भाषा में बोलकर या 1-टैप में तत्काल जीपीएस और सत्यापन पिन के साथ एसओएस भेजते हैं।',
    flowStep2Title: '2. 10 सेकंड में नर्स बेड अपडेट',
    flowStep2Desc: 'वार्ड नर्स स्मार्टफोन पर केवल एक टैप से उपलब्ध बेड की संख्या तुरंत अपडेट करती हैं।',
    flowStep3Title: '3. बहु-मानदंड एम्बुलेंस मिलान',
    flowStep3Desc: 'एम्बुलेंस सीएडी प्रणाली विशेषज्ञता, सड़क यात्रा समय, बेड स्टॉक और डेटा ताजगी से अस्पताल चुनती है।',
    flowStep4Title: '4. 120 सेकंड में पुष्टि और होल्ड',
    flowStep4Desc: 'ईआर डॉक्टर 2 मिनट में बेड स्वीकारते हैं। अस्वीकृति पर सिस्टम स्वतः अगले अस्पताल को चुनता है।',
    loginPortalTitle: 'आपातकालीन भूमिका पोर्टल और डेमो लॉगिन',
    loginPortalSubtitle: 'प्रत्यक्ष आपातकालीन कार्यप्रवाह का परीक्षण करने के लिए एक भूमिका चुनें:',
    quickAccessAs: 'इस भूमिका में सीधा प्रवेश करें',
    oneTapDemoLogin: '1-टैप चिकित्सीय भूमिका लॉगिन',

    voiceInputTitle: 'एआई आपातकालीन वॉइस सहायक',
    voiceInputPrompt: 'अपनी आपातकालीन स्थिति हिंदी, मराठी या अंग्रेजी में बोलें...',
    voiceListening: 'आपकी आपातकालीन स्थिति सुनी जा रही है...',
    voiceSpeakNow: 'माइक दबाएं और बताएं क्या हुआ है',
    voiceStopListening: 'सुनना बंद करें और विश्लेषण करें',
    voiceClassifiedAs: 'पहचाना गया आपातकालीन प्रकार:',
    voiceAutoConfirmText: 'एम्बुलेंस स्वतः प्रेषित होने में शेष समय:',
    sosEmergencyButton: '🚨 आपातकालीन एसओएस की पुष्टि करें',
    confirmEmergencyDispatch: 'क्या आप तुरंत एम्बुलेंस बुलाना चाहते हैं?',
    cancel: 'रद्द करें',
    selectEmergencyType: 'आपातकालीन प्रकार चुनें:',
    gpsTelematics: 'डिस्पैच जीपीएस टेलीमैटिक्स',
    acquiringGps: 'सटीक जीपीएस सिग्नल खोजा जा रहा है...',
    refreshLocation: 'जीपीएस स्थान रिफ्रेश करें',
    activeDispatchTitle: 'एम्बुलेंस रवाना हो चुकी है',
    assignedUnit: 'सौंपी गई एम्बुलेंस यूनिट',
    estimatedArrival: 'पहुंचने का अनुमानित समय',
    autoVerifiedIncident: 'स्वचालित रूप से सत्यापित घटना रिकॉर्ड',
    paramedicPin: 'पैरामेडिक ऑन-सीन सत्यापन पिन (PIN)',
    call911: '108 / 112 आपातकालीन कॉल करें',
    teleTriageAudio: 'टेली-ट्राएज ऑडियो से जुड़ें',
    firstResponderInstructions: 'महत्वपूर्ण प्राथमिक उपचार निर्देश:',
    timelineSOSTriggered: 'एसओएस आपातकाल शुरू हुआ',
    timelineLocationAcquired: 'जीपीएस स्थान प्राप्त हुआ',
    timelineAmbulanceAssigned: 'एम्बुलेंस यूनिट रवाना',
    timelineHospitalSelected: 'सर्वोत्तम अस्पताल चुना गया',
    timelineHospitalAccepted: 'ईआर बेड सुरक्षित एवं आरक्षित',
    timelineEnRoute: 'एम्बुलेंस रास्ते में है',
    timelineArrived: 'पैरामेडिक्स घटनास्थल पर पहुंचे',
    timelineCompleted: 'मरीज को बेड पर भर्ती किया गया',

    catCardiac: 'हार्ट अटैक / सीने में दर्द',
    catCardiacDesc: 'सीने में असहनीय दर्द, बाएं हाथ में दर्द, घबराहट, बेहोशी',
    catRespiratory: 'सांस लेने में भारी तकलीफ',
    catRespiratoryDesc: 'सांस फूलना, ऑक्सीजन 85% से कम, अस्थमा का दौरा, दम घुटना',
    catTrauma: 'सड़क दुर्घटना / गंभीर चोट',
    catTraumaDesc: 'वाहन टक्कर, अत्यधिक रक्तस्राव, फ्रैक्चर, सिर की चोट',
    catBurns: 'आग या केमिकल से जलना',
    catBurnsDesc: 'गंभीर रूप से जलना, केमिकल का संपर्क, बिजली का झटका',
    catStroke: 'स्ट्रोक / पक्षाघात के लक्षण',
    catStrokeDesc: 'चेहरा टेढ़ा होना, हाथ-पैर में कमजोरी, आवाज लड़खड़ाना',

    nurseScreenTitle: 'वार्ड नर्स 10-सेकंड बेड गणना',
    nurseScreenSubtitle: 'व्यस्त शिफ्ट और सामान्य स्मार्टफोन के लिए तैयार 1-टैप प्रणाली',
    updateBedsPrompt: 'वार्ड में बेड जोड़ने (+) या खाली करने (-) के लिए टैप करें:',
    wardCensus: 'वार्ड बेड स्थिति',
    updatedJustNow: 'अभी अपडेट किया गया',
    updatedMinsAgo: '{mins} मिनट पहले अपडेट हुआ',
    staleWarning: '⚠ डेटा 30 मिनट से अधिक पुराना है। कृपया पुनः जांचें।',
    tapToIncrement: 'मरीज भर्ती करें (+1)',
    tapToDecrement: 'मरीज डिस्चार्ज / बेड खाली करें (-1)',
    availableBeds: 'अभी उपलब्ध',
    totalBeds: 'कुल बेड',
    heldBeds: 'वर्तमान में आरक्षित बेड',
    hospitalDiversionToggle: 'अस्पताल डायवर्जन स्थिति:',
    onDiversion: 'डायवर्जन पर (ईआर पूरी तरह भरा है)',
    normalIntake: 'सामान्य मरीज प्रवेश चालू',
    dutyChargeNurse: 'ड्यूटी चार्ज नर्स',
    wardBedCounter: 'वार्ड बेड काउंटर',
    syncAllBedData: 'सभी बेड डेटा सिंक करें',
    syncedToDispatch: 'डिस्पैच को सिंक हुआ!',
    offlineQueueActive: 'वार्ड ऑफलाइन कतार सक्रिय: बिना नेटवर्क सिग्नल के काम कर रहा है।',
    pwaCaching: 'पीडब्लूए कैशिंग',
    hospitalEhrFeed: 'अस्पताल ईएचआर फीड (HL7 v2 / FHIR ADT):',
    activeConnected: 'सक्रिय एवं कनेक्टेड',
    ehrDesc: 'मरीज भर्ती या डिस्चार्ज होने पर बेड संख्या अपने आप अपडेट होती है।',
    testEhrFeed: 'ईएचआर टेस्ट करें:',
    admitPatientBtn: '+ मरीज भर्ती करें',
    dischargePatientBtn: '- मरीज डिस्चार्ज करें',
    wardOverrides: 'वार्ड त्वरित नियंत्रण:',
    allFullBtn: 'सभी फुल (0)',
    resetBenchmarkBtn: 'डिफ़ॉल्ट रीसेट करें',
    bedFilled: 'बेड भरा',
    bedFree: 'बेड खाली',
    saved: 'सुरक्षित',
    full0Beds: 'फुल (0 बेड)',
    bedsLeft: 'शेष',
    occupied: 'व्यस्त',

    dispatchConsoleTitle: 'क्षेत्रीय सीएडी एम्बुलेंस डिस्पैच',
    inVehicleMdt: 'वाहन एमडीटी टैबलेट स्क्रीन',
    triageAcuity: 'मरीज की गंभीरता (ट्राएज)',
    requiredBedType: 'आवश्यक अस्पताल बेड का प्रकार',
    requiredSpecialties: 'आवश्यक चिकित्सा विशेषज्ञताएं',
    matchingHospitals: 'रैंकिंग अनुसार अनुशंसित अस्पताल',
    holdBed120s: '120 सेकंड होल्ड अनुरोध भेजें',
    holdingActive: '120 सेकंड होल्ड सक्रिय है...',
    navigateGoogleMaps: 'अस्पताल का रास्ता देखें (गूगल मैप्स)',
    dataFreshness: 'डेटा की ताजगी',
    erLoad: 'ईआर पर वर्तमान लोड',
    travelEta: 'सड़क यात्रा का समय',
    consoleModeLabel: 'कंसोल मोड:',
    consoleModeDesc: 'एम्बुलेंस प्रेषण एवं सड़क रूटिंग',
    dispatchConsoleTab: 'डिस्पैच कंसोल',
    inVehicleMdtTab: 'वाहन टैबलेट (MDT)',
    dispatchHospitalMatchTitle: 'एम्बुलेंस प्रेषण एवं अस्पताल मिलान',
    dispatchHospitalMatchSubtitle: 'वास्तविक सड़क यात्रा समय, बेड उपलब्धता, सर्जिकल टीमों और ईआर भीड़ के अनुसार अस्पतालों को रैंक करता है।',
    quickPresetsLabel: 'त्वरित चिकित्सीय प्रीसेट:',
    ambulanceIdLabel: 'एम्बुलेंस आईडी / यूनिट',
    triageAcuityLabel: 'ट्राएज गंभीरता',
    requiredBedTypeLabel: 'आवश्यक बेड का प्रकार',
    ambulanceLocationLabel: 'एम्बुलेंस स्थान',
    useSectorBtn: 'सेक्टर चुनें',
    useLiveGpsBtn: 'लाइव जीपीएस प्रयोग करें',
    locatingGpsText: 'स्थान खोजा जा रहा है...',
    refreshGpsText: 'जीपीएस रिफ्रेश करें',
    scanOsmApiBtn: 'आसपास क्षेत्र स्कैन करें (OSM API)',
    queryingOsmText: 'ओपनस्ट्रीटमैप से खोज जारी...',
    activeSpecialtiesCount: 'विशेषज्ञता मानदंड सक्रिय',
    patientFieldNoteLabel: 'मरीज की स्थिति / फील्ड नोट:',
    recHospitalsFor: 'अनुशंसित अस्पताल: विशेष मिलान',
    recHospitalsSubtitle: 'लाइव बेड, विशेषज्ञता, जीपीएस सड़क दूरी, डेटा ताजगी और ईआर लोड के अनुसार क्रमबद्ध।',
    freshnessFresh: '<15 मिनट (ताजा)',
    freshnessModerate: '15-45 मिनट',
    freshnessStale: '>45 मिनट (पुराना)',
    staleDataNote: '(पुराना डेटा)',
    liveDataNote: '(लाइव)',
    metricBedMatch: '1. बेड मिलान',
    metricSpecialties: '2. विशेषज्ञताएं',
    metricTravelTime: '3. यात्रा समय',
    metricFreshness: '4. डेटा ताजगी',
    metricErStrain: '5. ईआर तनाव',
    noSpecialtyFilter: 'कोई विशेषज्ञता फ़िल्टर नहीं',
    specialtyMatch100: '100% मिलान',
    missingSpecialtyCount: 'विशेषज्ञता अनुपलब्ध',
    requestBedHoldBtn: 'बेड होल्ड का अनुरोध',
    noBedToHoldBtn: 'कोई बेड उपलब्ध नहीं',
    viewHoldBoardBtn: 'बेड होल्ड बोर्ड देखें',
    bestMatchBadge: '#1 अनुशंसित विकल्प',
    bedsFreeText: 'बेड खाली',
    heldByEmsText: 'ईएमएस द्वारा होल्ड',
    holdWindow120Title: '120-सेकंड बेड होल्ड पुष्टि विंडो',
    rejectDivertBtn: 'अस्वीकार (डायवर्ट)',
    acceptLockBedBtn: 'स्वीकारें (बेड लॉक करें)',
    bedHeldReservationLocked: 'बेड आरक्षित: आरक्षण लॉक हुआ',
    viewInHoldScreen: 'बेड होल्ड स्क्रीन में देखें',
    backToRecommendations: 'सिफारिशों पर वापस जाएं',
    hospitalDidNotConfirm: 'अस्पताल ने पुष्टि नहीं की। अगले अस्पताल से संपर्क किया जा रहा है...',

    erStationTitle: 'इमर्जन्सी रूम (ER) रिसीविंग स्टेशन',
    incomingAmbulance: 'आने वाली एम्बुलेंस का तत्काल बेड होल्ड अनुरोध',
    holdCountdownTitle: '120-सेकंड बेड आरक्षण उल्टी गिनती',
    holdSecondsRemaining: 'स्वीकारने के लिए शेष सेकंड',
    acceptHoldButton: 'बेड होल्ड स्वीकारें एवं बे आरक्षित करें',
    rejectHoldButton: 'अस्वीकार करें / अगले अस्पताल भेजें',
    heldBedConfirmed: 'मरीज के लिए बेड सफलतापूर्वक आरक्षित किया गया',
    autoCascadeNextHospital: '120 सेकंड में पुष्टि न होने पर, वीटारूट स्वतः अगले सर्वश्रेष्ठ अस्पताल को चुनता है।',
    patientVitals: 'मरीज की चिकित्सीय स्थिति व सारांश',
    receivingStationHeader: 'रिसीविंग ईआर डेस्क · ट्रॉमा बे समन्वय',
    simulateIncoming: 'इनकमिंग अनुरोध सिमुलेट करें',
    incomingHoldAlert: 'इनकमिंग बेड होल्ड अनुरोध प्राप्त:',
    window120Badge: '120 सेकंड पुष्टि विंडो',
    reservationTarget: 'आरक्षण लक्ष्य:',
    bedRequestSentTo: 'बेड अनुरोध भेजा गया:',
    ambulanceCallSign: 'एम्बुलेंस कॉल साइन:',
    estimatedArrivalLabel: 'अनुमानित आगमन:',
    hospitalConfirmNotice: 'अस्पताल के पास पुष्टि के लिए 120 सेकंड हैं। अस्वीकृति या समय समाप्त होने पर वीटारूट स्वतः अगले अस्पताल को भेजता है।',

    bedIcuVent: 'आईसीयू (वेंटिलेटर)',
    bedCardiac: 'कार्डियक मॉनिटर बेड',
    bedOxygen: 'ऑक्सीजन सपोर्ट बेड',
    bedBurns: 'बर्न्स आइसोलेशन बे',
    bedTrauma: 'ट्रॉमा रीससिटेशन बे',

    voiceAgentTitle: 'वॉइस एजेंट (Voice Agent)',
    voiceAgentSubtitle: 'रियल-टाइम संवादात्मक आपातकालीन चिकित्सा सहायक',
    askAnything: 'वीटारूट वॉइस एजेंट से कुछ भी पूछें...',
    askVoicePrompt: 'आईसीयू बेड, निकटतम अस्पताल, या प्रक्रिया के बारे में पूछें',
    voiceAgentPlaceholder: 'हिंदी, मराठी या अंग्रेजी में पूछें (उदा: "निकटतम कार्डियक आईसीयू बेड कहाँ है?")...',
    sendQuestion: 'पूछें',
    connectingAgent: 'वॉइस एजेंट से जोड़ा जा रहा है...',
    suggestedQuestions: 'त्वरित प्रश्न:',
  },

  mr: {
    appName: 'व्हिटारूट (VitaRoute)',
    tagline: 'आणीबाणी रुग्णालय बेड वाटप आणि रुग्णवाहिका प्रेषण',
    home: 'होम',
    citizenSOS: 'नागरिक एसओएस (SOS)',
    nurseUpdate: 'नर्स बेड अपडेट',
    ambulanceDispatch: 'रुग्णवाहिका डिस्पॅच',
    erConfirmHold: 'ईआर खात्री आणि होल्ड',
    adminDashboard: 'कमांड ॲडमिन',
    languageSelect: 'भाषा',
    statusOnline: 'प्रणाली सक्रिय',
    statusOffline: 'ऑफलाइन कॅश सक्रिय',
    soundOn: 'ध्वनी संकेत सक्रिय',
    soundMuted: 'मौन',
    backToHome: 'होमवर परत जा',
    signOut: 'साइन आउट करा',
    emergencyCoordination: 'आणीबाणी बेड समन्वय',

    roleCitizen: 'आणीबाणी नागरिक / रुग्ण',
    roleNurse: 'वॉर्ड स्टाफ नर्स',
    roleAmbulance: 'रुग्णवाहिका पॅरामेडिक युनिट',
    roleERDoctor: 'तातडीचे वैद्यकीय अधिकारी',
    roleAdmin: 'ईएमएस प्रादेशिक समन्वयक',

    heroTitle: 'गंभीर रुग्णांना वेळेत योग्य बेड मिळवून द्या.',
    heroHighlight: 'मिनिटांत नाही, सेकंदात.',
    heroSubtitle: 'हार्ट अटॅक किंवा श्वास गुदमरण्याच्या स्थितीत रुग्णवाहिका 20 मिनिटे अशा रुग्णालयात जाऊ शकत नाही जिथे आयसीयू बेड शिल्लक नाही. व्हिटारूट रुग्णाची गरज, थेट बेड संख्या आणि प्रवासाची वेळ जोडून 2 मिनिटांत बेड आरक्षित करते.',
    heroSOSButton: '🚨 आणीबाणी एसओएस (SOS)',
    heroExploreRoles: 'रुग्णालय भूमिका पोर्टल उघडा',
    howItWorks: 'हे कसे चालते',
    clinicalScenarios: 'वैद्यकीय प्रसंग',
    signIn: 'साइन इन करा',
    launchDispatch: 'रुग्णवाहिका डिस्पॅच सुरू करा',
    testNurseBeds: '10-सेकंद नर्स बेड काउंटर तपासा',
    openParamedicDemo: 'पॅरामेडिक डेमो',
    nurseBedUpdateStat: 'नर्स बेड अपडेट',
    constraintsStat: 'बेड्स, वेळ, ताजेपणा आणि ताण',
    holdTimerStat: 'ईआर बेड होल्ड टाइमर',
    autoRerouteStat: 'नकार आल्यास आपोआप नवा मार्ग',

    pipelineStep1: '1. नागरिक एसओएस व्हॉइस',
    pipelineStep2: '2. थेट जीपीएस आणि सीएडी डिस्पॅच',
    pipelineStep3: '3. 120 सेकंद ईआर होल्ड विंडो',
    pipelineStep4: '4. आयसीयू बेड आरक्षित',

    partsTitle: 'व्हिटारूटचे 3 मुख्य भाग',
    partsSubtitle: 'आणीबाणी कक्षातील सर्वात मोठी अडचण—विश्वासार्ह माहिती वेळेवर न मिळणे—दूर करण्यासाठी तयार केलेली प्रणाली.',
    part1Title: 'भाग 1: 10 सेकंदात नर्स बेड अपडेट',
    part1Desc: 'वॉर्ड नर्स सामान्य स्मार्टफोनवर फक्त एका टॅपमध्ये उपलब्ध बेड्सची संख्या सेकंदात अद्ययावत करतात. कोणताही क्लिष्ट फॉर्म नाही.',
    part2Title: 'भाग 2: बहु-निकष सीएडी डिस्पॅच',
    part2Desc: 'रुग्णाच्या गरजेनुसार तज्ज्ञता, रस्त्यावरील अंतर, माहितीचा ताजेपणा आणि ताण यावरून रुग्णालयांची क्रमवारी लावली जाते.',
    part3Title: 'भाग 3: 120 सेकंदात खात्री आणि होल्ड',
    part3Desc: 'रुग्णालय 2 मिनिटांत बेड आरक्षित करते. नकार आल्यास किंवा वेळ संपल्यास प्रणाली आपोआप पुढच्या सर्वोत्तम रुग्णालयाची निवड करते.',

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
    dutyChargeNurse: 'ड्युटी चार्ज नर्स',
    wardBedCounter: 'वॉर्ड बेड काउंटर',
    syncAllBedData: 'सर्व बेड माहिती सिंक करा',
    syncedToDispatch: 'डिस्पॅचला पाठवले!',
    offlineQueueActive: 'वॉर्ड ऑफलाइन रांग सक्रिय: नेटवर्क सिग्नलशिवाय कार्यरत आहे.',
    pwaCaching: 'पीडब्लूए कॅशिंग',
    hospitalEhrFeed: 'रुग्णालय ईएचआर फीड (HL7 v2 / FHIR ADT):',
    activeConnected: 'सक्रिय आणि जोडलेले',
    ehrDesc: 'रुग्ण दाखल किंवा डिस्चार्ज झाल्यावर बेडची संख्या आपोआप बदलते.',
    testEhrFeed: 'ईएचआर तपासा:',
    admitPatientBtn: '+ रुग्ण दाखल करा',
    dischargePatientBtn: '- रुग्ण डिस्चार्ज करा',
    wardOverrides: 'वॉर्ड त्वरित नियंत्रण:',
    allFullBtn: 'सर्व भरले (0)',
    resetBenchmarkBtn: 'डीफॉल्ट पूर्ववत करा',
    bedFilled: 'बेड भरला',
    bedFree: 'बेड रिकामा',
    saved: 'जतन केले',
    full0Beds: 'पूर्ण (0 बेड्स)',
    bedsLeft: 'शिल्लक',
    occupied: 'व्यापलेले',

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
    consoleModeLabel: 'कन्सोल मोड:',
    consoleModeDesc: 'रुग्णवाहिका डिस्पॅच आणि मार्ग नियोजन',
    dispatchConsoleTab: 'डिस्पॅच कन्सोल',
    inVehicleMdtTab: 'गाडीतील टॅबलेट (MDT)',
    dispatchHospitalMatchTitle: 'रुग्णवाहिका डिस्पॅच आणि रुग्णालय जुळणी',
    dispatchHospitalMatchSubtitle: 'रस्त्यावरील प्रत्यक्ष प्रवासाची वेळ, बेड उपलब्धता, तज्ज्ञ डॉक्टर आणि ईआर गर्दीनुसार रुग्णालयांची क्रमवारी लावली जाते.',
    quickPresetsLabel: 'जलद वैद्यकीय प्रीसेट्स:',
    ambulanceIdLabel: 'रुग्णवाहिका आयडी / युनिट',
    triageAcuityLabel: 'ट्रायज तीव्रता',
    requiredBedTypeLabel: 'आवश्यक बेडचा प्रकार',
    ambulanceLocationLabel: 'रुग्णवाहिका स्थान',
    useSectorBtn: 'सेक्टर निवडा',
    useLiveGpsBtn: 'थेट जीपीएस वापरा',
    locatingGpsText: 'स्थान शोधत आहे...',
    refreshGpsText: 'जीपीएस रिफ्रेश करा',
    scanOsmApiBtn: 'जवळचा परिसर स्कॅन करा (OSM API)',
    queryingOsmText: 'ओपनस्ट्रीटमॅपवरून शोधत आहे...',
    activeSpecialtiesCount: 'तज्ज्ञता निकष सक्रिय',
    patientFieldNoteLabel: 'रुग्णाची तक्रार / फील्ड नोंद:',
    recHospitalsFor: 'शिफारस केलेली रुग्णालये: योग्य जुळणी',
    recHospitalsSubtitle: 'थेट बेड्स, तज्ज्ञता, रस्त्यावरील अंतर, माहितीचा ताजेपणा आणि ईआर ताणानुसार क्रमवारी.',
    freshnessFresh: '<15 मिनिटे (ताजे)',
    freshnessModerate: '15-45 मिनिटे',
    freshnessStale: '>45 मिनिटे (जुने)',
    staleDataNote: '(जुनी माहिती)',
    liveDataNote: '(थेट)',
    metricBedMatch: '1. बेड जुळणी',
    metricSpecialties: '2. तज्ज्ञता',
    metricTravelTime: '3. प्रवासाची वेळ',
    metricFreshness: '4. माहितीचा ताजेपणा',
    metricErStrain: '5. ईआर ताण',
    noSpecialtyFilter: 'कोणताही तज्ज्ञता फिल्टर नाही',
    specialtyMatch100: '100% जुळणी',
    missingSpecialtyCount: 'तज्ज्ञता उपलब्ध नाही',
    requestBedHoldBtn: 'बेड होल्ड विनंती पाठवा',
    noBedToHoldBtn: 'होल्डसाठी बेड नाही',
    viewHoldBoardBtn: 'बेड होल्ड बोर्ड पहा',
    bestMatchBadge: '#1 सर्वोत्तम पर्याय',
    bedsFreeText: 'बेड्स उपलब्ध',
    heldByEmsText: 'ईएमएस द्वारे राखीव',
    holdWindow120Title: '120-सेकंद बेड होल्ड खात्री विंडो',
    rejectDivertBtn: 'नकार (डायव्हर्ट)',
    acceptLockBedBtn: 'स्वीकारा (बेड लॉक करा)',
    bedHeldReservationLocked: 'बेड राखीव: आरक्षण निश्चित झाले',
    viewInHoldScreen: 'बेड होल्ड स्क्रीनमध्ये पहा',
    backToRecommendations: 'शिफारशींकडे परत जा',
    hospitalDidNotConfirm: 'रुग्णालयाने खात्री केली नाही. पुढील उपलब्ध रुग्णालयाशी संपर्क साधत आहे...',

    erStationTitle: 'इमर्जन्सी रूम (ER) रिसेप्शन डेस्क',
    incomingAmbulance: 'येणाऱ्या रुग्णवाहिकेची बेड आरक्षण विनंती',
    holdCountdownTitle: '120-सेकंद बेड आरक्षण उलटी गिनती',
    holdSecondsRemaining: 'स्वीकारण्यासाठी शिल्लक सेकंद',
    acceptHoldButton: 'बेड होल्ड स्वीकारा आणि बे आरक्षित करा',
    rejectHoldButton: 'नकार द्या / पुढील रुग्णालयाकडे पाठवा',
    heldBedConfirmed: 'रुग्णासाठी बेड यशस्वीपणे आरक्षित करण्यात आला',
    autoCascadeNextHospital: '120 सेकंदात खात्री न झाल्यास, व्हिटारूट आपोआप पुढील सर्वोत्तम रुग्णालयाची निवड करतो.',
    patientVitals: 'रुग्णाची वैद्यकीय माहिती व सारांश',
    receivingStationHeader: 'रिसेप्शन ईआर डेस्क · ट्रॉमा बे समन्वय',
    simulateIncoming: 'येणारी विनंती सिम्युलेट करा',
    incomingHoldAlert: 'येणारी बेड होल्ड विनंती:',
    window120Badge: '120 सेकंद खात्री विंडो',
    reservationTarget: 'आरक्षण लक्ष्य:',
    bedRequestSentTo: 'बेड विनंती पाठवली:',
    ambulanceCallSign: 'रुग्णवाहिका कॉल साइन:',
    estimatedArrivalLabel: 'अंदाजे आगमन:',
    hospitalConfirmNotice: 'रुग्णालयाकडे खात्री करण्यासाठी 120 सेकंद आहेत. नकार किंवा वेळ संपल्यास व्हिटारूट आपोआप पुढील रुग्णालयाकडे वळवते.',

    bedIcuVent: 'आयसीयू (व्हेंटिलेटर)',
    bedCardiac: 'कार्डियाक मॉनिटर बेड',
    bedOxygen: 'ऑक्सिजन बेड',
    bedBurns: 'भाजलेल्या रुग्णांसाठी कक्ष',
    bedTrauma: 'ट्रॉमा रिसुसिटेशन बे',

    voiceAgentTitle: 'व्हॉइस एजंट (Voice Agent)',
    voiceAgentSubtitle: 'थेट संवादात्मक आपत्कालीन वैद्यकीय सहाय्यक',
    askAnything: 'व्हिटारूट व्हॉइस एजंटला काहीही विचारा...',
    askVoicePrompt: 'आयसीयू बेड्स, जवळचे रुग्णालय किंवा नियमांबद्दल विचारा',
    voiceAgentPlaceholder: 'मराठी, हिंदी किंवा इंग्रजीत विचारा (उदा: "जवळचे कार्डियाक आयसीयू बेड कुठे आहे?")...',
    sendQuestion: 'विचारा',
    connectingAgent: 'व्हॉइस एजंटशी जोडत आहे...',
    suggestedQuestions: 'जलद प्रश्न:',
  },
};

export const getTranslation = (lang: SupportedLanguage = 'en'): TranslationDictionary => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};
