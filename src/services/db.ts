/**
 * Mission-Critical IndexedDB Storage Layer
 * Database: MineSafetyDB
 * Store: hazard_outbox
 *
 * Implements durable, zero-overhead storage for offline hazard logging in open-pit coal mines.
 * Stores binary image and audio Blobs directly without base64 conversions to minimize memory footprints.
 */

import { HazardReport, SyncStatus } from '../types/hazard';

const DB_NAME = 'MineSafetyDB';
const DB_VERSION = 1;
const STORE_NAME = 'hazard_outbox';

// Custom event name for notifying subscribers across components of outbox mutations
export const DB_CHANGE_EVENT = 'minesafety:outbox_mutated';

function notifyDBChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT));
  }
}

let dbInstance: IDBDatabase | null = null;
let dbOpeningPromise: Promise<IDBDatabase> | null = null;

/**
 * Opens and initializes the MineSafetyDB database with the hazard_outbox store and indexes.
 */
export function openMineSafetyDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  if (dbOpeningPromise) {
    return dbOpeningPromise;
  }

  dbOpeningPromise = new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Index by syncStatus for quick retrieval of 'pending' / 'syncing' items
        store.createIndex('syncStatus', 'syncStatus', { unique: false });
        // Index by timestamp for chronological sorting
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      dbOpeningPromise = null;

      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
      };

      resolve(dbInstance);
    };

    request.onerror = () => {
      dbOpeningPromise = null;
      reject(request.error || new Error('Failed to open MineSafetyDB.'));
    };

    request.onblocked = () => {
      console.warn('MineSafetyDB open request blocked by another tab.');
    };
  });

  return dbOpeningPromise;
}

/**
 * Saves or updates a HazardReport in the hazard_outbox store.
 * @param report The immutable hazard report object.
 */
export async function saveHazardReport(report: HazardReport): Promise<string> {
  const db = await openMineSafetyDB();

  return new Promise<string>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(report);

    request.onsuccess = () => {
      notifyDBChange();
      resolve(report.id);
    };

    request.onerror = () => {
      reject(request.error || new Error(`Failed to save hazard report: ${report.id}`));
    };

    tx.onabort = () => {
      reject(tx.error || new Error('Transaction aborted while saving report.'));
    };
  });
}

/**
 * Retrieves all hazard reports with syncStatus === 'pending'.
 */
export async function getPendingReports(): Promise<HazardReport[]> {
  const db = await openMineSafetyDB();

  return new Promise<HazardReport[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('syncStatus');
    const request = index.getAll('pending');

    request.onsuccess = () => {
      resolve((request.result as HazardReport[]) || []);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to query pending hazard reports.'));
    };
  });
}

/**
 * Retrieves all hazard reports regardless of status, sorted newest first.
 */
export async function getAllReports(): Promise<HazardReport[]> {
  const db = await openMineSafetyDB();

  return new Promise<HazardReport[]>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const reports = (request.result as HazardReport[]) || [];
      // Sort newest first
      reports.sort((a, b) => b.timestamp - a.timestamp);
      resolve(reports);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to fetch outbox hazard reports.'));
    };
  });
}

/**
 * Retrieves a single hazard report by its ID.
 */
export async function getReportById(id: string): Promise<HazardReport | undefined> {
  const db = await openMineSafetyDB();

  return new Promise<HazardReport | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result as HazardReport | undefined);
    };

    request.onerror = () => {
      reject(request.error || new Error(`Failed to load hazard report: ${id}`));
    };
  });
}

/**
 * Updates the syncStatus (and optional metadata like retryCount or errorMessage) of a report.
 * @param id The report UUID
 * @param status 'pending' | 'syncing' | 'synced' | 'failed'
 * @param extra Optional partial updates (e.g. retryCount, lastAttemptTimestamp, syncedTimestamp)
 */
export async function updateReportStatus(
  id: string,
  status: SyncStatus,
  extra: Partial<HazardReport> = {}
): Promise<void> {
  const db = await openMineSafetyDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const report = getRequest.result as HazardReport | undefined;
      if (!report) {
        resolve();
        return;
      }

      const updatedReport: HazardReport = {
        ...report,
        ...extra,
        syncStatus: status,
      };

      const putRequest = store.put(updatedReport);

      putRequest.onsuccess = () => {
        notifyDBChange();
        resolve();
      };

      putRequest.onerror = () => {
        reject(putRequest.error || new Error(`Failed to update status for report ${id}`));
      };
    };

    getRequest.onerror = () => {
      reject(getRequest.error || new Error(`Report ${id} not found for status update.`));
    };

    tx.onabort = () => {
      reject(tx.error || new Error('Transaction aborted during status update.'));
    };
  });
}

/**
 * Deletes a synced report from the local outbox to free device storage.
 * @param id The report UUID
 */
export async function deleteSyncedReport(id: string): Promise<void> {
  const db = await openMineSafetyDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      notifyDBChange();
      resolve();
    };

    request.onerror = () => {
      reject(request.error || new Error(`Failed to delete synced report: ${id}`));
    };

    tx.onabort = () => {
      reject(tx.error || new Error('Transaction aborted while deleting synced report.'));
    };
  });
}

/**
 * Clears all successfully synced reports from the outbox.
 */
export async function clearSyncedReports(): Promise<number> {
  const all = await getAllReports();
  const synced = all.filter((r) => r.syncStatus === 'synced');
  for (const report of synced) {
    await deleteSyncedReport(report.id);
  }
  return synced.length;
}

