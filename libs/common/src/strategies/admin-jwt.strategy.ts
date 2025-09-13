import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AdminInformation, AdminRepository } from '@repositories/repositories';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from '../cache/cache.service';
import { JWTPayload } from '@utils/utils';
import { ADMIN_CACHE_KEY } from '../cache/const';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  // eslint-disable-next-line
  constructor(private readonly cacheService: CacheService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default-secret',
    });
  }

  async validate(payload: JWTPayload): Promise<AdminInformation> {
    try {
      const cacheKey = `${ADMIN_CACHE_KEY}${payload.id}`;

      // GET FROM CACHE FIRST, THEN DATABASE
      let admin: AdminInformation | null =
        await this.cacheService.get(cacheKey);

      if (!admin) {
        admin = await AdminRepository().adminInformation(payload.id);
        if (!admin) {
          throw new UnauthorizedException('admin not found');
        }
        await this.cacheService.set(cacheKey, admin, null);
      }

      return admin;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
