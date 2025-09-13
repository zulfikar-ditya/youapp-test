import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { UserInformation, UserRepository } from '@repositories/repositories';
import { HashUtils, JWTUtils } from '@utils/utils';
import { UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  async login(data: LoginDto): Promise<{
    access_token: string;
    user: UserInformation;
  }> {
    // Find and validate the user password email etc
    const { username_or_email, password } = data;
    const user = await UserRepository().findUsernameOrEmail(username_or_email);
    if (!user) {
      throw new UnprocessableEntityException({
        message: 'Invalid username/email or password',
        errors: {
          email: ['Invalid username/email or password'],
        },
      });
    }

    if (user.status !== 'Active') {
      throw new UnprocessableEntityException({
        message: `Your account is ${user.status}`,
        errors: {
          email: [`Your account is ${user.status}`],
        },
      });
    }

    const isPasswordValid = await HashUtils.compareHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnprocessableEntityException({
        message: 'Invalid username/email or password',
        errors: {
          email: ['Invalid username/email or password'],
        },
      });
    }

    // Generate and return JWT token
    const token = JWTUtils.generateAccessToken({
      id: user.id,
    });

    const userInformation = await UserRepository().userInformation(user.id);

    return {
      access_token: token,
      user: userInformation,
    };
  }

  async register(data: RegisterDto): Promise<{
    access_token: string;
    user: UserInformation;
  }> {
    const { username, email, password } = data;

    // Check if username or email already exists
    const existingUser = await UserRepository().findUsernameOrEmail(username);
    if (existingUser) {
      throw new UnprocessableEntityException({
        message: 'Username or email already exists',
        errors: {
          email: ['Username or email already exists'],
        },
      });
    }

    const existingEmail = await UserRepository().findUsernameOrEmail(email);
    if (existingEmail) {
      throw new UnprocessableEntityException({
        message: 'Username or email already exists',
        errors: {
          email: ['Username or email already exists'],
        },
      });
    }

    // Hash the password
    const hashedPassword = await HashUtils.generateHash(password);

    // Create the user
    const newUser = await UserRepository().user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        status: UserStatus.Active,
      },
    });

    // Generate and return JWT token
    const token = JWTUtils.generateAccessToken({
      id: newUser.id,
    });

    const userInformation = await UserRepository().userInformation(newUser.id);

    return {
      access_token: token,
      user: userInformation,
    };
  }

  async validateUsernameOrEmail(username_or_email: string): Promise<boolean> {
    const user = await UserRepository().findUsernameOrEmail(username_or_email);
    return !!user;
  }
}
