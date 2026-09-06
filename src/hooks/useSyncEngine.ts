/**
 * Reactive Synchronization Engine Hook
 * Provides live connection status, outbox counts, sync runner controls,
 * and automatic triggers on window 'online' events and periodic heartbeat polling.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { HazardReport, SyncStats } from '../types/hazard';
import {
  getAllReports,
  getPendingReports,
  deleteSyncedReport,
  clearSyncedReports,
  DB_CHANGE_EVENT,
} from '../services/db';
import {
  runOutboxSync,
  setSimulatedOffline,
  isSimulatedOfflineMode,
  setSimulatedFailure,
} from '../services/syncRunner';
import { soundManager } from '../utils/sound';

export function useSyncEngine(options: { autoSyncIntervalMs?: number } = {}) {
  const { autoSyncIntervalMs = 7000 } = options;

  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOfflineState] = useState<boolean>(() => {
    return isSimulatedOfflineMode();
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [reports, setReports] = useState<HazardReport[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);

  const isSyncInProgressRef = useRef<boolean>(false);

  // Effective online state considering both hardware and simulated states
  const effectiveOnline = isBrowserOnline && !isSimulatedOffline;

  // Refresh reports from IndexedDB
  const refreshReports = useCallback(async () => {
    try {
      const data = await getAllReports();
      setReports(data);
    } catch (e) {
      console.error('Failed to query outbox reports:', e);
    }
  }, []);

  // Trigger sync runner
  const triggerSync = useCallback(async () => {
    if (isSyncInProgressRef.current) return;
    if (!effectiveOnline) return;

    isSyncInProgressRef.current = true;
    setIsSyncing(true);

    try {
      const result = await runOutboxSync();
      setLastSyncTime(Date.now());
      if (result.synced > 0) {
        soundManager.playSuccess();
      } else if (result.failed > 0) {
        soundManager.playAlert();
      }
    } catch (err) {
      console.warn('Sync runner cycle completed with error:', err);
    } finally {
      await refreshReports();
      setIsSyncing(false);
      isSyncInProgressRef.current = false;
    }
  }, [effectiveOnline, refreshReports]);

  // Handle hardware online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      // Automatically trigger sync when connectivity is restored
      triggerSync();
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  // Subscribe to DB changes (new hazard report added, status changed, etc.)
  useEffect(() => {
    refreshReports();

    const handleDBChange = () => {
      refreshReports();
    };

    window.addEventListener(DB_CHANGE_EVENT, handleDBChange);
    return () => {
      window.removeEventListener(DB_CHANGE_EVENT, handleDBChange);
    };
  }, [refreshReports]);

  // Interval-based poll checking navigator.onLine and triggering sync if pending items exist
  useEffect(() => {
    const timer = setInterval(() => {
      // Re-verify actual navigator.onLine
      const currentOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      if (currentOnline !== isBrowserOnline) {
        setIsBrowserOnline(currentOnline);
      }

      // If online and pending items exist, trigger auto-sync
      if (effectiveOnline && !isSyncInProgressRef.current) {
        getPendingReports().then((pending) => {
          if (pending.length > 0) {
            triggerSync();
          }
        });
      }
    }, autoSyncIntervalMs);

    return () => clearInterval(timer);
  }, [effectiveOnline, isBrowserOnline, triggerSync, autoSyncIntervalMs]);

  // Toggle simulated offline mode
  const toggleSimulatedOffline = useCallback(() => {
    const nextState = !isSimulatedOffline;
    setIsSimulatedOfflineState(nextState);
    setSimulatedOffline(nextState);
    soundManager.playClick();
  }, [isSimulatedOffline]);

  // Toggle simulated repeater failure
  const toggleSimulatedFailure = useCallback((val: boolean) => {
    setSimulatedFailure(val);
  }, []);

  // Delete a specific synced report
  const removeReport = useCallback(
    async (id: string) => {
      soundManager.playClick();
      await deleteSyncedReport(id);
      await refreshReports();
    },
    [refreshReports]
  );

  // Clear all synced reports
  const clearAllSynced = useCallback(async () => {
    soundManager.playClick();
    const count = await clearSyncedReports();
    await refreshReports();
    return count;
  }, [refreshReports]);

  // Calculated statistics
  const pendingCount = reports.filter((r) => r.syncStatus === 'pending').length;
  const syncingCount = reports.filter((r) => r.syncStatus === 'syncing').length;
  const syncedCount = reports.filter((r) => r.syncStatus === 'synced').length;
  const failedCount = reports.filter((r) => r.syncStatus === 'failed').length;

  const stats: SyncStats = {
    pendingCount,
    syncingCount,
    syncedCount,
    failedCount,
    totalCount: reports.length,
    isOnline: effectiveOnline,
    isSyncing,
    isSimulatedOffline,
  };

  return {
    ...stats,
    reports,
    lastSyncTime,
    triggerSync,
    toggleSimulatedOffline,
    toggleSimulatedFailure,
    removeReport,
    clearAllSynced,
    refreshReports,
  };
}

