import { Module } from '@nestjs/common';
import { MobileApisController } from './mobile-apis.controller';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { CacheModule, CommonModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/common/strategies/jwt.strategy';
import { SelectModule } from './select/select.module';

@Module({
  imports: [
    AuthModule,
    ProfileModule,

    CommonModule,
    CacheModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),

    SelectModule,
  ],
  controllers: [MobileApisController],
  providers: [JwtStrategy],
})
export class MobileApisModule {}
