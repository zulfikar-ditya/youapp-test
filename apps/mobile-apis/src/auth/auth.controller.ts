import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { errorResponse, successResponse } from '@app/common';
import { RegisterDto } from './dtos/register.dto';

@Controller({
  path: 'auth',
  version: '1',
})
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

  @Post('register')
  async register(@Res() res: Response, @Body() body: RegisterDto) {
    try {
      const data = await this.authService.register(body);
      return res
        .status(201)
        .json(successResponse(201, 'Registration successful', data));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('check-username-email')
  async checkUsernameOrEmail(
    @Res() res: Response,
    @Body() body: { username_or_email: string },
  ) {
    try {
      const exists = await this.authService.validateUsernameOrEmail(
        body.username_or_email,
      );
      return res
        .status(200)
        .json(successResponse(200, 'Check successful', { exists }));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
