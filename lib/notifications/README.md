# Notification System Documentation

A modular, event-driven notification system for the Y-Ultimate Management Platform that supports multiple channels and is designed for easy expansion.

## Overview

The notification system is built with extensibility in mind. It currently supports email notifications via Resend, but can easily be extended to support SMS, push notifications, and in-app notifications.

## Architecture

```
lib/notifications/
├── index.ts              # Central notification manager
├── types.ts              # TypeScript types and interfaces
├── channels/
│   └── email.ts          # Email channel implementation
└── README.md             # This file

app/api/notifications/
└── route.ts              # Next.js API route for client requests
```

## Quick Start

### 1. Environment Setup

Create a `.env.local` file in your project root:

```env
# Email Notification Configuration
EMAIL_SERVICE=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yultimate.com
NOTIFICATION_DEFAULT_CHANNEL=email
```

**Getting a Resend API Key:**
1. Sign up at [resend.com](https://resend.com)
2. Navigate to API Keys section
3. Create a new API key
4. Copy the key to your `.env.local` file

**Important:** For production, use a verified domain in Resend. For testing, you can use the default Resend domain.

### 2. Usage

#### Basic Usage (Client-Side)

```typescript
// Send a notification via API
const response = await fetch("/api/notifications", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "participant-approved",
    email: "user@example.com",
    name: "John Doe",
    team: "Blue Strikers",
    role: "Player",
  }),
});

const result = await response.json();
```

#### Server-Side Usage

```typescript
import { notifyParticipantApproved } from "@/lib/notifications";

const result = await notifyParticipantApproved("user@example.com", {
  name: "John Doe",
  team: "Blue Strikers",
  role: "Player",
});

if (result.success) {
  console.log("Notification sent:", result.notificationId);
} else {
  console.error("Failed:", result.error);
}
```

## Supported Notification Types

### Participant Notifications

- **PARTICIPANT_APPROVED** - Sent when a participant is approved
- **PARTICIPANT_REMOVED** - Sent when a participant is removed
- **PARTICIPANT_ADDED** - Sent when a new participant is added
- **TEAM_ADDED** - Sent to all members when a team is added

### API Actions

The `/api/notifications` endpoint accepts the following actions:

1. **participant-approved**
   ```json
   {
     "action": "participant-approved",
     "email": "user@example.com",
     "name": "John Doe",
     "team": "Blue Strikers",
     "role": "Player"
   }
   ```

2. **participant-removed**
   ```json
   {
     "action": "participant-removed",
     "email": "user@example.com",
     "name": "John Doe",
     "team": "Blue Strikers",
     "role": "Player",
     "message": "Optional removal reason"
   }
   ```

3. **participant-added**
   ```json
   {
     "action": "participant-added",
     "email": "user@example.com",
     "name": "John Doe",
     "team": "Blue Strikers",
     "role": "Player"
   }
   ```

4. **team-added**
   ```json
   {
     "action": "team-added",
     "emails": ["user1@example.com", "user2@example.com"],
     "teamName": "Blue Strikers",
     "memberCount": 2
   }
   ```

5. **custom** - Send a custom notification with full control
   ```json
   {
     "action": "custom",
     "payload": {
       "type": "PARTICIPANT_APPROVED",
       "channel": "email",
       "recipient": "user@example.com",
       "payload": {
         "name": "John Doe",
         "team": "Blue Strikers"
       }
     }
   }
   ```

## Email Templates

Email templates are HTML-based and include:
- Responsive design
- Brand colors (gradient header)
- Plain text fallback
- Professional formatting

Templates are defined in `lib/notifications/channels/email.ts` and can be customized there.

## Notification Logging

All notifications are logged in memory (for development) with the following information:
- Notification ID
- Type
- Recipient
- Channel
- Status (pending, sent, failed, delivered)
- Timestamp
- Error messages (if any)

### Accessing Logs

```typescript
import { getNotificationLogs, getNotificationStats } from "@/lib/notifications";

// Get recent logs (optional limit)
const logs = getNotificationLogs(50);

// Get statistics
const stats = getNotificationStats();
console.log(stats);
// {
//   total: 100,
//   byStatus: { sent: 95, failed: 5 },
//   byChannel: { email: 100 },
//   byType: { PARTICIPANT_APPROVED: 50, ... }
// }
```

### API Access

```bash
# Get notification logs
GET /api/notifications?limit=50

# Get statistics
GET /api/notifications?stats=true
```

## Extending the System

### Adding a New Notification Type

1. Add the type to `types.ts`:
   ```typescript
   export type NotificationType =
     | "PARTICIPANT_APPROVED"
     | "YOUR_NEW_TYPE";
   ```

2. Add handler in `channels/email.ts`:
   ```typescript
   case "YOUR_NEW_TYPE":
     return {
       subject: "Your Subject",
       html: getYourTemplate(data),
       text: getYourTextTemplate(data),
     };
   ```

3. Create template functions:
   ```typescript
   function getYourTemplate(data: NotificationPayload["payload"]): string {
     return `<!DOCTYPE html>...`;
   }
   ```

### Adding a New Channel (e.g., SMS)

1. Create `channels/sms.ts`:
   ```typescript
   import { NotificationPayload, NotificationResult } from "../types";

   export async function sendSmsNotification(
     payload: NotificationPayload
   ): Promise<NotificationResult> {
     // Implement SMS sending logic
     // Use Twilio, AWS SNS, or another service
   }
   ```

2. Register in `index.ts`:
   ```typescript
   import { sendSmsNotification } from "./channels/sms";

   switch (channel) {
     case "sms":
       result = await sendSmsNotification(payload);
       break;
   }
   ```

3. Update environment variables and add configuration.

### Database Integration

For production, replace the in-memory log with a database:

```typescript
// lib/notifications/storage.ts
import { NotificationLog } from "./types";

export async function saveNotificationLog(log: NotificationLog) {
  // Save to database
  // Example: await db.notifications.create(log);
}

export async function getNotificationLogs(limit?: number): Promise<NotificationLog[]> {
  // Fetch from database
  // Example: return await db.notifications.findMany({ take: limit, orderBy: { timestamp: 'desc' } });
}
```

Then update `index.ts` to use these functions instead of the in-memory array.

## Error Handling

Notifications are designed to fail gracefully:
- Errors are logged but don't break the main application flow
- Toast notifications inform users of notification status
- Failed notifications can be retried (implement retry logic in production)

## Testing

### Testing Email Notifications

1. Use Resend's test mode or a test API key
2. Monitor the Resend dashboard for sent emails
3. Check notification logs via API: `GET /api/notifications`

### Mocking for Tests

```typescript
// In your test setup
jest.mock("@/lib/notifications", () => ({
  notifyParticipantApproved: jest.fn().mockResolvedValue({
    success: true,
    status: "sent",
    channel: "email",
    timestamp: new Date(),
  }),
}));
```

## Future Enhancements

Planned extensions:
- ✅ Email notifications (Resend)
- 🔄 SMS notifications (Twilio)
- 🔄 Push notifications (Firebase/Web Push)
- 🔄 In-app notifications with badge
- 🔄 Database persistence for logs
- 🔄 Retry mechanism for failed notifications
- 🔄 Notification preferences per user
- 🔄 Scheduled notifications (event reminders)

## Troubleshooting

### Emails not sending

1. Check `RESEND_API_KEY` is set correctly
2. Verify `EMAIL_FROM` is a valid/verified domain in Resend
3. Check browser console and server logs for errors
4. Ensure API route is accessible: `/api/notifications`

### Notifications failing silently

- Check notification logs: `GET /api/notifications?stats=true`
- Look for error messages in the response
- Verify network requests are completing

### Template issues

- Templates are HTML strings in `channels/email.ts`
- Test templates in an HTML preview tool
- Ensure all variables are properly interpolated

## Support

For issues or questions:
1. Check the logs via API endpoint
2. Review environment configuration
3. Verify Resend account status and API key validity

