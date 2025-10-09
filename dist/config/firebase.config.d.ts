import { ConfigService } from '@nestjs/config';
export declare const getFirebaseConfig: (configService?: ConfigService) => {
    credential: import("firebase-admin/app").Credential;
    projectId: string;
};
