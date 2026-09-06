/**
 * Hazard Logging & Media Capture Data Types
 * Designed for mission-critical offline operations in open-pit coal mine environments.
 */

export type HazardType =
  | 'crack'
  | 'rockfall'
  | 'leak'
  | 'equipment_failure'
  | 'gas_ventilation'
  | 'dust_blasting'
  | 'other';

export type HazardSeverity = 'low' | 'medium' | 'high' | 'critical';

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export interface HazardCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
}

export interface HazardReport {
  /** Unique identifier (UUIDv4 or nanoid) */
  id: string;

  /** UTC Unix timestamp (milliseconds) when the hazard was captured */
  timestamp: number;

  /** Statutory hazard classification */
  type: HazardType;

  /** Optional CMR 2017 severity rating */
  severity?: HazardSeverity;

  /** Statutory Regulation Reference (e.g. CMR 2017 Reg 106) */
  statutoryClause?: string;

  /** Optional field inspector operational notes */
  description?: string;

  /**
   * Device coordinates captured via navigator.geolocation.getCurrentPosition (high accuracy).
   * Graceful Degradation: null if GPS permission was denied or timed out.
   */
  coordinates: HazardCoordinates | null;

  /** Warning flag / note when coordinates fallback occurs (e.g. pit bench estimate) */
  geoWarning?: string;

  /** Captured visual evidence (PNG/JPEG) */
  imageBlob?: Blob;

  /** Voice note recording (audio/webm or audio/ogg) */
  audioBlob?: Blob;

  /** Outbox queue lifecycle state */
  syncStatus: SyncStatus;

  /** Network dispatch retry attempts counter */
  retryCount: number;

  /** Timestamp of the most recent sync attempt */
  lastAttemptTimestamp?: number;

  /** Timestamp of successful DGMS cloud node synchronization */
  syncedTimestamp?: number;

  /** Error diagnostic trace from last transmission failure */
  errorMessage?: string;
}

export interface SyncStats {
  pendingCount: number;
  syncingCount: number;
  syncedCount: number;
  failedCount: number;
  totalCount: number;
  isOnline: boolean;
  isSyncing: boolean;
  isSimulatedOffline: boolean;
}

