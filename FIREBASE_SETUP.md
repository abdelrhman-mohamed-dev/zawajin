# Firebase Configuration Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select an existing project
3. Enable Cloud Messaging (FCM) for push notifications

## Step 2: Generate Service Account Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to **Service accounts** tab
3. Click **Generate new private key**
4. Download the JSON file (keep it secure!)

## Step 3: Configure Environment Variables

Replace the placeholder values in your `.env` file:

```bash
# Replace 'whatsapp-d1681' with your actual Firebase project ID
FIREBASE_PROJECT_ID=your-actual-project-id

# Replace the entire JSON with your actual service account key (as a single line)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id","private_key_id":"actual-key-id","private_key":"-----BEGIN PRIVATE KEY-----\nYOUR_ACTUAL_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com","client_id":"actual-client-id","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com"}
```

## Step 4: Security Best Practices

### For Development:
- Keep your `.env` file in `.gitignore` (it should already be there)
- Never commit actual Firebase credentials to version control

### For Production:
- Use environment variables or secure secret management
- Consider using Firebase Admin SDK with Application Default Credentials
- Rotate service account keys regularly

## Step 5: Test Firebase Configuration

After updating your `.env` file with real values:

```bash
# Restart your Docker containers
docker compose -f docker-compose.dev.yml restart

# Check logs to verify Firebase initialization
docker compose -f docker-compose.dev.yml logs app
```

You should see: `✅ Firebase configuration loaded successfully for project: your-project-id`

## Step 6: Test Push Notifications

Use the `/notifications/send` endpoint to test:

```bash
curl -X POST http://localhost:3000/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "token": "device-fcm-token",
    "title": "Test Notification",
    "body": "Hello from your app!"
  }'
```

## Troubleshooting

- **"Firebase service account key is incomplete"**: Check that all required fields are present in your service account JSON
- **"Firebase project ID mismatch"**: Ensure FIREBASE_PROJECT_ID matches the project_id in your service account key
- **"Invalid Firebase service account key format"**: Verify the JSON is valid and properly escaped in the .env file

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID | `my-awesome-app-12345` |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Complete service account JSON (as single line) | `{"type":"service_account",...}` |

---

**Note**: The current configuration uses placeholder values. Replace them with your actual Firebase project details to enable push notifications.