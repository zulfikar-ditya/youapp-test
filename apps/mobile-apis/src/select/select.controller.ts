import { Controller, Get, Res } from '@nestjs/common';
import { SelectService } from './select.service';
import { errorResponse, successResponse } from '@app/common';
import { Response } from 'express';

@Controller({
  path: 'select',
  version: '1',
})
export class SelectController {
  constructor(private readonly selectService: SelectService) {}

  @Get('horoscopes')
  async selectHoroscopes(@Res() res: Response): Promise<Response> {
    try {
      const data = await this.selectService.selectHoroscopes();
      return res
        .status(200)
        .json(successResponse(200, 'Success get horoscope', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Get('zodiacs')
  async selectZodiacs(@Res() res: Response): Promise<Response> {
    try {
      const data = await this.selectService.selectZodiacs();
      return res
        .status(200)
        .json(successResponse(200, 'Success get zodiac', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
