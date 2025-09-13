import { Prisma, UserStatus } from '@prisma/client';
import { prisma } from '..';
import { UnauthorizedException } from '@nestjs/common';
import { StrUtils } from '@utils/utils';

export type UserInformation = {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  name?: string | null;
  gender?: string | null;
  birthday?: Date | null;
  horoskope?: string | null;
  zodiac?: string | null;
  height?: number | null;
  weight?: number | null;
  remark?: string | null;
  timestamp: Date;
  status: UserStatus;
};

export function UserRepository(tx?: Prisma.TransactionClient) {
  const db = tx ?? prisma;

  return {
    user: db.user,

    // please be careful when changing the returned fields
    async userInformation(userId: string): Promise<UserInformation> {
      const data = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
          name: true,
          gender: true,
          birthday: true,
          horoskope: true,
          zodiac: true,
          height: true,
          weight: true,
          remark: true,
          timestamp: true,
          status: true,
        },
      });

      if (!data) {
        throw new UnauthorizedException('Unauthenticated');
      }

      if (data.status !== UserStatus.Active) {
        throw new UnauthorizedException(`Your account is ${data.status}`);
      }

      return {
        ...data,
        avatar: StrUtils.fileUrlMobile(data.avatar),
      };
    },

    async findUsernameOrEmail(user: string): Promise<{
      id: string;
      username: string;
      email: string;
      password: string;
      status: UserStatus;
    } | null> {
      const where: Prisma.UserWhereInput = {};
      const emailRegex =
        // eslint-disable-next-line no-control-regex
        /(?:[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+(?:\.[a-z0-9!#$%&'*+\x2f=?^_`\x7b-\x7d~\x2d]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\x2d]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9\x2d]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (emailRegex.test(user)) {
        where.email = { equals: user };
      } else {
        where.username = { equals: user };
      }

      const data = await db.user.findFirst({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          status: true,
        },
      });

      return data;
    },
  };
}
