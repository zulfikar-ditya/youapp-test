import { successResponse } from '@app/common';
import { Controller, Get, Res } from '@nestjs/common';
import { DateUtils } from '@utils/utils';
import { Response } from 'express';

@Controller()
export class AdminController {
  @Get()
  getHello(@Res() res: Response): Response {
    return res.status(200).send(
      successResponse(200, 'Admin Service is running', {
        date: DateUtils.getDateTimeInformativeWithTimezone(DateUtils.now()),
      }),
    );
  }
}
