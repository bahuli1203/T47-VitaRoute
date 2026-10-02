/**
 * VitaRoute Core Type Definitions
 * Mission-critical emergency dispatch and hospital bed coordination
 */

export type BedTypeId =
  | 'icu_ventilator'
  | 'icu_non_ventilator'
  | 'oxygen_bed'
  | 'cardiac_monitored'
  | 'burns_isolation'
  | 'trauma_resuscitation';

export interface BedTypeMeta {
  id: BedTypeId;
  label: string;
  shortLabel: string;
  description: string;
  priorityWeight: number;
  equipmentHighlight: string;
}

export const BED_TYPES: Record<BedTypeId, BedTypeMeta> = {
  icu_ventilator: {
    id: 'icu_ventilator',
    label: 'ICU (Ventilator)',
    shortLabel: 'ICU-Vent',
    description: 'Invasive mechanical ventilation, arterial line, ECMO standby',
    priorityWeight: 10,
    equipmentHighlight: 'Hamilton-C6 / Servo-u In-Line',
  },
  icu_non_ventilator: {
    id: 'icu_non_ventilator',
    label: 'ICU (Non-Ventilator)',
    shortLabel: 'ICU-Stepdown',
    description: 'High-dependency intensive care, inotropic infusion, NIV/BiPAP',
    priorityWeight: 8,
    equipmentHighlight: 'Airvo 2 HFNC and Telemetry',
  },
  oxygen_bed: {
    id: 'oxygen_bed',
    label: 'Oxygen Bed',
    shortLabel: 'High-Flow O2',
    description: 'Central wall-line high-flow O2, standard respiratory monitoring',
    priorityWeight: 5,
    equipmentHighlight: 'Central 15L/min Outlets',
  },
  cardiac_monitored: {
    id: 'cardiac_monitored',
    label: 'Cardiac Monitored',
    shortLabel: 'Cardiac Telemetry',
    description: 'Continuous 12-lead telemetry, transcutaneous pacing standby',
    priorityWeight: 9,
    equipmentHighlight: 'Mindray BeneVision Central Link',
  },
  burns_isolation: {
    id: 'burns_isolation',
    label: 'Burns / Isolation',
    shortLabel: 'Burns / Negative P',
    description: 'HEPA filtered negative-pressure containment, laminar air flow',
    priorityWeight: 7,
    equipmentHighlight: 'Negative Pressure and Fluid Warmers',
  },
  trauma_resuscitation: {
    id: 'trauma_resuscitation',
    label: 'Trauma Resuscitation',
    shortLabel: 'Trauma Bay',
    description: 'Level 1 trauma resuscitation bay, rapid blood infuser, fluoroscopy',
    priorityWeight: 10,
    equipmentHighlight: 'Belmont Rapid Infuser + C-Arm',
  },
};

export type SpecialtyId =
  | 'cardiac_cath_lab'
  | 'ecmo'
  | 'stroke_thrombectomy'
  | 'burn_unit'
  | 'pediatric_icu'
  | 'trauma_level_1'
  | 'hyperbaric_o2'
  | 'emergency_dialysis';

export interface SpecialtyMeta {
  id: SpecialtyId;
  label: string;
  category: 'cardiac' | 'neuro' | 'trauma' | 'burns' | 'pediatric' | 'general';
}

export const AVAILABLE_SPECIALTIES: Record<SpecialtyId, SpecialtyMeta> = {
  cardiac_cath_lab: {
    id: 'cardiac_cath_lab',
    label: '24/7 Primary PCI (Cath Lab)',
    category: 'cardiac',
  },
  ecmo: {
    id: 'ecmo',
    label: 'ECMO Standby',
    category: 'cardiac',
  },
  stroke_thrombectomy: {
    id: 'stroke_thrombectomy',
    label: 'Endovascular Thrombectomy (Stroke)',
    category: 'neuro',
  },
  burn_unit: {
    id: 'burn_unit',
    label: 'Specialized Burn ICU Team',
    category: 'burns',
  },
  pediatric_icu: {
    id: 'pediatric_icu',
    label: 'Pediatric ICU (PICU)',
    category: 'pediatric',
  },
  trauma_level_1: {
    id: 'trauma_level_1',
    label: 'Level 1 Trauma Surgical Crew',
    category: 'trauma',
  },
  hyperbaric_o2: {
    id: 'hyperbaric_o2',
    label: 'Hyperbaric Oxygen Chamber',
    category: 'general',
  },
  emergency_dialysis: {
    id: 'emergency_dialysis',
    label: 'Emergency Hemodialysis / CRRT',
    category: 'general',
  },
};

export type TriageAcuity = 'Red' | 'Yellow' | 'Green';

export interface TriageLevelMeta {
  code: TriageAcuity;
  label: string;
  subtext: string;
  targetResponse: string;
  colorClass: string;
  borderClass: string;
}

export const TRIAGE_LEVELS: Record<TriageAcuity, TriageLevelMeta> = {
  Red: {
    code: 'Red',
    label: 'Immediate / Level 1',
    subtext: 'Life-threatening instability; zero-wait admission',
    targetResponse: '< 2 mins to ER bed',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    borderClass: 'border-rose-500',
  },
  Yellow: {
    code: 'Yellow',
    label: 'Urgent / Level 2',
    subtext: 'Potentially unstable; continuous vitals monitoring required',
    targetResponse: '< 15 mins to bed',
    colorClass: 'text-amber-800 bg-amber-50 border-amber-200',
    borderClass: 'border-amber-500',
  },
  Green: {
    code: 'Green',
    label: 'Delayed / Level 3',
    subtext: 'Systemic signs stable; urgent care or observation',
    targetResponse: '< 60 mins to bed',
    colorClass: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    borderClass: 'border-emerald-500',
  },
};

export type ERLoad = 'Low' | 'Medium' | 'Surge';

export interface HospitalBedCount {
  total: number;
  available: number;
  held: number; // locked under 120s timer
}

export interface Hospital {
  id: string;
  name: string;
  code: string;
  designation: string;
  ward: string;
  address: string;
  zone: string;
  lat: number;
  lng: number;
  distanceKm: number;
  travelTimeMins: number;
  erLoad: ERLoad;
  diversionStatus: 'Open' | 'Advisory' | 'Diversion';
  specialties: SpecialtyId[];
  lastUpdatedMinutesAgo: number;
  lastUpdatedTimestamp: number;
  beds: Record<BedTypeId, HospitalBedCount>;
  activeHoldCount: number;
  nurseInCharge: string;
  directRadioChannel: string;
}

export type HoldStatus = 'pending' | 'accepted' | 'rejected' | 'expired' | 'arrived';

export interface HoldRequest {
  id: string;
  ambulanceCallSign: string;
  hospitalId: string;
  hospitalName: string;
  bedType: BedTypeId;
  triageAcuity: TriageAcuity;
  patientAgeGender: string;
  chiefComplaint: string;
  vitalsSummary: {
    bp: string;
    hr: number;
    spo2: number;
    gcs: number;
  };
  etaMinutes: number;
  distanceKm: number;
  createdAt: number; // ms timestamp
  expiresAt: number; // ms timestamp (createdAt + 120,000)
  status: HoldStatus;
  rejectionReason?: string;
  escalatedToHospitalId?: string;
  assignedBay?: string;
  doctorInCharge?: string;
}

export type AppRole = 'citizen' | 'nurse' | 'dispatch' | 'er';

export interface DispatchFilterState {
  triageAcuity: TriageAcuity;
  requiredBedType: BedTypeId;
  requiredSpecialties: SpecialtyId[];
  locationSector: string;
  useLiveGps: boolean;
  ambulanceCallSign: string;
  patientConditionNote: string;
}

export type EmergencyCategory =
  | 'cardiac'
  | 'respiratory'
  | 'trauma'
  | 'burn'
  | 'stroke'
  | 'general';

export interface CitizenSOSRequest {
  id: string;
  timestamp: number;
  category: EmergencyCategory;
  callerPhone: string;
  patientCount: number;
  notes: string;
  lat: number;
  lng: number;
  addressApprox: string;
  assignedAmbulanceCallSign?: string;
  status: 'transmitting' | 'dispatched' | 'en_route' | 'arrived';
  etaMinutes: number;
}

export type EhrSyncStatus = 'connected' | 'syncing' | 'offline' | 'manual_override';

export interface EhrSyncEvent {
  id: string;
  timestamp: number;
  eventType: 'ADT_A01_ADMIT' | 'ADT_A03_DISCHARGE' | 'ADT_A02_TRANSFER' | 'NIGHT_SHIFT_CENSUS';
  hospitalId: string;
  wardId: string;
  bedType: BedTypeId;
  delta: number;
  sourceSystem: 'Epic Systems HL7v2' | 'Cerner Millennium FHIR' | 'Nurse One-Tap Override';
}
