import { Module } from '@nestjs/common';
import { ThrottlerModule } from './throttler/throttler.module';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { AdminJwtAuthGuard } from './guards/admin-jwt-auth.guard';

@Module({
  providers: [AdminJwtStrategy, AdminJwtAuthGuard],
  exports: [AdminJwtStrategy, AdminJwtAuthGuard],
  imports: [ThrottlerModule],
})
export class CommonModule {}
