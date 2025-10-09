import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repositories/user.repository';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userRepository;
    constructor(configService: ConfigService, userRepository: UserRepository);
    validate(payload: any): Promise<{
        id: string;
        userId: string;
        sub: string;
        email: string;
        fullName: string;
        gender: string;
        chartNumber: string;
        role: string;
        permissions: string[];
        isBanned: boolean;
        isDeleted: boolean;
    }>;
}
export {};
