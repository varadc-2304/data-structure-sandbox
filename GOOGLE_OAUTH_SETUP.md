# Google OAuth Setup Guide

This guide explains how to configure Google OAuth authentication for Drona using Supabase.

## Prerequisites

1. A Supabase project (already configured)
2. A Google Cloud Project with OAuth 2.0 credentials

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - Choose **External** user type
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Drona (or your preferred name)
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local development)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth` (for local development)
     - `https://your-production-domain.com/auth` (for production)
     - **IMPORTANT**: Also add Supabase redirect URL:
       - `https://tafvjwurzgpugcfidbfv.supabase.co/auth/v1/callback`
7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** in the list and click to configure
4. Enable the Google provider
5. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
6. Click **Save**

## Step 3: Configure Redirect URLs in Supabase

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your site URL:
   - For development: `http://localhost:5173`
   - For production: `https://your-production-domain.com`
3. Add redirect URLs:
   - `http://localhost:5173/auth` (development)
   - `https://your-production-domain.com/auth` (production)

## Step 4: Database Setup

Ensure your `auth` table has the following structure (or similar):

```sql
CREATE TABLE IF NOT EXISTS auth (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password TEXT, -- Can be 'GOOGLE_OAUTH' for OAuth users
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Add other fields as needed
);
```

## Step 5: Environment Variables (if needed)

If you're using environment variables for Supabase configuration, ensure these are set:

```env
VITE_SUPABASE_URL=https://tafvjwurzgpugcfidbfv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Testing

1. Start your development server
2. Navigate to the login page
3. Click "Continue with Google"
4. You should be redirected to Google's OAuth consent screen
5. After authorizing, you'll be redirected back to `/auth`
6. The app should automatically log you in and redirect to `/dashboard`

## Troubleshooting

### Issue: "Redirect URI mismatch"
- **Solution**: Ensure the redirect URI in Google Cloud Console matches exactly with Supabase's callback URL and your app's `/auth` route

### Issue: "Invalid client"
- **Solution**: Double-check that the Client ID and Client Secret in Supabase match your Google Cloud Console credentials

### Issue: User not created in auth table
- **Solution**: Check the browser console and Supabase logs. The Auth.tsx component should automatically create users, but ensure the `auth` table allows inserts and has the correct structure

### Issue: Session not persisting
- **Solution**: Ensure Supabase session storage is configured correctly. The AuthContext should handle session persistence automatically.

## Security Notes

1. Never commit your Google OAuth Client Secret to version control
2. Use environment variables for sensitive configuration
3. Regularly rotate OAuth credentials
4. Monitor OAuth usage in Google Cloud Console
5. Set up proper CORS policies in Supabase

## Production Checklist

- [ ] Google OAuth credentials configured in Supabase
- [ ] Production redirect URLs added to Google Cloud Console
- [ ] Production site URL configured in Supabase
- [ ] Database `auth` table structure verified
- [ ] Error handling tested
- [ ] Session persistence verified
- [ ] Logout functionality tested

