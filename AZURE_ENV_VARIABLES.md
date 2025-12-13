# Environment Variables for Azure Deployment

This document lists all environment variables that need to be added to GitHub Secrets for Azure deployment.

## Firebase Configuration

These variables are required for Firebase Authentication (Google OAuth):

- `VITE_FIREBASE_API_KEY` - Your Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN` - Your Firebase Auth Domain (e.g., `your-project.firebaseapp.com`)
- `VITE_FIREBASE_PROJECT_ID` - Your Firebase Project ID
- `VITE_FIREBASE_STORAGE_BUCKET` - Your Firebase Storage Bucket (e.g., `your-project.appspot.com`)
- `VITE_FIREBASE_MESSAGING_SENDER_ID` - Your Firebase Messaging Sender ID
- `VITE_FIREBASE_APP_ID` - Your Firebase App ID

## How to Get Firebase Configuration Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app (or create one if you haven't)
6. Copy the configuration values from the `firebaseConfig` object

## Supabase Configuration (Optional)

If you're using Supabase for any data operations (currently not used for authentication, but may be used for other features):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Note:** Currently, Supabase is not required for authentication as Firebase is used. However, if you plan to use Supabase for other features, add these variables.

## Adding to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each environment variable listed above
5. Use the exact variable names as shown (case-sensitive)

## Azure Static Web Apps Configuration

When deploying to Azure Static Web Apps, these environment variables will be automatically available during the build process. Make sure your GitHub Actions workflow references these secrets.

## Example GitHub Actions Workflow

Your workflow should reference these secrets like this:

```yaml
env:
  VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
  VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
  VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
  VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
  VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
```

## Security Notes

- Never commit these values to your repository
- Always use GitHub Secrets for sensitive configuration
- Rotate these keys periodically for security
- Ensure your Firebase project has proper security rules configured

