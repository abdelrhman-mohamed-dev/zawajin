import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
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

    // Check if user is banned or deleted
    if (user.isBanned) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.userBanned', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    if (user.isDeleted) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.userDeleted', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(
        await this.i18n.translate('admin.errors.insufficientPermissions', {
          lang: request.headers['accept-language'] || 'en',
        }),
      );
    }

    return true;
  }
}
