"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirebaseConfig = void 0;
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const getFirebaseConfig = (configService) => {
    const serviceAccountPath = path.join(process.cwd(), 'whatsapp-d1681-firebase-adminsdk-9u2zd-29bab82657.json');
    if (!fs.existsSync(serviceAccountPath)) {
        console.log('Firebase service account file not found. Running without Firebase.');
        return null;
    }
    try {
        const serviceAccountData = fs.readFileSync(serviceAccountPath, 'utf8');
        const parsedKey = JSON.parse(serviceAccountData);
        console.log(`🔧 Attempting to initialize Firebase for project: ${parsedKey.project_id}`);
        const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
        const missingFields = requiredFields.filter(field => !parsedKey[field]);
        if (missingFields.length > 0) {
            console.warn(`Firebase service account key is missing required fields: ${missingFields.join(', ')}. Skipping Firebase initialization.`);
            return null;
        }
        console.log(`✅ Firebase configuration loaded successfully for project: ${parsedKey.project_id}`);
        return {
            credential: admin.credential.cert(parsedKey),
            projectId: parsedKey.project_id,
        };
    }
    catch (error) {
        console.error('❌ Failed to initialize Firebase:', error.message);
        console.error('Check your Firebase service account JSON file format and credentials.');
        return null;
    }
};
exports.getFirebaseConfig = getFirebaseConfig;
//# sourceMappingURL=firebase.config.js.map