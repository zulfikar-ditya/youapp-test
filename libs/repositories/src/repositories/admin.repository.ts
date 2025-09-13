import { Prisma } from '@prisma/client';
import { prisma } from '..';
import { UnauthorizedException } from '@nestjs/common';

export type AdminInformation = {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export function AdminRepository(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    admin: db.admin,

    async adminInformation(adminId: string): Promise<AdminInformation> {
      const data = await db.admin.findUnique({
        where: { id: adminId },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!data) {
        throw new UnauthorizedException('unauthorized');
      }

      return data;
    },

    async findByUsername(username: string): Promise<{
      id: string;
      username: string;
      email: string;
      password: string;
      createdAt: Date;
      updatedAt: Date;
    } | null> {
      return await db.admin.findUnique({ where: { username } });
    },
  };
}
