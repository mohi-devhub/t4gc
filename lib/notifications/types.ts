/**
 * Notification Types and Interfaces
 * Defines the structure for notifications across all channels
 */

export type NotificationChannel = "email" | "sms" | "push" | "in-app";

export type NotificationStatus = "pending" | "sent" | "failed" | "delivered";

export type NotificationType =
  | "PARTICIPANT_APPROVED"
  | "PARTICIPANT_REMOVED"
  | "PARTICIPANT_ADDED"
  | "TEAM_ADDED"
  | "TOURNAMENT_REMINDER"
  | "SPONSORSHIP_UPDATE"
  | "ADMIN_NOTIFICATION";

export interface NotificationPayload {
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string; // email address, phone number, or user ID
  payload: {
    name?: string;
    team?: string;
    role?: string;
    contact?: string;
    message?: string;
    [key: string]: any; // Allow additional fields for flexibility
  };
  metadata?: {
    timestamp?: Date;
    source?: string;
    priority?: "low" | "normal" | "high";
    retryCount?: number;
  };
}

export interface NotificationResult {
  success: boolean;
  notificationId?: string;
  status: NotificationStatus;
  error?: string;
  channel: NotificationChannel;
  timestamp: Date;
}

export interface NotificationLog {
  id: string;
  type: NotificationType;
  recipient: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  timestamp: Date;
  error?: string;
  payload?: Record<string, any>;
}

export interface EmailNotificationData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

