import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  AppRole,
  Hospital,
  BedTypeId,
  HoldRequest,
  DispatchFilterState,
  TriageAcuity,
} from '../types/bedlink';
import { INITIAL_HOSPITALS } from '../data/mockHospitals';
import { soundManager } from '../utils/audio';

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
  isMuted: boolean;
  toggleMute: () => void;
  lastSyncTimestamp: number;
  
  // Nurse Actions
  incrementBed: (hospitalId: string, bedType: BedTypeId) => void;
  decrementBed: (hospitalId: string, bedType: BedTypeId) => void;
  setBedPreset: (hospitalId: string, preset: 'all_full' | 'reset_default' | 'surge_capacity') => void;
  syncAllBeds: (hospitalId: string) => void;
  bedLastUpdatedMap: Record<string, number>; // hospitalId-bedType -> timestamp

  // Dispatch Actions
  requestHold: (
    hospitalId: string,
    bedType: BedTypeId,
    overrideCallSign?: string,
    overrideAcuity?: TriageAcuity,
    overrideVitals?: { bp: string; hr: number; spo2: number; gcs: number }
  ) => HoldRequest;

  // ER Actions
  acceptHold: (holdId: string, assignedBay?: string) => void;
  rejectHold: (holdId: string, reason: string) => void;
  markArrived: (holdId: string) => void;
  cancelHold: (holdId: string) => void;

  // Simulation & System Actions
  simulateIncomingAmbulance: () => void;
  simulateMassSurge: () => void;
  resetAllData: () => void;
  notificationMessage: { text: string; type: 'success' | 'warning' | 'alert' | 'info' } | null;
  dismissNotification: () => void;
}

const STORAGE_KEY_HOSPITALS = 'bedlink_hospitals_v3';
const STORAGE_KEY_HOLDS = 'bedlink_holds_v3';

const BedLinkContext = createContext<BedLinkContextType | null>(null);

export const BedLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('nurse');
  const [currentHospitalId, setCurrentHospitalId] = useState<string>('sjm-01');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number>(Date.now());
  const [bedLastUpdatedMap, setBedLastUpdatedMap] = useState<Record<string, number>>({});
  const [notificationMessage, setNotificationMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'alert' | 'info';
  } | null>(null);

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
        ambulanceCallSign: 'Ambulance #104 (ALS Paramedic Unit)',
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
        etaMinutes: 8,
        distanceKm: 3.2,
        createdAt: Date.now() - 5 * 1000,
        expiresAt: initialExpiry,
        status: 'pending',
        assignedBay: 'Trauma Bay 2 - ICU',
        doctorInCharge: 'Dr. Katherine Vance, MD (Attending)',
      },
    ];
  });

  // Dispatch filter state
  const [dispatchFilter, setDispatchFilter] = useState<DispatchFilterState>({
    triageAcuity: 'Red',
    requiredBedType: 'icu_ventilator',
    locationSector: 'sec-downtown',
    ambulanceCallSign: 'Ambulance #104 (ALS Paramedic Unit)',
    patientConditionNote: 'Acute Respiratory Distress · Intubated en route',
  });

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

  // Current selected hospital
  const currentHospital = useMemo(() => {
    return hospitals.find((h) => h.id === currentHospitalId) || hospitals[0];
  }, [hospitals, currentHospitalId]);

  // Count pending holds
  const pendingHoldsCount = useMemo(() => {
    return activeHolds.filter((h) => h.status === 'pending').length;
  }, [activeHolds]);

  const dismissNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  const showNotification = useCallback((text: string, type: 'success' | 'warning' | 'alert' | 'info') => {
    setNotificationMessage({ text, type });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // NURSE ACTIONS
  const incrementBed = useCallback((hospitalId: string, bedType: BedTypeId) => {
    soundManager.playTap();
    soundManager.triggerVibration(30);

    const now = Date.now();
    setBedLastUpdatedMap((prev) => ({
      ...prev,
      [`${hospitalId}-${bedType}`]: now,
    }));

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
      overrideVitals?: { bp: string; hr: number; spo2: number; gcs: number }
    ) => {
      const targetHospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
      const callSign = overrideCallSign || dispatchFilter.ambulanceCallSign;
      const acuity = overrideAcuity || dispatchFilter.triageAcuity;

      soundManager.playAcceptChime();
      soundManager.triggerVibration([80, 50, 80]);

      // Decrement available bed count optimistically & increase held count
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
      };

      setActiveHolds((prev) => [newHold, ...prev]);

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
      }
    },
    [activeHolds, showNotification]
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
          return {
            ...h,
            activeHoldCount: Math.max(0, h.activeHoldCount - 1),
            beds: {
              ...h.beds,
              [rejectedHold.bedType]: {
                ...currentBeds,
                available: currentBeds.available + 1,
                held: Math.max(0, currentBeds.held - 1),
              },
            },
          };
        })
      );

      // Find next best eligible hospital with available bed
      const candidateHospitals = hospitals.filter(
        (h) => h.id !== rejectedHold.hospitalId && h.beds[rejectedHold.bedType].available > 0
      );

      candidateHospitals.sort((a, b) => a.travelTimeMins - b.travelTimeMins);

      const nextHospital = candidateHospitals[0] || (hospitals.find((h) => h.id !== rejectedHold.hospitalId) ?? hospitals[1]);

      if (nextHospital) {
        const escalatedHoldId = `hold-esc-${Date.now()}`;
        const newEscalatedHold: HoldRequest = {
          ...rejectedHold,
          id: escalatedHoldId,
          hospitalId: nextHospital.id,
          hospitalName: nextHospital.name,
          etaMinutes: nextHospital.travelTimeMins + 3,
          distanceKm: nextHospital.distanceKm + 1.1,
          createdAt: Date.now(),
          expiresAt: Date.now() + 120 * 1000,
          status: 'pending',
          assignedBay: `Bay ${Math.floor(Math.random() * 4) + 1}`,
        };

        // Decrement next hospital's bed
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
          `Hospital did not confirm. Contacting next available hospital (${nextHospital.name})...`,
          'alert'
        );
      } else {
        setActiveHolds((prev) =>
          prev.map((h) =>
            h.id === rejectedHold.id
              ? {
                  ...h,
                  status: 'expired',
                  rejectionReason: 'All regional facilities at capacity',
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
    [hospitals, showNotification]
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
                available: currentBeds.available + 1,
                held: Math.max(0, currentBeds.held - 1),
              },
            },
          };
        })
      );

      setActiveHolds((prev) => prev.filter((h) => h.id !== holdId));
      showNotification('Hold request cancelled.', 'info');
    },
    [activeHolds, showNotification]
  );

  // SIMULATION HELPERS
  const simulateIncomingAmbulance = useCallback(() => {
    requestHold(
      'sjm-01',
      'icu_ventilator',
      'Ambulance #104 (ALS Paramedic Unit)',
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

  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_HOSPITALS);
    localStorage.removeItem(STORAGE_KEY_HOLDS);
    setHospitals(INITIAL_HOSPITALS);
    const initialExpiry = Date.now() + 118 * 1000;
    setActiveHolds([
      {
        id: 'hold-demo-104',
        ambulanceCallSign: 'Ambulance #104 (ALS Paramedic Unit)',
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
        etaMinutes: 8,
        distanceKm: 3.2,
        createdAt: Date.now() - 2 * 1000,
        expiresAt: initialExpiry,
        status: 'pending',
        assignedBay: 'Trauma Bay 2 - ICU',
        doctorInCharge: 'Dr. Katherine Vance, MD (Attending)',
      },
    ]);
    showNotification('System demo data reset to default.', 'info');
  }, [showNotification]);

  // Master countdown timer interval running every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setActiveHolds((prevHolds) => {
        let hasExpiredHold = false;
        const updated = prevHolds.map((hold) => {
          if (hold.status === 'pending') {
            const timeLeft = Math.max(0, Math.floor((hold.expiresAt - now) / 1000));
            if (timeLeft <= 0) {
              hasExpiredHold = true;
              return { ...hold, status: 'expired' as const, rejectionReason: 'Hold Expired (120s timeout)' };
            }
          }
          return hold;
        });

        if (hasExpiredHold) {
          prevHolds.forEach((hold) => {
            if (hold.status === 'pending' && hold.expiresAt <= now) {
              escalateHoldToNextHospital(hold, 'Hold Expired');
            }
          });
        }

        return updated;
      });

      // Periodically update hospital minutes ago
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
        isMuted,
        toggleMute,
        lastSyncTimestamp,
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
        notificationMessage,
        dismissNotification,
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
