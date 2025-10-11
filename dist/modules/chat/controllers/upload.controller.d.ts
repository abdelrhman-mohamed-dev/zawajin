export declare class UploadController {
    uploadAudio(file: Express.Multer.File): Promise<{
        fileUrl: string;
        fileName: string;
        message: string;
        messageAr: string;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        fileUrl: string;
        fileName: string;
        message: string;
        messageAr: string;
    }>;
}
