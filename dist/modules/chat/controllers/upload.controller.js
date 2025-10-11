"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const multer_1 = require("multer");
const path_1 = require("path");
const uuid_1 = require("uuid");
let UploadController = class UploadController {
    async uploadAudio(file) {
        if (!file) {
            throw new common_1.BadRequestException({
                message: 'No file provided',
                messageAr: 'لم يتم تقديم أي ملف',
            });
        }
        const fileUrl = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/audio/${file.filename}`;
        return {
            fileUrl,
            fileName: file.filename,
            message: 'Audio file uploaded successfully',
            messageAr: 'تم تحميل الملف الصوتي بنجاح',
        };
    }
    async uploadImage(file) {
        if (!file) {
            throw new common_1.BadRequestException({
                message: 'No file provided',
                messageAr: 'لم يتم تقديم أي ملف',
            });
        }
        const fileUrl = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/images/${file.filename}`;
        return {
            fileUrl,
            fileName: file.filename,
            message: 'Image file uploaded successfully',
            messageAr: 'تم تحميل ملف الصورة بنجاح',
        };
    }
};
exports.UploadController = UploadController;
__decorate([
    (0, common_1.Post)('audio'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload audio file for voice messages' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Audio file uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                fileUrl: { type: 'string' },
                fileName: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file type or size' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/audio',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/ogg',
                'audio/webm',
                'audio/aac',
                'audio/m4a',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException({
                    message: 'Invalid audio file type',
                    messageAr: 'نوع ملف الصوت غير صالح',
                }), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadAudio", null);
__decorate([
    (0, common_1.Post)('image'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload image file for image messages' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Image file uploaded successfully',
        schema: {
            type: 'object',
            properties: {
                fileUrl: { type: 'string' },
                fileName: { type: 'string' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid file type or size' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/images',
            filename: (req, file, callback) => {
                const uniqueName = `${(0, uuid_1.v4)()}${(0, path_1.extname)(file.originalname)}`;
                callback(null, uniqueName);
            },
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/webp',
            ];
            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException({
                    message: 'Invalid image file type',
                    messageAr: 'نوع ملف الصورة غير صالح',
                }), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadImage", null);
exports.UploadController = UploadController = __decorate([
    (0, swagger_1.ApiTags)('Chat'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('chat/upload')
], UploadController);
//# sourceMappingURL=upload.controller.js.map