import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { AdminInformation } from '@repositories/repositories';
import { CurrentAdmin } from '@app/common/decorators/current-admin.decorator';
import { Response } from 'express';
import { successResponse } from '@app/common';
import { AdminJwtAuthGuard } from '@app/common/guards/admin-jwt-auth.guard';

@Controller('profile')
@UseGuards(AdminJwtAuthGuard)
export class ProfileController {
  @Get()
  getProfile(@CurrentAdmin() admin: AdminInformation, @Res() res: Response) {
    return res
      .status(200)
      .json(successResponse(200, 'Profile fetched successfully', admin));
  }
}
