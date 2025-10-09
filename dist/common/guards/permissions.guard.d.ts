import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
export declare class PermissionsGuard implements CanActivate {
    private reflector;
    private readonly i18n;
    constructor(reflector: Reflector, i18n: I18nService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
