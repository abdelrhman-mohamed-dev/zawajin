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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
const nestjs_i18n_1 = require("nestjs-i18n");
let PermissionsGuard = class PermissionsGuard {
    constructor(reflector, i18n) {
        this.reflector = reflector;
        this.i18n = i18n;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredPermissions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException(await this.i18n.translate('admin.errors.unauthorized', {
                lang: request.headers['accept-language'] || 'en',
            }));
        }
        if (user.role === 'super_admin') {
            return true;
        }
        if (!user.permissions || !Array.isArray(user.permissions)) {
            throw new common_1.ForbiddenException(await this.i18n.translate('admin.errors.insufficientPermissions', {
                lang: request.headers['accept-language'] || 'en',
            }));
        }
        const hasPermission = requiredPermissions.some((permission) => user.permissions.includes(permission));
        if (!hasPermission) {
            throw new common_1.ForbiddenException(await this.i18n.translate('admin.errors.insufficientPermissions', {
                lang: request.headers['accept-language'] || 'en',
            }));
        }
        return true;
    }
};
exports.PermissionsGuard = PermissionsGuard;
exports.PermissionsGuard = PermissionsGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        nestjs_i18n_1.I18nService])
], PermissionsGuard);
//# sourceMappingURL=permissions.guard.js.map