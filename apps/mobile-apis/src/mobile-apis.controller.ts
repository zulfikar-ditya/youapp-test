import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { successResponse } from '@app/common';
import { DateUtils } from '@utils/utils';

@Controller()
export class MobileApisController {
  @Get()
  getHello(@Res() res: Response) {
    return res.status(200).json(
      successResponse(200, 'Api is running', {
        date: DateUtils.getDateTimeInformativeWithTimezone(DateUtils.now()),
      }),
    );
  }
}
