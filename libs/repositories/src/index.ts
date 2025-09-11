import { PrismaClient } from '@prisma/client';


export * from './repositories.module';
export * from './repositories.service';

export const prisma = new PrismaClient();