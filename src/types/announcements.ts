/**
 * Statutory Announcements & Committed Hazard Feed Types
 */

import { HazardReport } from './hazard';

export type AnnouncementSeverity = 'critical' | 'warning' | 'info';

export interface DirectiveAcknowledgment {
  userId: string;
  userName: string;
  userDesignation: string;
  badge: string;
  timestamp: number;
}

export interface ReportVerification {
  reportId: string;
  verifiedBy: string;
  verifierDesignation: string;
  verifierBadge: string;
  verifiedAt: number;
  actionDirective: 'monitor' | 'remediate' | 'evacuate_bench' | 'resolved';
  authorityNotes?: string;
  statutoryHash: string;
}

export interface SafetyAnnouncement {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  severity: AnnouncementSeverity;
  statutoryClause?: string;
  collieryId: string;
  collieryName: string;
  author: {
    id: string;
    name: string;
    designation: string;
    role: 'authority';
    badge: string;
  };
  actionRequired?: boolean;
  acknowledgments: DirectiveAcknowledgment[];
}

export interface FeedItem {
  kind: 'announcement' | 'hazard_report';
  data: SafetyAnnouncement | HazardReport;
  timestamp: number;
}

