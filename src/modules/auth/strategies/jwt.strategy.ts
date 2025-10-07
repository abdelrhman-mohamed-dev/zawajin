import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user || !user.isActive || !user.isEmailVerified) {
      throw new UnauthorizedException('Invalid token or user not active');
    }

    return {
      id: user.id,
      userId: user.id,
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      chartNumber: user.chartNumber,
      role: user.role,
      permissions: user.permissions,
      isBanned: user.isBanned,
      isDeleted: user.isDeleted,
    };
  }
}
