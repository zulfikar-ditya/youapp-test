import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminInformation } from '@repositories/repositories';
import { Request } from 'express';

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AdminInformation => {
    const request: Request = ctx.switchToHttp().getRequest();

    if (!request.admin) {
      throw new UnauthorizedException('Unauthenticated');
    }

    return request.admin;
  },
);
