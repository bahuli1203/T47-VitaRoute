/**
 * VitaRoute IndexedDB Storage Engine
 * Persistent client-side database for emergency cases, active holds, citizen SOS, and real-time hospital rosters.
 */

import { Emergency, HoldRequest, CitizenSOSRequest, Hospital, DoctorSchedule } from '../types/bedlink';

const DB_NAME = 'vitaroute_mumbai_db';
const DB_VERSION = 1;

export const STORES = {
  EMERGENCIES: 'emergencies',
  HOLDS: 'holds',
  CITIZEN_SOS: 'citizen_sos',
  HOSPITALS: 'hospitals',
  DOCTORS: 'doctors',
} as const;

let dbInstance: IDBDatabase | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initializes and returns the IndexedDB database instance
 */
export function openVitaRouteDB(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(STORES.EMERGENCIES)) {
        const store = db.createObjectStore(STORES.EMERGENCIES, { keyPath: 'id' });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.HOLDS)) {
        const store = db.createObjectStore(STORES.HOLDS, { keyPath: 'id' });
        store.createIndex('hospitalId', 'hospitalId', { unique: false });
        store.createIndex('status', 'status', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CITIZEN_SOS)) {
        const store = db.createObjectStore(STORES.CITIZEN_SOS, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.HOSPITALS)) {
        db.createObjectStore(STORES.HOSPITALS, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(STORES.DOCTORS)) {
        const store = db.createObjectStore(STORES.DOCTORS, { keyPath: 'id' });
        store.createIndex('hospitalId', 'hospitalId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

// Generic transaction helper
async function performTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
): Promise<T> {
  const db = await openVitaRouteDB();
  return new Promise<T>((resolve, reject) => {
    try {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const req = callback(store);

      if (req) {
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      } else {
        transaction.oncomplete = () => resolve(undefined as unknown as T);
        transaction.onerror = () => reject(transaction.error);
      }
    } catch (err) {
      reject(err);
    }
  });
}

// ----------------- Emergencies (Cases) -----------------

export async function dbSaveEmergency(emergency: Emergency): Promise<void> {
  try {
    await performTransaction(STORES.EMERGENCIES, 'readwrite', (store) => {
      store.put(emergency);
    });
  } catch (err) {
    console.warn('Failed to save emergency to IndexedDB, fallback to localStorage', err);
  }
}

export async function dbSaveEmergencies(emergencies: Emergency[]): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const tx = db.transaction(STORES.EMERGENCIES, 'readwrite');
    const store = tx.objectStore(STORES.EMERGENCIES);
    for (const emg of emergencies) {
      store.put(emg);
    }
  } catch (err) {
    console.warn('Failed to batch save emergencies to IndexedDB', err);
  }
}

export async function dbGetEmergencies(): Promise<Emergency[]> {
  try {
    return await performTransaction<Emergency[]>(STORES.EMERGENCIES, 'readonly', (store) => {
      return store.getAll();
    });
  } catch (err) {
    console.warn('Failed to get emergencies from IndexedDB', err);
    return [];
  }
}

// ----------------- Active Holds -----------------

export async function dbSaveHold(hold: HoldRequest): Promise<void> {
  try {
    await performTransaction(STORES.HOLDS, 'readwrite', (store) => {
      store.put(hold);
    });
  } catch (err) {
    console.warn('Failed to save hold to IndexedDB', err);
  }
}

export async function dbSaveHolds(holds: HoldRequest[]): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const tx = db.transaction(STORES.HOLDS, 'readwrite');
    const store = tx.objectStore(STORES.HOLDS);
    for (const hold of holds) {
      store.put(hold);
    }
  } catch (err) {
    console.warn('Failed to batch save holds to IndexedDB', err);
  }
}

export async function dbGetHolds(): Promise<HoldRequest[]> {
  try {
    return await performTransaction<HoldRequest[]>(STORES.HOLDS, 'readonly', (store) => {
      return store.getAll();
    });
  } catch (err) {
    console.warn('Failed to get holds from IndexedDB', err);
    return [];
  }
}

// ----------------- Citizen SOS Requests -----------------

export async function dbSaveCitizenSOS(request: CitizenSOSRequest): Promise<void> {
  try {
    await performTransaction(STORES.CITIZEN_SOS, 'readwrite', (store) => {
      store.put(request);
    });
  } catch (err) {
    console.warn('Failed to save Citizen SOS to IndexedDB', err);
  }
}

export async function dbSaveCitizenSOSRequests(requests: CitizenSOSRequest[]): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const tx = db.transaction(STORES.CITIZEN_SOS, 'readwrite');
    const store = tx.objectStore(STORES.CITIZEN_SOS);
    for (const req of requests) {
      store.put(req);
    }
  } catch (err) {
    console.warn('Failed to batch save Citizen SOS to IndexedDB', err);
  }
}

export async function dbGetCitizenSOSRequests(): Promise<CitizenSOSRequest[]> {
  try {
    return await performTransaction<CitizenSOSRequest[]>(STORES.CITIZEN_SOS, 'readonly', (store) => {
      return store.getAll();
    });
  } catch (err) {
    console.warn('Failed to get Citizen SOS requests from IndexedDB', err);
    return [];
  }
}

// ----------------- Hospitals -----------------

export async function dbSaveHospitals(hospitals: Hospital[]): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const tx = db.transaction(STORES.HOSPITALS, 'readwrite');
    const store = tx.objectStore(STORES.HOSPITALS);
    for (const hosp of hospitals) {
      store.put(hosp);
    }
  } catch (err) {
    console.warn('Failed to save hospitals to IndexedDB', err);
  }
}

export async function dbGetHospitals(): Promise<Hospital[]> {
  try {
    return await performTransaction<Hospital[]>(STORES.HOSPITALS, 'readonly', (store) => {
      return store.getAll();
    });
  } catch (err) {
    console.warn('Failed to get hospitals from IndexedDB', err);
    return [];
  }
}

// ----------------- Doctors -----------------

export async function dbSaveDoctors(doctors: DoctorSchedule[]): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const tx = db.transaction(STORES.DOCTORS, 'readwrite');
    const store = tx.objectStore(STORES.DOCTORS);
    for (const doc of doctors) {
      store.put(doc);
    }
  } catch (err) {
    console.warn('Failed to save doctors to IndexedDB', err);
  }
}

export async function dbGetDoctors(): Promise<DoctorSchedule[]> {
  try {
    return await performTransaction<DoctorSchedule[]>(STORES.DOCTORS, 'readonly', (store) => {
      return store.getAll();
    });
  } catch (err) {
    console.warn('Failed to get doctors from IndexedDB', err);
    return [];
  }
}

export async function dbDeleteHold(id: string): Promise<void> {
  try {
    await performTransaction(STORES.HOLDS, 'readwrite', (store) => {
      store.delete(id);
    });
  } catch (err) {
    console.warn('Failed to delete hold from IndexedDB', err);
  }
}

export async function dbDeleteEmergency(id: string): Promise<void> {
  try {
    await performTransaction(STORES.EMERGENCIES, 'readwrite', (store) => {
      store.delete(id);
    });
  } catch (err) {
    console.warn('Failed to delete emergency from IndexedDB', err);
  }
}

export async function dbDeleteCitizenSOS(id: string): Promise<void> {
  try {
    await performTransaction(STORES.CITIZEN_SOS, 'readwrite', (store) => {
      store.delete(id);
    });
  } catch (err) {
    console.warn('Failed to delete Citizen SOS from IndexedDB', err);
  }
}

/**
 * Resets/clears all stores in the IndexedDB
 */
export async function dbResetAll(): Promise<void> {
  try {
    const db = await openVitaRouteDB();
    const storeNames = [
      STORES.EMERGENCIES,
      STORES.HOLDS,
      STORES.CITIZEN_SOS,
      STORES.HOSPITALS,
      STORES.DOCTORS,
    ];
    const tx = db.transaction(storeNames, 'readwrite');
    for (const name of storeNames) {
      tx.objectStore(name).clear();
    }
  } catch (err) {
    console.warn('Failed to reset IndexedDB', err);
  }
}
