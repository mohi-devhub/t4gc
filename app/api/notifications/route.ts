/**
 * Notification API Route
 * Handles notification requests from the client
 */

import { NextRequest, NextResponse } from "next/server";
import {
  sendNotification,
  notifyParticipantApproved,
  notifyParticipantRemoved,
  notifyParticipantAdded,
  notifyTeamAdded,
} from "@/lib/notifications";
import type { NotificationPayload } from "@/lib/notifications/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    let result;

    switch (action) {
      case "participant-approved":
        if (!data.email || !data.name || !data.team || !data.role) {
          return NextResponse.json(
            { error: "Missing required fields: email, name, team, role" },
            { status: 400 }
          );
        }
        result = await notifyParticipantApproved(data.email, {
          name: data.name,
          team: data.team,
          role: data.role,
        });
        break;

      case "participant-removed":
        if (!data.email || !data.name || !data.team || !data.role) {
          return NextResponse.json(
            { error: "Missing required fields: email, name, team, role" },
            { status: 400 }
          );
        }
        result = await notifyParticipantRemoved(data.email, {
          name: data.name,
          team: data.team,
          role: data.role,
          message: data.message,
        });
        break;

      case "participant-added":
        if (!data.email || !data.name || !data.team || !data.role) {
          return NextResponse.json(
            { error: "Missing required fields: email, name, team, role" },
            { status: 400 }
          );
        }
        result = await notifyParticipantAdded(data.email, {
          name: data.name,
          team: data.team,
          role: data.role,
        });
        break;

      case "team-added":
        if (!data.emails || !Array.isArray(data.emails) || !data.teamName || !data.memberCount) {
          return NextResponse.json(
            { error: "Missing required fields: emails (array), teamName, memberCount" },
            { status: 400 }
          );
        }
        const results = await notifyTeamAdded(data.emails, {
          teamName: data.teamName,
          memberCount: data.memberCount,
        });
        return NextResponse.json({
          success: results.some((r) => r.success),
          results,
        });

      case "custom":
        // Allow custom notification payloads
        const customPayload: NotificationPayload = data.payload;
        if (!customPayload) {
          return NextResponse.json({ error: "Missing payload" }, { status: 400 });
        }
        result = await sendNotification(customPayload);
        break;

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: result.success,
      result,
    });
  } catch (error) {
    console.error("Notification API error:", error);
    return NextResponse.json(
      {
        error: "Failed to send notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve notification logs (for admin)
export async function GET(request: NextRequest) {
  try {
    const { getNotificationLogs, getNotificationStats } = await import(
      "@/lib/notifications"
    );

    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const stats = searchParams.get("stats") === "true";

    if (stats) {
      const notificationStats = getNotificationStats();
      return NextResponse.json(notificationStats);
    }

    const logs = getNotificationLogs(limit ? parseInt(limit, 10) : undefined);
    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching notification logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch notification logs" },
      { status: 500 }
    );
  }
}

