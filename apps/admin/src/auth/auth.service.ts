import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dtp/login.dto';
import { AdminInformation, AdminRepository } from '@repositories/repositories';
import { HashUtils, JWTUtils } from '@utils/utils';

@Injectable()
export class AuthService {
  async login(data: LoginDto): Promise<{
    access_token: string;
    admin: AdminInformation;
  }> {
    const user = await AdminRepository().findByUsername(data.username);
    if (!user) {
      throw new UnprocessableEntityException({
        message: 'Invalid username or password',
        errors: {
          username: ['Invalid username or password'],
        },
      });
    }

    const isPasswordValid = await HashUtils.compareHash(
      data.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        message: 'Invalid username or password',
        errors: {
          username: ['Invalid username or password'],
        },
      });
    }

    // create token
    const adminInformation = await AdminRepository().adminInformation(user.id);
    const token = JWTUtils.generateAccessToken({
      id: adminInformation.id,
    });

    return {
      access_token: token,
      admin: adminInformation,
    };
  }
}
