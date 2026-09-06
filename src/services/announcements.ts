/**
 * Announcements & Committed Hazard Feed Service
 * Aggregates durable IndexedDB hazard reports with DGMS statutory bulletins
 */

import { getAllReports } from './db';
import { HazardReport } from '../types/hazard';
import {
  SafetyAnnouncement,
  ReportVerification,
  DirectiveAcknowledgment,
  FeedItem,
} from '../types/announcements';

const ANNOUNCEMENTS_STORAGE_KEY = 'coalguard_statutory_announcements';
const VERIFICATIONS_STORAGE_KEY = 'coalguard_report_verifications';
export const ANNOUNCEMENT_CHANGE_EVENT = 'minesafety:announcements_mutated';

// Initial pre-seeded official DGMS statutory safety bulletins
const INITIAL_ANNOUNCEMENTS: SafetyAnnouncement[] = [
  {
    id: 'ann-2025-01',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    title: 'DGMS Highwall Strata Precaution: Monsoon bench water drainage',
    content:
      'All Colliery Managers & Shift Overmen are directed to inspect Bench 4 toe drainage channels. Sump pumps must maintain continuous telemetry sync. Any tension fissures exceeding 5mm must be logged immediately via the Field App.',
    severity: 'critical',
    statutoryClause: 'CMR 2017 Reg 106 (4)(b)',
    collieryId: 'all_open_pits',
    collieryName: 'All Mechanized Opencast Collieries',
    author: {
      id: 'auth-dgms-hq',
      name: 'DGMS Safety Directorate',
      designation: 'DGMS Statutory Safety Director',
      role: 'authority',
      badge: 'DGMS-DIR-9921',
    },
    actionRequired: true,
    acknowledgments: [
      {
        userId: 'emp-408',
        userName: 'Arjun Sharma',
        userDesignation: 'Senior Shift Overman',
        badge: 'EMP-BCCL-4082',
        timestamp: Date.now() - 1000 * 60 * 20,
      },
    ],
  },
  {
    id: 'ann-2025-02',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    title: 'Mandatory HEMM Proximity Radar Verification on Haul Road 03',
    content:
      'Quarterly statutory calibration for Caterpillar 777D dump truck collision avoidance sensors is underway. Dump truck operators must verify proximity beeper functional checks prior to shift commencement.',
    severity: 'warning',
    statutoryClause: 'Mines Act 1952 Sec 22A',
    collieryId: 'bccl_moonidih',
    collieryName: 'BCCL Moonidih & Lodna Colliery',
    author: {
      id: 'auth-dgms-hq',
      name: 'DGMS Safety Directorate',
      designation: 'DGMS Statutory Safety Director',
      role: 'authority',
      badge: 'DGMS-DIR-9921',
    },
    actionRequired: false,
    acknowledgments: [],
  },
];

function notifyChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(ANNOUNCEMENT_CHANGE_EVENT));
  }
}

export function getStoredAnnouncements(): SafetyAnnouncement[] {
  if (typeof window === 'undefined') return INITIAL_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_ANNOUNCEMENTS));
      return INITIAL_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load announcements:', e);
    return INITIAL_ANNOUNCEMENTS;
  }
}

export function getStoredVerifications(): Record<string, ReportVerification> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(VERIFICATIONS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

/**
 * Broadcasts a new statutory announcement (Authority role only).
 */
export async function broadcastAnnouncement(
  data: Omit<SafetyAnnouncement, 'id' | 'timestamp' | 'acknowledgments'>
): Promise<SafetyAnnouncement> {
  const current = getStoredAnnouncements();
  const newAnnouncement: SafetyAnnouncement = {
    ...data,
    id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    acknowledgments: [],
  };

  const updated = [newAnnouncement, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
  }

  notifyChange();
  return newAnnouncement;
}

/**
 * Acknowledges a safety directive (Employee action).
 */
export async function acknowledgeAnnouncement(
  announcementId: string,
  ack: DirectiveAcknowledgment
): Promise<void> {
  const current = getStoredAnnouncements();
  const updated = current.map((ann) => {
    if (ann.id === announcementId) {
      const alreadyAcked = ann.acknowledgments.some((a) => a.userId === ack.userId);
      if (!alreadyAcked) {
        return {
          ...ann,
          acknowledgments: [...ann.acknowledgments, ack],
        };
      }
    }
    return ann;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(updated));
  }

  notifyChange();
}

/**
 * Digitally verifies and endorses a committed hazard report (Authority action).
 */
export async function verifyHazardReport(verification: ReportVerification): Promise<void> {
  const verifications = getStoredVerifications();
  verifications[verification.reportId] = verification;

  if (typeof window !== 'undefined') {
    localStorage.setItem(VERIFICATIONS_STORAGE_KEY, JSON.stringify(verifications));
  }

  notifyChange();
}

/**
 * Returns a unified chronological feed of both official bulletins and committed hazard reports.
 */
export async function getUnifiedFeed(): Promise<{
  announcements: SafetyAnnouncement[];
  hazardReports: HazardReport[];
  verifications: Record<string, ReportVerification>;
  feed: FeedItem[];
}> {
  const announcements = getStoredAnnouncements();
  const verifications = getStoredVerifications();
  let hazardReports: HazardReport[] = [];

  try {
    hazardReports = await getAllReports();
  } catch (err) {
    console.warn('Failed to fetch hazard reports from IndexedDB:', err);
  }

  // Combine into single chronological timeline
  const feed: FeedItem[] = [
    ...announcements.map((a) => ({
      kind: 'announcement' as const,
      data: a,
      timestamp: a.timestamp,
    })),
    ...hazardReports.map((h) => ({
      kind: 'hazard_report' as const,
      data: h,
      timestamp: h.timestamp,
    })),
  ];

  feed.sort((a, b) => b.timestamp - a.timestamp);

  return {
    announcements,
    hazardReports,
    verifications,
    feed,
  };
}

