import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt-admin') {
  // eslint-disable-next-line
  handleRequest(err: any, user: any, info: any, context: any, status?: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // eslint-disable-next-line
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line
    request.admin = user;

    // eslint-disable-next-line
    return user;
  }
}
