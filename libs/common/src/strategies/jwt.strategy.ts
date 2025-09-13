import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserInformation, UserRepository } from '@repositories/repositories';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from '../cache/cache.service';
import { JWTPayload } from '@utils/utils';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // eslint-disable-next-line
  constructor(private readonly cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: JWTPayload): Promise<UserInformation> {
    try {
      const cacheKey = `user-${payload.id}`;

      // GET FROM CACHE FIRST, THEN DATABASE
      let user: UserInformation | null = await this.cacheService.get(cacheKey);
      if (!user) {
        user = await UserRepository().userInformation(payload.id);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
        await this.cacheService.set(cacheKey, user, 3600);
      }

      return user;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
