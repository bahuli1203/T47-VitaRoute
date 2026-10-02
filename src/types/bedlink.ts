/**
 * BedLink Core Type Definitions
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
  priorityWeight: number; // for emergency acuity matching
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
    equipmentHighlight: 'Airvo 2 HFNC & Telemetry',
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
    description: 'HEPA filtered negative-pressure containment, climate-controlled laminar flow',
    priorityWeight: 7,
    equipmentHighlight: 'Negative Pressure & Fluid Warmers',
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
    colorClass: 'text-rose-400 bg-rose-950/40 border-rose-600/50',
    borderClass: 'border-rose-500',
  },
  Yellow: {
    code: 'Yellow',
    label: 'Urgent / Level 2',
    subtext: 'Potentially unstable; continuous vitals monitoring required',
    targetResponse: '< 15 mins to bed',
    colorClass: 'text-amber-400 bg-amber-950/40 border-amber-600/50',
    borderClass: 'border-amber-500',
  },
  Green: {
    code: 'Green',
    label: 'Delayed / Level 3',
    subtext: 'Systemic signs stable; urgent care or observation',
    targetResponse: '< 60 mins to bed',
    colorClass: 'text-emerald-400 bg-emerald-950/40 border-emerald-600/50',
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
  distanceKm: number;
  travelTimeMins: number;
  erLoad: ERLoad;
  diversionStatus: 'Open' | 'Advisory' | 'Diversion';
  specialties: string[];
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

export type AppRole = 'nurse' | 'dispatch' | 'er';

export interface DispatchFilterState {
  triageAcuity: TriageAcuity;
  requiredBedType: BedTypeId;
  locationSector: string;
  ambulanceCallSign: string;
  patientConditionNote: string;
}
