import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AuthModule } from './auth/auth.module';
import { CacheModule, CommonModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [
    AuthModule,

    CommonModule,
    CacheModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),

    ProfileModule,
  ],
  controllers: [AdminController],
  providers: [],
})
export class AdminModule {}
