import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule } from '@app/common/throttler/throttler.module';
import { BullmqModule } from '@app/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ThrottlerModule, CacheModule, BullmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
