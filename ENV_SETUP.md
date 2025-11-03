# Environment Variables Setup

## Email Notification Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Email Notification Configuration
# Supported services: resend (default)
EMAIL_SERVICE=resend

# Resend API Key (https://resend.com/api-keys)
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email sender address
# Must be a verified domain in Resend, or use the default testing domain
EMAIL_FROM=noreply@yultimate.com

# Alternative: Use NEXT_PUBLIC_ prefix if you need client-side access (not recommended for API keys)
# NEXT_PUBLIC_EMAIL_FROM=noreply@yultimate.com

# Default notification channel
NOTIFICATION_DEFAULT_CHANNEL=email
```

## Getting Started with Resend

1. **Sign up for Resend**
   - Visit [resend.com](https://resend.com)
   - Create an account

2. **Get your API Key**
   - Navigate to the API Keys section in your dashboard
   - Click "Create API Key"
   - Copy the key and paste it as `RESEND_API_KEY` in your `.env.local`

3. **Configure Email Sender**
   - For production: Add and verify your domain in Resend
   - For testing: Use the default Resend domain (e.g., `onboarding@resend.dev`)
   - Set `EMAIL_FROM` to your verified sender address

## Future: SMS Configuration (Optional)

If you plan to add SMS notifications in the future:

```env
# SMS Configuration (Twilio example)
SMS_SERVICE=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

## Future: Push Notifications (Optional)

If you plan to add push notifications:

```env
# Push Notifications (Firebase example)
PUSH_SERVICE=firebase
FIREBASE_SERVER_KEY=your_firebase_server_key
```

## Notes

- Never commit `.env.local` to version control
- Use `.env.example` as a template for team members (without actual secrets)
- Restart your development server after changing environment variables

