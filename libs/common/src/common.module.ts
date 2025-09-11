import { Module } from '@nestjs/common';
import { ThrottlerModule } from './throttler/throttler.module';

@Module({
  providers: [],
  exports: [],
  imports: [ThrottlerModule],
})
export class CommonModule {}
