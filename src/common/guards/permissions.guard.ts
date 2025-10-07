import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.unauthorized', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    // Super admins have all permissions by default
    if (user.role === 'super_admin') {
      return true;
    }

    // Check if user has the required permissions
    if (!user.permissions || !Array.isArray(user.permissions)) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.insufficientPermissions', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    const hasPermission = requiredPermissions.some((permission) =>
      user.permissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.insufficientPermissions', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    return true;
  }
}
