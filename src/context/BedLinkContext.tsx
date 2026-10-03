import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppRole,
  Hospital,
  BedTypeId,
  SpecialtyId,
  HoldRequest,
  DispatchFilterState,
  TriageAcuity,
  CitizenSOSRequest,
  EmergencyCategory,
  EhrSyncStatus,
  EhrIntegrationMode,
  GenericEhrWebhookPayload,
  SosVerificationState,
  MdtDisplayTheme,
  CardiacMonitorTelemetry,
  Emergency,
  EmergencyTimelineEvent,
  EmergencyTimelineStep,
  EmergencyStatus,
  TIMELINE_STEP_LABELS,
  AVAILABLE_SPECIALTIES,
} from '../types/bedlink';
import { INITIAL_HOSPITALS } from '../data/mockHospitals';
import { soundManager } from '../utils/audio';
import { METRO_SECTORS } from '../utils/geo';
import {
  calculateHaversineDistance,
  estimateEmergencyTravelTime,
} from '../utils/geo';
import { fetchRealWorldHospitals, reverseGeocodeLocation } from '../services/hospitalApi';

interface BedLinkContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  hospitals: Hospital[];
  currentHospitalId: string;
  setCurrentHospitalId: (id: string) => void;
  currentHospital: Hospital;
  activeHolds: HoldRequest[];
  pendingHoldsCount: number;
  dispatchFilter: DispatchFilterState;
  setDispatchFilter: React.Dispatch<React.SetStateAction<DispatchFilterState>>;
  toggleSpecialtyFilter: (specialtyId: SpecialtyId) => void;
  isMuted: boolean;
  toggleMute: () => void;
  lastSyncTimestamp: number;

  // Real-World Hospital API and Road Routing
  isLoadingRealHospitals: boolean;
  realHospitalSource: 'live_osm' | 'local_fallback' | null;
  loadRealHospitalsForLocation: (lat: number, lng: number) => Promise<void>;
  activeLocationName: string;

  // Geolocation and Connectivity
  liveCoordinates: { lat: number; lng: number };
  gpsAccuracy: number | null;
  gpsError: string | null;
  isLocating: boolean;
  requestLiveLocation: () => void;
  isOnline: boolean;
  pendingOfflineSyncCount: number;

  // Citizen SOS and Fast Verification
  citizenSOSRequests: CitizenSOSRequest[];
  activeCitizenSOS: CitizenSOSRequest | null;
  triggerCitizenSOS: (category: EmergencyCategory, phone: string, notes: string) => CitizenSOSRequest;
  cancelCitizenSOS: (id: string) => void;
  sosVerification: SosVerificationState | null;
  connectTeleTriageAudio: () => void;

  // Rugged In-Vehicle MDT (Native Ambulance Tablet)
  mdtTheme: MdtDisplayTheme;
  setMdtTheme: (theme: MdtDisplayTheme) => void;
  isWakeLockActive: boolean;
  toggleWakeLock: () => void;
  cardiacTelemetry: CardiacMonitorTelemetry;
  updateCardiacTelemetry: (data: Partial<CardiacMonitorTelemetry>) => void;
  toggleMonitorConnection: () => void;

  // Nurse Actions
  incrementBed: (hospitalId: string, bedType: BedTypeId) => void;
  decrementBed: (hospitalId: string, bedType: BedTypeId) => void;
  setBedPreset: (hospitalId: string, preset: 'all_full' | 'reset_default' | 'surge_capacity') => void;
  syncAllBeds: (hospitalId: string) => void;
  bedLastUpdatedMap: Record<string, number>;

  // Dispatch Actions
  requestHold: (
    hospitalId: string,
    bedType: BedTypeId,
    overrideCallSign?: string,
    overrideAcuity?: TriageAcuity,
    overrideVitals?: { bp: string; hr: number; spo2: number; gcs: number },
    emergencyId?: string
  ) => HoldRequest;

  // ER Actions
  acceptHold: (holdId: string, assignedBay?: string) => void;
  rejectHold: (holdId: string, reason: string) => void;
  markArrived: (holdId: string) => void;
  cancelHold: (holdId: string) => void;

  // EHR / HIS Automatic Synchronization and Generic Ingestion
  ehrSyncStatus: EhrSyncStatus;
  ehrMode: EhrIntegrationMode;
  setEhrMode: (mode: EhrIntegrationMode) => void;
  lastEhrSyncTimestamp: number;
  simulateEhrEvent: (eventType: 'ADT_A01_ADMIT' | 'ADT_A03_DISCHARGE') => void;
  ingestGenericWebhookPayload: (payload: GenericEhrWebhookPayload) => boolean;

  // Simulation and System Actions
  simulateIncomingAmbulance: () => void;
  simulateMassSurge: () => void;
  resetAllData: () => void;
  notificationMessage: { text: string; type: 'success' | 'warning' | 'alert' | 'info' } | null;
  dismissNotification: () => void;

  // Emergency Lifecycle (NEW)
  emergencies: Emergency[];
  activeEmergency: Emergency | null;
  createEmergency: (category: EmergencyCategory, patientId: string, patientName: string) => Emergency;
  updateEmergencyStatus: (emergencyId: string, status: EmergencyStatus) => void;
  addTimelineEvent: (emergencyId: string, step: EmergencyTimelineStep, detail?: string) => void;
  assignHospitalToEmergency: (emergencyId: string, hospitalId: string, hospitalName: string, holdId: string, matchReasons: string[]) => void;
  completeEmergency: (emergencyId: string) => void;
  ambulanceAction: (emergencyId: string, action: 'navigate' | 'arrived' | 'handed_over') => void;
}

const STORAGE_KEY_HOSPITALS = 'vitaroute_hospitals_v4';
const STORAGE_KEY_HOLDS = 'vitaroute_holds_v4';
const STORAGE_KEY_OFFLINE_QUEUE = 'vitaroute_offline_queue_v1';
const STORAGE_KEY_CITIZEN_SOS = 'vitaroute_citizen_sos_v1';
const STORAGE_KEY_EMERGENCIES = 'vitaroute_emergencies_v1';

const DEFAULT_COORDS = { lat: 40.7128, lng: -74.006 };

const BedLinkContext = createContext<BedLinkContextType | null>(null);

export const BedLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read initial role from URL query param (?role=nurse | ?role=dispatch | ?role=er)
  const [role, setRole] = useState<AppRole>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('role');
      if (param === 'nurse') return 'nurse';
      if (param === 'dispatch' || param === 'ambulance') return 'dispatch';
      if (param === 'er' || param === 'hospital') return 'er';
      if (param === 'patient' || param === 'citizen') return 'patient';
      if (param === 'admin') return 'admin';
    }
    return 'dispatch';
  });

  const [currentHospitalId, setCurrentHospitalId] = useState<string>('sjm-01');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(Date.now());
  const [bedLastUpdatedMap, setBedLastUpdatedMap] = useState<Record<string, number>>({});
  const [notificationMessage, setNotificationMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'alert' | 'info';
  } | null>(null);

  // Real-world OpenStreetMap and Geocoding state
  const [isLoadingRealHospitals, setIsLoadingRealHospitals] = useState<boolean>(false);
  const [realHospitalSource, setRealHospitalSource] = useState<'live_osm' | 'local_fallback' | null>(null);
  const [activeLocationName, setActiveLocationName] = useState<string>('Downtown Metro Core');

  // Connectivity and Offline Sync
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<Array<{ hospitalId: string; bedType: BedTypeId; action: 'increment' | 'decrement'; timestamp: number }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_OFFLINE_QUEUE);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Geolocation state
  const [liveCoordinates, setLiveCoordinates] = useState<{ lat: number; lng: number }>(DEFAULT_COORDS);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Citizen SOS state
  const [citizenSOSRequests, setCitizenSOSRequests] = useState<CitizenSOSRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CITIZEN_SOS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Emergency state (NEW)
  const [emergencies, setEmergencies] = useState<Emergency[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EMERGENCIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Initialize hospitals from localStorage or fallback
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOSPITALS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_HOSPITALS;
  });

  // Initialize holds with an initial pending hold for demo
  const [activeHolds, setActiveHolds] = useState<HoldRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOLDS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    const initialExpiry = Date.now() + 115 * 1000;
    return [
      {
        id: 'hold-demo-104',
        ambulanceCallSign: 'Ambulance 104 (ALS Paramedic Unit)',
        hospitalId: 'sjm-01',
        hospitalName: 'St. Jude Metropolitan Hospital',
        bedType: 'icu_ventilator',
        triageAcuity: 'Red',
        patientAgeGender: '62M',
        chiefComplaint: 'Acute Respiratory Distress / Severe Hypoxemia',
        vitalsSummary: {
          bp: '88/54',
          hr: 128,
          spo2: 82,
          gcs: 9,
        },
        etaMinutes: 6,
        distanceKm: 2.4,
        createdAt: Date.now() - 5 * 1000,
        expiresAt: initialExpiry,
        status: 'pending',
        assignedBay: 'Trauma Bay 2 - ICU',
        doctorInCharge: 'Dr. Katherine Vance, MD (Attending)',
      },
    ];
  });

  // Dispatch filter state with multi-specialty selection and live GPS toggle
  const [dispatchFilter, setDispatchFilter] = useState<DispatchFilterState>({
    triageAcuity: 'Red',
    requiredBedType: 'icu_ventilator',
    requiredSpecialties: ['cardiac_cath_lab'],
    locationSector: 'sec-downtown',
    useLiveGps: true,
    ambulanceCallSign: 'Ambulance 104 (ALS Paramedic Unit)',
    patientConditionNote: 'Acute Respiratory Distress, Intubated en route',
  });

  const toggleSpecialtyFilter = useCallback((specialtyId: SpecialtyId) => {
    setDispatchFilter((prev) => {
      const exists = prev.requiredSpecialties.includes(specialtyId);
      const updated = exists
        ? prev.requiredSpecialties.filter((s) => s !== specialtyId)
        : [...prev.requiredSpecialties, specialtyId];
      return { ...prev, requiredSpecialties: updated };
    });
  }, []);

  // Load real-world hospitals near a coordinate
  const loadRealHospitalsForLocation = useCallback(async (lat: number, lng: number) => {
    setIsLoadingRealHospitals(true);
    try {
      const locName = await reverseGeocodeLocation(lat, lng);
      setActiveLocationName(locName);

      const result = await fetchRealWorldHospitals(lat, lng);
      setRealHospitalSource(result.source);
      if (result.hospitals && result.hospitals.length > 0) {
        setHospitals(result.hospitals);
        setCurrentHospitalId(result.hospitals[0].id);
      }
    } catch (err) {
      console.error('Failed to load real hospitals:', err);
    } finally {
      setIsLoadingRealHospitals(false);
    }
  }, []);

  // Request browser geolocation
  const requestLiveLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLiveCoordinates({ lat, lng });
        setGpsAccuracy(Math.round(position.coords.accuracy));
        setIsLocating(false);
        // Automatically fetch real hospitals around this live location
        loadRealHospitalsForLocation(lat, lng);
      },
      (error) => {
        setGpsError(error.message || 'Unable to retrieve location.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [loadRealHospitalsForLocation]);

  // Listen to geolocation and online status
  useEffect(() => {
    requestLiveLocation();

    const handleOnline = () => {
      setIsOnline(true);
      // Flush offline sync queue
      setOfflineQueue((queue) => {
        if (queue.length > 0) {
          setNotificationMessage({
            text: `Connection restored. Synced ${queue.length} offline updates.`,
            type: 'success',
          });
          localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
        }
        return [];
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotificationMessage({
        text: 'Network offline. Bed updates are queued locally and will sync when restored.',
        type: 'warning',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [requestLiveLocation]);

  // Persist offline queue
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(offlineQueue));
    } catch {
      // ignore
    }
  }, [offlineQueue]);

  // Sync mute state with sound manager
  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  // Persist hospitals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOSPITALS, JSON.stringify(hospitals));
    } catch {
      // ignore
    }
  }, [hospitals]);

  // Persist holds to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOLDS, JSON.stringify(activeHolds));
    } catch {
      // ignore
    }
  }, [activeHolds]);

  // Persist citizen SOS
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CITIZEN_SOS, JSON.stringify(citizenSOSRequests));
    } catch {
      // ignore
    }
  }, [citizenSOSRequests]);

  // Persist emergencies
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EMERGENCIES, JSON.stringify(emergencies));
    } catch {
      // ignore
    }
  }, [emergencies]);

  // Current selected hospital
  const currentHospital = useMemo(() => {
    return hospitals.find((h) => h.id === currentHospitalId) || hospitals[0];
  }, [hospitals, currentHospitalId]);

  // Count pending holds
  const pendingHoldsCount = useMemo(() => {
    return activeHolds.filter((h) => h.status === 'pending').length;
  }, [activeHolds]);

  const activeCitizenSOS = useMemo(() => {
    return citizenSOSRequests.find((r) => r.status === 'transmitting' || r.status === 'dispatched' || r.status === 'en_route') || null;
  }, [citizenSOSRequests]);

  // Active emergency (the most recent non-completed)
  const activeEmergency = useMemo(() => {
    return emergencies.find((e) => e.status !== 'completed') || null;
  }, [emergencies]);

  const dismissNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  const showNotification = useCallback((text: string, type: 'success' | 'warning' | 'alert' | 'info') => {
    setNotificationMessage({ text, type });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // ======= EMERGENCY LIFECYCLE MANAGEMENT (NEW) =======

  const addTimelineEvent = useCallback((emergencyId: string, step: EmergencyTimelineStep, detail?: string) => {
    setEmergencies((prev) =>
      prev.map((e) => {
        if (e.id !== emergencyId) return e;
        const newEvent: EmergencyTimelineEvent = {
          step,
          timestamp: Date.now(),
          label: TIMELINE_STEP_LABELS[step],
          detail,
        };
        return {
          ...e,
          timeline: [...e.timeline, newEvent],
        };
      })
    );
  }, []);

  const updateEmergencyStatus = useCallback((emergencyId: string, status: EmergencyStatus) => {
    setEmergencies((prev) =>
      prev.map((e) => {
        if (e.id !== emergencyId) return e;
        return { ...e, status };
      })
    );
  }, []);

  const createEmergency = useCallback(
    (category: EmergencyCategory, patientId: string, patientName: string): Emergency => {
      // Map category to bed type and specialties
      let mappedBed: BedTypeId = 'oxygen_bed';
      let mappedSpecialties: SpecialtyId[] = [];

      if (category === 'cardiac') {
        mappedBed = 'cardiac_monitored';
        mappedSpecialties = ['cardiac_cath_lab'];
      } else if (category === 'respiratory') {
        mappedBed = 'icu_ventilator';
        mappedSpecialties = ['ecmo'];
      } else if (category === 'burn') {
        mappedBed = 'burns_isolation';
        mappedSpecialties = ['burn_unit'];
      } else if (category === 'trauma') {
        mappedBed = 'trauma_resuscitation';
        mappedSpecialties = ['trauma_level_1'];
      } else if (category === 'stroke') {
        mappedBed = 'icu_non_ventilator';
        mappedSpecialties = ['stroke_thrombectomy'];
      }

      // Find best hospital match
      const rankedHospitals = hospitals
        .map((h) => {
          const bed = h.beds[mappedBed];
          const availableBeds = bed?.available ?? 0;
          const dist = calculateHaversineDistance(liveCoordinates.lat, liveCoordinates.lng, h.lat, h.lng);
          const eta = estimateEmergencyTravelTime(dist, h.erLoad);
          const matchedSpecs = mappedSpecialties.filter((s) => h.specialties.includes(s));
          const missingSpecs = mappedSpecialties.filter((s) => !h.specialties.includes(s));

          let penalty = 0;
          if (availableBeds <= 0) penalty += 1200;
          else penalty -= availableBeds * 6;
          if (missingSpecs.length > 0) penalty += missingSpecs.length * 150;
          penalty += eta * 4;
          if (h.erLoad === 'Surge') penalty += 35;
          if (h.erLoad === 'Medium') penalty += 10;
          if (h.lastUpdatedMinutesAgo > 45) penalty += 50;
          else if (h.lastUpdatedMinutesAgo > 15) penalty += 15;
          if (h.diversionStatus === 'Diversion') penalty += 600;
          if (h.diversionStatus === 'Advisory') penalty += 25;

          // Build match reasons
          const reasons: string[] = [];
          if (availableBeds > 0) reasons.push(`✓ ${availableBeds} ${mappedBed.replace(/_/g, ' ')} bed(s) available`);
          else reasons.push(`✗ No ${mappedBed.replace(/_/g, ' ')} beds`);
          matchedSpecs.forEach((s) => reasons.push(`✓ ${AVAILABLE_SPECIALTIES[s].label}`));
          missingSpecs.forEach((s) => reasons.push(`✗ Missing: ${AVAILABLE_SPECIALTIES[s].label}`));
          reasons.push(`✓ ${eta} min ETA (${dist} km)`);
          if (h.erLoad === 'Low') reasons.push('✓ Low ER load');
          else if (h.erLoad === 'Medium') reasons.push('⚠ Medium ER load');
          else reasons.push('⚠ Surge ER load');
          if (h.lastUpdatedMinutesAgo <= 15) reasons.push('✓ Recently updated data');
          else if (h.lastUpdatedMinutesAgo <= 45) reasons.push('⚠ Data updated ' + h.lastUpdatedMinutesAgo + ' min ago');
          else reasons.push('⚠ Stale data (' + h.lastUpdatedMinutesAgo + ' min ago)');

          return { hospital: h, penalty, eta, dist, reasons, availableBeds };
        })
        .sort((a, b) => a.penalty - b.penalty);

      const bestMatch = rankedHospitals[0];

      const emergencyId = `emg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      const newEmergency: Emergency = {
        id: emergencyId,
        patientId,
        patientName,
        category,
        status: 'active',
        createdAt: Date.now(),
        lat: liveCoordinates.lat,
        lng: liveCoordinates.lng,
        assignedAmbulance: 'Ambulance 104 (ALS Paramedic Unit)',
        assignedHospitalId: bestMatch?.hospital.id || null,
        assignedHospitalName: bestMatch?.hospital.name || null,
        holdRequestId: null,
        etaMinutes: bestMatch?.eta || 10,
        timeline: [
          { step: 'sos_triggered', timestamp: Date.now(), label: TIMELINE_STEP_LABELS.sos_triggered },
          { step: 'location_acquired', timestamp: Date.now() + 500, label: TIMELINE_STEP_LABELS.location_acquired, detail: `GPS: ${liveCoordinates.lat.toFixed(4)}N, ${Math.abs(liveCoordinates.lng).toFixed(4)}W` },
          { step: 'ambulance_assigned', timestamp: Date.now() + 1000, label: TIMELINE_STEP_LABELS.ambulance_assigned, detail: 'Ambulance 104 (ALS Paramedic Unit)' },
        ],
        requiredBedType: mappedBed,
        requiredSpecialties: mappedSpecialties,
        matchReasons: bestMatch?.reasons || [],
      };

      setEmergencies((prev) => [newEmergency, ...prev]);

      // Auto-request hospital hold after a short delay
      if (bestMatch && bestMatch.availableBeds > 0) {
        setTimeout(() => {
          setEmergencies((prev) =>
            prev.map((e) => {
              if (e.id !== emergencyId) return e;
              return {
                ...e,
                status: 'hospital_pending',
                timeline: [
                  ...e.timeline,
                  {
                    step: 'hospital_selected' as EmergencyTimelineStep,
                    timestamp: Date.now(),
                    label: TIMELINE_STEP_LABELS.hospital_selected,
                    detail: bestMatch.hospital.name,
                  },
                ],
              };
            })
          );
        }, 2000);
      }

      return newEmergency;
    },
    [hospitals, liveCoordinates]
  );

  const assignHospitalToEmergency = useCallback(
    (emergencyId: string, hospitalId: string, hospitalName: string, holdId: string, matchReasons: string[]) => {
      setEmergencies((prev) =>
        prev.map((e) => {
          if (e.id !== emergencyId) return e;
          return {
            ...e,
            assignedHospitalId: hospitalId,
            assignedHospitalName: hospitalName,
            holdRequestId: holdId,
            matchReasons,
            status: 'hospital_pending',
          };
        })
      );
    },
    []
  );

  const ambulanceAction = useCallback(
    (emergencyId: string, action: 'navigate' | 'arrived' | 'handed_over') => {
      setEmergencies((prev) =>
        prev.map((e) => {
          if (e.id !== emergencyId) return e;
          if (action === 'navigate') {
            return {
              ...e,
              status: 'en_route_hospital' as EmergencyStatus,
              timeline: [
                ...e.timeline,
                { step: 'ambulance_en_route' as EmergencyTimelineStep, timestamp: Date.now(), label: TIMELINE_STEP_LABELS.ambulance_en_route },
              ],
            };
          }
          if (action === 'arrived') {
            return {
              ...e,
              status: 'arrived' as EmergencyStatus,
              timeline: [
                ...e.timeline,
                { step: 'ambulance_arrived' as EmergencyTimelineStep, timestamp: Date.now(), label: TIMELINE_STEP_LABELS.ambulance_arrived },
              ],
            };
          }
          if (action === 'handed_over') {
            return {
              ...e,
              status: 'handed_over' as EmergencyStatus,
              timeline: [
                ...e.timeline,
                { step: 'patient_handed_over' as EmergencyTimelineStep, timestamp: Date.now(), label: TIMELINE_STEP_LABELS.patient_handed_over },
              ],
            };
          }
          return e;
        })
      );

      if (action === 'handed_over') {
        showNotification('Patient successfully handed over to hospital.', 'success');
      }
    },
    [showNotification]
  );

  const completeEmergency = useCallback(
    (emergencyId: string) => {
      setEmergencies((prev) =>
        prev.map((e) => {
          if (e.id !== emergencyId) return e;
          return {
            ...e,
            status: 'completed' as EmergencyStatus,
            timeline: [
              ...e.timeline,
              { step: 'emergency_completed' as EmergencyTimelineStep, timestamp: Date.now(), label: TIMELINE_STEP_LABELS.emergency_completed },
            ],
          };
        })
      );
      showNotification('Emergency marked as completed.', 'success');
    },
    [showNotification]
  );

  // NURSE ACTIONS
  const incrementBed = useCallback((hospitalId: string, bedType: BedTypeId) => {
    soundManager.playTap();
    soundManager.triggerVibration(30);

    const now = Date.now();
    setBedLastUpdatedMap((prev) => ({
      ...prev,
      [`${hospitalId}-${bedType}`]: now,
    }));

    if (!navigator.onLine) {
      setOfflineQueue((prev) => [
        ...prev,
        { hospitalId, bedType, action: 'increment', timestamp: now },
      ]);
    }

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const currentBeds = h.beds[bedType];
        if (currentBeds.available >= currentBeds.total) return h;
        return {
          ...h,
          lastUpdatedMinutesAgo: 0,
          lastUpdatedTimestamp: now,
          beds: {
            ...h.beds,
            [bedType]: {
              ...currentBeds,
              available: currentBeds.available + 1,
            },
          },
        };
      })
    );
  }, []);

  const decrementBed = useCallback((hospitalId: string, bedType: BedTypeId) => {
    soundManager.playTap();
    soundManager.triggerVibration(40);

    const now = Date.now();
    setBedLastUpdatedMap((prev) => ({
      ...prev,
      [`${hospitalId}-${bedType}`]: now,
    }));

    if (!navigator.onLine) {
      setOfflineQueue((prev) => [
        ...prev,
        { hospitalId, bedType, action: 'decrement', timestamp: now },
      ]);
    }

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const currentBeds = h.beds[bedType];
        if (currentBeds.available <= 0) return h;
        return {
          ...h,
          lastUpdatedMinutesAgo: 0,
          lastUpdatedTimestamp: now,
          beds: {
            ...h.beds,
            [bedType]: {
              ...currentBeds,
              available: currentBeds.available - 1,
            },
          },
        };
      })
    );
  }, []);

  const setBedPreset = useCallback((hospitalId: string, preset: 'all_full' | 'reset_default' | 'surge_capacity') => {
    soundManager.playTap();
    soundManager.triggerVibration([50, 40, 50]);

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        const updatedBeds = { ...h.beds };

        Object.keys(updatedBeds).forEach((key) => {
          const bKey = key as BedTypeId;
          if (preset === 'all_full') {
            updatedBeds[bKey] = { ...updatedBeds[bKey], available: 0 };
          } else if (preset === 'reset_default') {
            const defaultH = INITIAL_HOSPITALS.find((ih) => ih.id === hospitalId) || INITIAL_HOSPITALS[0];
            updatedBeds[bKey] = { ...defaultH.beds[bKey] };
          } else if (preset === 'surge_capacity') {
            updatedBeds[bKey] = { ...updatedBeds[bKey], available: Math.max(1, Math.floor(updatedBeds[bKey].total * 0.7)) };
          }
        });

        return {
          ...h,
          lastUpdatedMinutesAgo: 0,
          lastUpdatedTimestamp: Date.now(),
          beds: updatedBeds,
        };
      })
    );
  }, []);

  const syncAllBeds = useCallback((hospitalId: string) => {
    soundManager.playAcceptChime();
    soundManager.triggerVibration([60, 50, 80]);
    setLastSyncTimestamp(Date.now());

    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== hospitalId) return h;
        return {
          ...h,
          lastUpdatedMinutesAgo: 0,
          lastUpdatedTimestamp: Date.now(),
        };
      })
    );

    showNotification('Bed inventory synced to Regional Emergency Dispatch.', 'success');
  }, [showNotification]);

  // DISPATCH: Request Bed Hold
  const requestHold = useCallback(
    (
      hospitalId: string,
      bedType: BedTypeId,
      overrideCallSign?: string,
      overrideAcuity?: TriageAcuity,
      overrideVitals?: { bp: string; hr: number; spo2: number; gcs: number },
      emergencyId?: string
    ) => {
      const targetHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
      const callSign = overrideCallSign || dispatchFilter.ambulanceCallSign;
      const acuity = overrideAcuity || dispatchFilter.triageAcuity;

      soundManager.playAcceptChime();
      soundManager.triggerVibration([80, 50, 80]);

      // Decrement available bed count optimistically and increase held count
      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id !== hospitalId) return h;
          const currentBeds = h.beds[bedType];
          return {
            ...h,
            activeHoldCount: h.activeHoldCount + 1,
            beds: {
              ...h.beds,
              [bedType]: {
                ...currentBeds,
                available: Math.max(0, currentBeds.available - 1),
                held: currentBeds.held + 1,
              },
            },
          };
        })
      );

      const newHold: HoldRequest = {
        id: `hold-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        ambulanceCallSign: callSign,
        hospitalId: targetHospital.id,
        hospitalName: targetHospital.name,
        bedType: bedType,
        triageAcuity: acuity,
        patientAgeGender: '58M',
        chiefComplaint: dispatchFilter.patientConditionNote || 'Emergency Medical Admission',
        vitalsSummary: overrideVitals || {
          bp: acuity === 'Red' ? '86/50' : '120/80',
          hr: acuity === 'Red' ? 130 : 88,
          spo2: acuity === 'Red' ? 82 : 97,
          gcs: acuity === 'Red' ? 8 : 15,
        },
        etaMinutes: targetHospital.travelTimeMins,
        distanceKm: targetHospital.distanceKm,
        createdAt: Date.now(),
        expiresAt: Date.now() + 120 * 1000,
        status: 'pending',
        assignedBay: `Bay ${Math.floor(Math.random() * 5) + 1}`,
        doctorInCharge: 'Dr. Katherine Vance, MD',
        emergencyId: emergencyId,
        rejectedHospitalIds: [],
      };

      setActiveHolds((prev) => [newHold, ...prev]);

      // If emergency context, link the hold
      if (emergencyId) {
        setEmergencies((prev) =>
          prev.map((e) => {
            if (e.id !== emergencyId) return e;
            return {
              ...e,
              holdRequestId: newHold.id,
              assignedHospitalId: targetHospital.id,
              assignedHospitalName: targetHospital.name,
            };
          })
        );
      }

      showNotification(
        `Bed request sent to ${targetHospital.name}. 2-minute confirmation timer started.`,
        'info'
      );

      return newHold;
    },
    [hospitals, dispatchFilter, showNotification]
  );

  // ER ACTIONS
  const acceptHold = useCallback(
    (holdId: string, assignedBay?: string) => {
      soundManager.playAcceptChime();
      soundManager.triggerVibration([100, 60, 100]);

      setActiveHolds((prev) =>
        prev.map((hold) => {
          if (hold.id !== holdId) return hold;
          return {
            ...hold,
            status: 'accepted',
            assignedBay: assignedBay || hold.assignedBay || 'Resuscitation Bay 1',
          };
        })
      );

      const target = activeHolds.find((h) => h.id === holdId);
      if (target) {
        showNotification(
          `BED HELD for ${target.ambulanceCallSign} at ${target.hospitalName}. Bed locked.`,
          'success'
        );

        // Update emergency timeline if linked
        if (target.emergencyId) {
          addTimelineEvent(target.emergencyId, 'hospital_accepted', target.hospitalName);
          updateEmergencyStatus(target.emergencyId, 'hospital_confirmed');
        }
      }
    },
    [activeHolds, showNotification, addTimelineEvent, updateEmergencyStatus]
  );

  // Auto-escalation function when hold is rejected or expired
  const escalateHoldToNextHospital = useCallback(
    (rejectedHold: HoldRequest, reason: string) => {
      soundManager.playRejectTone();
      soundManager.triggerVibration([150, 80, 150]);

      // Release held bed back to available on rejected hospital
      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id !== rejectedHold.hospitalId) return h;
          const currentBeds = h.beds[rejectedHold.bedType];
          if (!currentBeds) return h;
          return {
            ...h,
            activeHoldCount: Math.max(0, h.activeHoldCount - 1),
            beds: {
              ...h.beds,
              [rejectedHold.bedType]: {
                ...currentBeds,
                available: Math.min(currentBeds.total, currentBeds.available + 1),
                held: Math.max(0, currentBeds.held - 1),
              },
            },
          };
        })
      );

      // Update emergency timeline if linked
      if (rejectedHold.emergencyId) {
        addTimelineEvent(
          rejectedHold.emergencyId,
          'hospital_rejected',
          `${rejectedHold.hospitalName}: ${reason}`
        );
      }

      // Track all hospitals that have already been offered or rejected
      const visitedIds = new Set<string>([
        ...(rejectedHold.rejectedHospitalIds || []),
        rejectedHold.hospitalId,
      ]);

      // Rank all remaining unvisited regional hospitals using multi-constraint criteria
      const unvisitedHospitals = hospitals.filter((h) => !visitedIds.has(h.id));

      const scoredCandidates = unvisitedHospitals.map((h) => {
        const bed = h.beds[rejectedHold.bedType];
        const available = bed?.available ?? 0;
        const dist = calculateHaversineDistance(liveCoordinates.lat, liveCoordinates.lng, h.lat, h.lng);
        const eta = estimateEmergencyTravelTime(dist, h.erLoad);

        let penalty = 0;
        if (available <= 0) penalty += 1500;
        else penalty -= available * 10;
        penalty += eta * 4;
        if (h.erLoad === 'Surge') penalty += 40;
        if (h.erLoad === 'Medium') penalty += 15;
        if (h.lastUpdatedMinutesAgo > 45) penalty += 50;
        if (h.diversionStatus === 'Diversion') penalty += 600;

        return { hospital: h, penalty, eta, dist, available };
      });

      scoredCandidates.sort((a, b) => a.penalty - b.penalty);
      const bestCandidate = scoredCandidates.find((c) => c.available > 0);
      const nextHospital = bestCandidate?.hospital;

      if (nextHospital && bestCandidate.available > 0) {
        const escalatedHoldId = `hold-esc-${Date.now()}`;
        const newEscalatedHold: HoldRequest = {
          ...rejectedHold,
          id: escalatedHoldId,
          hospitalId: nextHospital.id,
          hospitalName: nextHospital.name,
          etaMinutes: bestCandidate.eta,
          distanceKm: bestCandidate.dist,
          createdAt: Date.now(),
          expiresAt: Date.now() + 120 * 1000,
          status: 'pending',
          assignedBay: `Bay ${Math.floor(Math.random() * 4) + 1}`,
          rejectedHospitalIds: Array.from(visitedIds),
        };

        // Decrement next hospital bed
        setHospitals((prev) =>
          prev.map((h) => {
            if (h.id !== nextHospital.id) return h;
            const currentBeds = h.beds[rejectedHold.bedType];
            return {
              ...h,
              activeHoldCount: h.activeHoldCount + 1,
              beds: {
                ...h.beds,
                [rejectedHold.bedType]: {
                  ...currentBeds,
                  available: Math.max(0, currentBeds.available - 1),
                  held: currentBeds.held + 1,
                },
              },
            };
          })
        );

        // Update emergency with new hospital
        if (rejectedHold.emergencyId) {
          setEmergencies((prev) =>
            prev.map((e) => {
              if (e.id !== rejectedHold.emergencyId) return e;
              return {
                ...e,
                assignedHospitalId: nextHospital.id,
                assignedHospitalName: nextHospital.name,
                holdRequestId: escalatedHoldId,
                etaMinutes: bestCandidate.eta,
                timeline: [
                  ...e.timeline,
                  {
                    step: 'hospital_selected' as EmergencyTimelineStep,
                    timestamp: Date.now(),
                    label: TIMELINE_STEP_LABELS.hospital_selected,
                    detail: `Auto-escalated to next-best: ${nextHospital.name}`,
                  },
                ],
              };
            })
          );
        }

        setActiveHolds((prev) => [
          newEscalatedHold,
          ...prev.map((h) =>
            h.id === rejectedHold.id
              ? {
                  ...h,
                  status: (reason === 'Hold Expired' ? 'expired' : 'rejected') as 'expired' | 'rejected',
                  rejectionReason: reason,
                  escalatedToHospitalId: nextHospital.id,
                }
              : h
          ),
        ]);

        showNotification(
          `Hospital did not confirm within 2 minutes. Auto-offering next-best hospital: ${nextHospital.name} (120s window active).`,
          'alert'
        );
      } else {
        setActiveHolds((prev) =>
          prev.map((h) =>
            h.id === rejectedHold.id
              ? {
                  ...h,
                  status: (reason === 'Hold Expired' ? 'expired' : 'rejected') as 'expired' | 'rejected',
                  rejectionReason: `${reason}: All regional facilities at capacity`,
                }
              : h
          )
        );

        showNotification(
          `Hospital did not confirm. No secondary hospital currently has available beds. Dispatcher notified.`,
          'alert'
        );
      }
    },
    [hospitals, liveCoordinates, showNotification, addTimelineEvent]
  );

  const rejectHold = useCallback(
    (holdId: string, reason: string) => {
      const target = activeHolds.find((h) => h.id === holdId);
      if (!target) return;
      escalateHoldToNextHospital(target, reason);
    },
    [activeHolds, escalateHoldToNextHospital]
  );

  const markArrived = useCallback(
    (holdId: string) => {
      soundManager.playAcceptChime();
      soundManager.triggerVibration([60, 40, 60]);

      setActiveHolds((prev) =>
        prev.map((hold) => {
          if (hold.id !== holdId) return hold;
          return {
            ...hold,
            status: 'arrived',
          };
        })
      );

      const target = activeHolds.find((h) => h.id === holdId);
      if (target) {
        setHospitals((prev) =>
          prev.map((h) => {
            if (h.id !== target.hospitalId) return h;
            const currentBeds = h.beds[target.bedType];
            return {
              ...h,
              activeHoldCount: Math.max(0, h.activeHoldCount - 1),
              beds: {
                ...h.beds,
                [target.bedType]: {
                  ...currentBeds,
                  held: Math.max(0, currentBeds.held - 1),
                },
              },
            };
          })
        );

        showNotification(`Patient arrived and admitted at ${target.hospitalName}.`, 'success');
      }
    },
    [activeHolds, showNotification]
  );

  const cancelHold = useCallback(
    (holdId: string) => {
      const target = activeHolds.find((h) => h.id === holdId);
      if (!target) return;

      soundManager.playTap();

      // Only restore bed inventory if hold was active (pending or accepted)
      if (target.status === 'pending' || target.status === 'accepted') {
        setHospitals((prev) =>
          prev.map((h) => {
            if (h.id !== target.hospitalId) return h;
            const currentBeds = h.beds[target.bedType];
            if (!currentBeds) return h;
            return {
              ...h,
              activeHoldCount: Math.max(0, h.activeHoldCount - 1),
              beds: {
                ...h.beds,
                [target.bedType]: {
                  ...currentBeds,
                  available: Math.min(currentBeds.total, currentBeds.available + 1),
                  held: Math.max(0, currentBeds.held - 1),
                },
              },
            };
          })
        );
      }

      setActiveHolds((prev) => prev.filter((h) => h.id !== holdId));
      showNotification('Hold request cancelled.', 'info');
    },
    [activeHolds, showNotification]
  );

  // CITIZEN SOS ACTIONS
  const triggerCitizenSOS = useCallback(
    (category: EmergencyCategory, phone: string, notes: string): CitizenSOSRequest => {
      soundManager.playRejectTone();
      soundManager.triggerVibration([120, 80, 120]);

      const newRequest: CitizenSOSRequest = {
        id: `sos-${Date.now()}`,
        timestamp: Date.now(),
        category,
        callerPhone: phone || 'Emergency Caller',
        patientCount: 1,
        notes: notes || 'Citizen SOS trigger, urgent response required',
        lat: liveCoordinates.lat,
        lng: liveCoordinates.lng,
        addressApprox: 'GPS Location Verified (Sector Core)',
        assignedAmbulanceCallSign: 'Ambulance 104 (ALS Paramedic Unit)',
        status: 'dispatched',
        etaMinutes: 5,
      };

      setCitizenSOSRequests((prev) => [newRequest, ...prev]);

      // Pre-configure dispatch filter to match the emergency
      let mappedBed: BedTypeId = 'oxygen_bed';
      let mappedAcuity: TriageAcuity = 'Yellow';
      let mappedSpecialties: SpecialtyId[] = [];

      if (category === 'cardiac') {
        mappedBed = 'cardiac_monitored';
        mappedAcuity = 'Red';
        mappedSpecialties = ['cardiac_cath_lab'];
      } else if (category === 'respiratory') {
        mappedBed = 'icu_ventilator';
        mappedAcuity = 'Red';
        mappedSpecialties = ['ecmo'];
      } else if (category === 'burn') {
        mappedBed = 'burns_isolation';
        mappedAcuity = 'Yellow';
        mappedSpecialties = ['burn_unit'];
      } else if (category === 'trauma') {
        mappedBed = 'trauma_resuscitation';
        mappedAcuity = 'Red';
        mappedSpecialties = ['trauma_level_1'];
      } else if (category === 'stroke') {
        mappedBed = 'icu_non_ventilator';
        mappedAcuity = 'Red';
        mappedSpecialties = ['stroke_thrombectomy'];
      }

      setDispatchFilter((prev) => ({
        ...prev,
        requiredBedType: mappedBed,
        triageAcuity: mappedAcuity,
        requiredSpecialties: mappedSpecialties,
        patientConditionNote: `SOS Alert: ${category.toUpperCase()} - ${notes || 'Immediate assistance requested'}`,
      }));

      const fastPin = Math.floor(1000 + Math.random() * 9000).toString();
      setSosVerification({
        verifiedImmediately: true,
        callbackPhone: phone || 'Emergency Caller (Auto-Locked)',
        verificationPin: fastPin,
        teleTriageAudioConnected: false,
        dispatchConfirmedTimestamp: Date.now(),
      });

      showNotification('Emergency SOS transmitted. ALS Ambulance 104 dispatched.', 'alert');
      return newRequest;
    },
    [liveCoordinates, showNotification]
  );

  // EHR Ingestion Mode (Connected generic webhook vs alternate autonomous schedule)
  const [ehrMode, setEhrMode] = useState<EhrIntegrationMode>('hl7_fhir_connected');

  // Fast Citizen SOS Verification State
  const [sosVerification, setSosVerification] = useState<SosVerificationState | null>(null);

  // Rugged In-Vehicle MDT (Native Ambulance Tablet) State
  const [mdtTheme, setMdtTheme] = useState<MdtDisplayTheme>('tactical_night');
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(true);
  const [cardiacTelemetry, setCardiacTelemetry] = useState<CardiacMonitorTelemetry>({
    heartRate: 118,
    bloodPressure: '84/52',
    spo2: 83,
    etco2: 44,
    ecgRhythm: 'STEMI Anterior',
    monitorModel: 'Zoll X Series Advanced',
    isConnected: true,
  });

  const toggleWakeLock = useCallback(() => {
    setIsWakeLockActive((prev) => !prev);
  }, []);

  const updateCardiacTelemetry = useCallback((data: Partial<CardiacMonitorTelemetry>) => {
    setCardiacTelemetry((prev) => ({ ...prev, ...data }));
  }, []);

  const toggleMonitorConnection = useCallback(() => {
    setCardiacTelemetry((prev) => ({ ...prev, isConnected: !prev.isConnected }));
  }, []);

  const connectTeleTriageAudio = useCallback(() => {
    soundManager.playAcceptChime();
    setSosVerification((prev) =>
      prev ? { ...prev, teleTriageAudioConnected: true } : null
    );
    showNotification('Connected live audio with CAD Emergency Dispatcher.', 'success');
  }, [showNotification]);

  const ingestGenericWebhookPayload = useCallback((payload: GenericEhrWebhookPayload): boolean => {
    soundManager.playAcceptChime();
    soundManager.triggerVibration(50);
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.code !== payload.hospitalCode && h.id !== payload.hospitalCode) return h;
        const updatedBeds = { ...h.beds };
        Object.keys(payload.census).forEach((key) => {
          const bKey = key as BedTypeId;
          const newCounts = payload.census[bKey];
          if (newCounts) {
            updatedBeds[bKey] = {
              total: newCounts.total,
              available: newCounts.available,
              held: updatedBeds[bKey].held,
            };
          }
        });
        return {
          ...h,
          lastUpdatedMinutesAgo: 0,
          lastUpdatedTimestamp: Date.now(),
          beds: updatedBeds,
        };
      })
    );
    showNotification(`Generic REST Webhook ingested for ${payload.hospitalCode}. Bed counts updated.`, 'success');
    return true;
  }, [showNotification]);

  const cancelCitizenSOS = useCallback(
    (id: string) => {
      soundManager.playTap();
      setCitizenSOSRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'arrived' as const } : r))
      );
      showNotification('Citizen SOS marked resolved.', 'info');
    },
    [showNotification]
  );

  // SIMULATION HELPERS
  const simulateIncomingAmbulance = useCallback(() => {
    requestHold(
      'sjm-01',
      'icu_ventilator',
      'Ambulance 104 (ALS Paramedic Unit)',
      'Red',
      { bp: '82/50', hr: 132, spo2: 80, gcs: 8 }
    );
  }, [requestHold]);

  const simulateMassSurge = useCallback(() => {
    soundManager.triggerVibration([100, 100, 100]);
    setHospitals((prev) =>
      prev.map((h) => {
        const surgeBeds = { ...h.beds };
        Object.keys(surgeBeds).forEach((key) => {
          const bKey = key as BedTypeId;
          surgeBeds[bKey] = {
            ...surgeBeds[bKey],
            available: Math.max(0, Math.floor(surgeBeds[bKey].available * 0.4)),
          };
        });
        return {
          ...h,
          erLoad: 'Surge',
          diversionStatus: h.id === 'hch-04' ? 'Diversion' : 'Advisory',
          lastUpdatedMinutesAgo: 1,
          beds: surgeBeds,
        };
      })
    );
    showNotification('Simulated regional mass surge: ER load status updated.', 'warning');
  }, [showNotification]);

  // EHR and Night-Shift Ingestion Simulation
  const [ehrSyncStatus] = useState<EhrSyncStatus>('connected');
  const [lastEhrSyncTimestamp, setLastEhrSyncTimestamp] = useState<number>(Date.now());

  const simulateEhrEvent = useCallback(
    (eventType: 'ADT_A01_ADMIT' | 'ADT_A03_DISCHARGE') => {
      soundManager.playAcceptChime();
      soundManager.triggerVibration(40);
      const now = Date.now();
      setLastEhrSyncTimestamp(now);
      const targetBedType: BedTypeId = 'icu_ventilator';

      setHospitals((prev) =>
        prev.map((h) => {
          if (h.id !== currentHospitalId) return h;
          const currentBeds = h.beds[targetBedType];
          const newAvailable =
            eventType === 'ADT_A01_ADMIT'
              ? Math.max(0, currentBeds.available - 1)
              : Math.min(currentBeds.total, currentBeds.available + 1);

          return {
            ...h,
            lastUpdatedMinutesAgo: 0,
            lastUpdatedTimestamp: now,
            beds: {
              ...h.beds,
              [targetBedType]: {
                ...currentBeds,
                available: newAvailable,
              },
            },
          };
        })
      );

      if (eventType === 'ADT_A01_ADMIT') {
        showNotification(
          'HL7 ADT-A01 Admit: Patient registered in Epic EHR. ICU bed count auto-decremented.',
          'info'
        );
      } else {
        showNotification(
          'HL7 ADT-A03 Discharge: Patient discharged from ward. ICU bed auto-returned to inventory.',
          'success'
        );
      }
    },
    [currentHospitalId, showNotification]
  );

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_HOSPITALS);
    localStorage.removeItem(STORAGE_KEY_HOLDS);
    localStorage.removeItem(STORAGE_KEY_OFFLINE_QUEUE);
    localStorage.removeItem(STORAGE_KEY_CITIZEN_SOS);
    localStorage.removeItem(STORAGE_KEY_EMERGENCIES);
    setHospitals(INITIAL_HOSPITALS);
    setCitizenSOSRequests([]);
    setOfflineQueue([]);
    setEmergencies([]);
    const initialExpiry = Date.now() + 118 * 1000;
    setActiveHolds([
      {
        id: 'hold-demo-104',
        ambulanceCallSign: 'Ambulance 104 (ALS Paramedic Unit)',
        hospitalId: 'sjm-01',
        hospitalName: 'St. Jude Metropolitan Hospital',
        bedType: 'icu_ventilator',
        triageAcuity: 'Red',
        patientAgeGender: '62M',
        chiefComplaint: 'Acute Respiratory Distress / Severe Hypoxemia',
        vitalsSummary: {
          bp: '88/54',
          hr: 128,
          spo2: 82,
          gcs: 9,
        },
        etaMinutes: 6,
        distanceKm: 2.4,
        createdAt: Date.now() - 2 * 1000,
        expiresAt: initialExpiry,
        status: 'pending',
        assignedBay: 'Trauma Bay 2 - ICU',
        doctorInCharge: 'Dr. Katherine Vance, MD (Attending)',
      },
    ]);
    showNotification('System demo data reset to default.', 'info');
  }, [showNotification]);

  // Keep refs for latest holds & hospitals for timer efficiency without stale closures
  const holdsRef = React.useRef(activeHolds);
  holdsRef.current = activeHolds;
  const hospitalsRef = React.useRef(hospitals);
  hospitalsRef.current = hospitals;

  // Master countdown timer interval running every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const currentHolds = holdsRef.current;

      // Identify expired pending holds (exceeded 120s window)
      const expiredPending = currentHolds.filter(
        (h) => h.status === 'pending' && h.expiresAt <= now
      );

      if (expiredPending.length > 0) {
        expiredPending.forEach((hold) => {
          escalateHoldToNextHospital(hold, 'Hold Expired');
        });
      }

      // Periodically update hospital minutes ago ONLY when minute value changes
      const currentHospitals = hospitalsRef.current;
      let anyChanged = false;
      for (const h of currentHospitals) {
        const diffMinutes = Math.floor((now - h.lastUpdatedTimestamp) / 60000);
        if (diffMinutes !== h.lastUpdatedMinutesAgo) {
          anyChanged = true;
          break;
        }
      }

      if (anyChanged) {
        setHospitals((prevHospitals) =>
          prevHospitals.map((h) => {
            const diffMinutes = Math.floor((now - h.lastUpdatedTimestamp) / 60000);
            if (diffMinutes !== h.lastUpdatedMinutesAgo) {
              return {
                ...h,
                lastUpdatedMinutesAgo: diffMinutes,
              };
            }
            return h;
          })
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [escalateHoldToNextHospital]);

  return (
    <BedLinkContext.Provider
      value={{
        role,
        setRole,
        hospitals,
        currentHospitalId,
        setCurrentHospitalId,
        currentHospital,
        activeHolds,
        pendingHoldsCount,
        dispatchFilter,
        setDispatchFilter,
        toggleSpecialtyFilter,
        isMuted,
        toggleMute,
        lastSyncTimestamp,
        isLoadingRealHospitals,
        realHospitalSource,
        loadRealHospitalsForLocation,
        activeLocationName,
        liveCoordinates,
        gpsAccuracy,
        gpsError,
        isLocating,
        requestLiveLocation,
        isOnline,
        pendingOfflineSyncCount: offlineQueue.length,
        citizenSOSRequests,
        activeCitizenSOS,
        triggerCitizenSOS,
        cancelCitizenSOS,
        sosVerification,
        connectTeleTriageAudio,
        mdtTheme,
        setMdtTheme,
        isWakeLockActive,
        toggleWakeLock,
        cardiacTelemetry,
        updateCardiacTelemetry,
        toggleMonitorConnection,
        incrementBed,
        decrementBed,
        setBedPreset,
        syncAllBeds,
        bedLastUpdatedMap,
        requestHold,
        acceptHold,
        rejectHold,
        markArrived,
        cancelHold,
        simulateIncomingAmbulance,
        simulateMassSurge,
        resetAllData,
        ehrSyncStatus,
        ehrMode,
        setEhrMode,
        lastEhrSyncTimestamp,
        simulateEhrEvent,
        ingestGenericWebhookPayload,
        notificationMessage,
        dismissNotification,
        // Emergency lifecycle
        emergencies,
        activeEmergency,
        createEmergency,
        updateEmergencyStatus,
        addTimelineEvent,
        assignHospitalToEmergency,
        completeEmergency,
        ambulanceAction,
      }}
    >
      {children}
    </BedLinkContext.Provider>
  );
};

export const useBedLink = (): BedLinkContextType => {
  const context = useContext(BedLinkContext);
  if (!context) {
    throw new Error('useBedLink must be used within a BedLinkProvider');
  }
  return context;
};

// VitaRoute Aliases
export const VitaRouteProvider = BedLinkProvider;
export const useVitaRoute = useBedLink;
