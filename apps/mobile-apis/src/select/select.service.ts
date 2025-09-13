import { Injectable } from '@nestjs/common';
import { prisma } from '@repositories/repositories';

@Injectable()
export class SelectService {
  async selectHoroscopes(): Promise<{ id: string; name: string }[]> {
    return await prisma.horoscope.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async selectZodiacs(): Promise<{ id: string; name: string }[]> {
    return await prisma.zodiac.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }
}
