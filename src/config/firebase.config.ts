import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

interface FirebaseServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}

export const getFirebaseConfig = (configService?: ConfigService) => {
  const serviceAccountPath = path.join(process.cwd(), 'whatsapp-d1681-firebase-adminsdk-9u2zd-29bab82657.json');
  
  // Check if firebase service account file exists
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('Firebase service account file not found. Running without Firebase.');
    return null;
  }

  try {
    // Read and parse the Firebase service account file
    const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
    const parsedKey: FirebaseServiceAccount = JSON.parse(serviceAccountData);
    
    console.log(`🔧 Attempting to initialize Firebase for project: ${parsedKey.project_id}`);
    
    // Validate required fields
    const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !parsedKey[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Firebase service account key is missing required fields: ${missingFields.join(', ')}. Skipping Firebase initialization.`);
      return null;
    }

    console.log(`✅ Firebase configuration loaded successfully for project: ${parsedKey.project_id}`);
    
    return {
      credential: admin.credential.cert(parsedKey as admin.ServiceAccount),
      projectId: parsedKey.project_id,
    };
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error.message);
    console.error('Check your Firebase service account JSON file format and credentials.');
    return null;
  }
};