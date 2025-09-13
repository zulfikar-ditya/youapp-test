import { Module } from '@nestjs/common';
import { MobileApisController } from './mobile-apis.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MobileApisController],
  providers: [],
})
export class MobileApisModule {}
