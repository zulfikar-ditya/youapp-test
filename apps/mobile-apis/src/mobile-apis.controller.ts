import { Controller, Get } from '@nestjs/common';
import { MobileApisService } from './mobile-apis.service';

@Controller()
export class MobileApisController {
  constructor(private readonly mobileApisService: MobileApisService) {}

  @Get()
  getHello(): string {
    return this.mobileApisService.getHello();
  }
}
