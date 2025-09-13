import { PrismaClient } from '@prisma/client';

export * from './repositories.module';
export * from './repositories.service';
export * from './repositories/user.repository';
export * from './repositories/admin.repository';

export const prisma = new PrismaClient();
