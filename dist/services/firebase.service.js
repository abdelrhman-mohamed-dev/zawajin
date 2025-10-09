"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
let FirebaseService = class FirebaseService {
    async sendNotification(token, title, body, data) {
        try {
            const message = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                token,
            };
            const response = await admin.messaging().send(message);
            return {
                success: true,
                messageId: response,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async sendMulticastNotification(tokens, title, body, data) {
        try {
            const message = {
                notification: {
                    title,
                    body,
                },
                data: data || {},
                tokens,
            };
            const response = await admin.messaging().sendEachForMulticast(message);
            return {
                success: true,
                successCount: response.successCount,
                failureCount: response.failureCount,
                responses: response.responses,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)()
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map