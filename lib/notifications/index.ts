/**
 * Central Notification Manager
 * Dispatches notifications to the appropriate channels
 */

import { NotificationPayload, NotificationResult, NotificationLog, NotificationChannel } from "./types";
import { sendEmailNotification } from "./channels/email";

// In-memory notification log (in production, this should be stored in a database)
const notificationLog: NotificationLog[] = [];

/**
 * Send a notification through the specified channel
 */
export async function sendNotification(
  payload: NotificationPayload
): Promise<NotificationResult> {
  const { channel, type, recipient } = payload;

  // Create log entry
  const logEntry: NotificationLog = {
    id: generateNotificationId(),
    type,
    recipient,
    channel,
    status: "pending",
    timestamp: new Date(),
    payload: payload.payload,
  };

  notificationLog.push(logEntry);

  try {
    let result: NotificationResult;

    // Route to appropriate channel
    switch (channel) {
      case "email":
        result = await sendEmailNotification(payload);
        break;

      case "sms":
        // TODO: Implement SMS channel
        result = {
          success: false,
          status: "failed",
          channel: "sms",
          timestamp: new Date(),
          error: "SMS channel not yet implemented",
        };
        break;

      case "push":
        // TODO: Implement push notification channel
        result = {
          success: false,
          status: "failed",
          channel: "push",
          timestamp: new Date(),
          error: "Push notification channel not yet implemented",
        };
        break;

      case "in-app":
        // TODO: Implement in-app notification channel
        result = {
          success: false,
          status: "failed",
          channel: "in-app",
          timestamp: new Date(),
          error: "In-app notification channel not yet implemented",
        };
        break;

      default:
        result = {
          success: false,
          status: "failed",
          channel: channel,
          timestamp: new Date(),
          error: `Unsupported notification channel: ${channel}`,
        };
    }

    // Update log entry with result
    const logIndex = notificationLog.findIndex((log) => log.id === logEntry.id);
    if (logIndex !== -1) {
      notificationLog[logIndex] = {
        ...notificationLog[logIndex],
        status: result.status,
        error: result.error,
      };
    }

    if (result.notificationId) {
      logEntry.id = result.notificationId;
    }

    return result;
  } catch (error) {
    // Update log entry with error
    const logIndex = notificationLog.findIndex((log) => log.id === logEntry.id);
    if (logIndex !== -1) {
      notificationLog[logIndex] = {
        ...notificationLog[logIndex],
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }

    return {
      success: false,
      status: "failed",
      channel,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get notification logs (for admin viewing)
 */
export function getNotificationLogs(limit?: number): NotificationLog[] {
  const logs = [...notificationLog].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
  return limit ? logs.slice(0, limit) : logs;
}

/**
 * Get notification logs by type
 */
export function getNotificationLogsByType(type: NotificationPayload["type"]): NotificationLog[] {
  return notificationLog.filter((log) => log.type === type);
}

/**
 * Get notification logs by recipient
 */
export function getNotificationLogsByRecipient(recipient: string): NotificationLog[] {
  return notificationLog.filter((log) => log.recipient === recipient);
}

/**
 * Get notification statistics
 */
export function getNotificationStats() {
  const total = notificationLog.length;
  const byStatus = notificationLog.reduce(
    (acc, log) => {
      acc[log.status] = (acc[log.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const byChannel = notificationLog.reduce(
    (acc, log) => {
      acc[log.channel] = (acc[log.channel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const byType = notificationLog.reduce(
    (acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    total,
    byStatus,
    byChannel,
    byType,
  };
}

/**
 * Helper function to generate unique notification ID
 */
function generateNotificationId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Convenience functions for common notification types
 */
export async function notifyParticipantApproved(
  email: string,
  data: { name: string; team: string; role: string }
): Promise<NotificationResult> {
  return sendNotification({
    type: "PARTICIPANT_APPROVED",
    channel: "email",
    recipient: email,
    payload: data,
  });
}

export async function notifyParticipantRemoved(
  email: string,
  data: { name: string; team: string; role: string; message?: string }
): Promise<NotificationResult> {
  return sendNotification({
    type: "PARTICIPANT_REMOVED",
    channel: "email",
    recipient: email,
    payload: data,
  });
}

export async function notifyParticipantAdded(
  email: string,
  data: { name: string; team: string; role: string }
): Promise<NotificationResult> {
  return sendNotification({
    type: "PARTICIPANT_ADDED",
    channel: "email",
    recipient: email,
    payload: data,
  });
}

export async function notifyTeamAdded(
  emails: string[],
  data: { teamName: string; memberCount: number }
): Promise<NotificationResult[]> {
  const results = await Promise.allSettled(
    emails.map((email) =>
      sendNotification({
        type: "TEAM_ADDED",
        channel: "email",
        recipient: email,
        payload: {
          name: email.split("@")[0], // Extract name from email as fallback
          team: data.teamName,
          ...data,
        },
      })
    )
  );

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : ({
          success: false,
          status: "failed" as const,
          channel: "email" as NotificationChannel,
          timestamp: new Date(),
          error: result.reason?.message || "Unknown error",
        } as NotificationResult)
  );
}

