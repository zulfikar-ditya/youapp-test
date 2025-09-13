import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dtp/login.dto';
import { errorResponse, successResponse } from '@app/common';

@Controller('auth')
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Res() res: Response, @Body() body: LoginDto) {
    try {
      const data = await this.authService.login(body);
      return res
        .status(200)
        .json(successResponse(200, 'Login successful', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
