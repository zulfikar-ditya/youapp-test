import { Module } from '@nestjs/common';
import { MobileApisController } from './mobile-apis.controller';
import { MobileApisService } from './mobile-apis.service';

@Module({
  imports: [],
  controllers: [MobileApisController],
  providers: [MobileApisService],
})
export class MobileApisModule {}
