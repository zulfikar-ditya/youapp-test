import { Injectable } from '@nestjs/common';
import {
  prisma,
  UserInformation,
  UserRepository,
} from '@repositories/repositories';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CacheService } from '@app/common/cache/cache.service';
import { LoggerUtils, StrUtils } from '@utils/utils';
import * as fs from 'fs';
import { UserInterestUpdateDto } from './dtos/user-interest-update.dto';
import { USER_CACHE_KEY } from '@app/common';

@Injectable()
export class ProfileService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly cacheService: CacheService) {}

  async updateProfile(
    user: UserInformation,
    data: UpdateProfileDto,
  ): Promise<UserInformation> {
    const oldAvatar = StrUtils.fileUrlRemoveMobile(user.avatar ?? null);

    await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          ...data,
        },
      });
      return updatedUser;
    });

    if (oldAvatar && data.avatar && oldAvatar !== data.avatar) {
      fs.unlink(oldAvatar, (err: NodeJS.ErrnoException | null) => {
        if (err) {
          LoggerUtils.error(
            `Failed to delete uploaded avatar file: ${oldAvatar} - ${err.message}`,
          );
        }
      });
    }

    const userInformation = await UserRepository().userInformation(user.id);
    const cacheKey = `${USER_CACHE_KEY}${user.id}`;
    await this.cacheService.set(cacheKey, userInformation, null);

    return userInformation;
  }

  async updateUserInterest(
    user: UserInformation,
    data: UserInterestUpdateDto,
  ): Promise<void> {
    // Normalize interest names:
    // 1. Trim whitespace
    // 2. Drop empty entries
    // 3. Title-case
    // 4. Remove duplicates while preserving order
    const seen = new Set<string>();
    const interestNames: string[] = [];
    for (const raw of data.names ?? []) {
      if (!raw) continue;
      const normalized = StrUtils.title(raw.trim());
      if (!normalized) continue;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      interestNames.push(normalized);
    }

    const interests = await prisma.interest.findMany({
      where: { name: { in: interestNames } },
    });

    if (interests.length !== interestNames.length) {
      const existingNames = interests.map((interest) => interest.name);
      const newNames = interestNames.filter(
        (name) => !existingNames.includes(name),
      );

      const newInterests = newNames.map((name) => ({ name }));
      await prisma.interest.createMany({ data: newInterests });
    }

    const allInterests = await prisma.interest.findMany({
      where: { name: { in: interestNames } },
    });

    await prisma.$transaction(async (tx) => {
      await tx.userInterest.deleteMany({ where: { userId: user.id } });

      const userInterests = allInterests.map((interest) => ({
        userId: user.id,
        interestId: interest.id,
      }));
      if (userInterests.length > 0) {
        await tx.userInterest.createMany({ data: userInterests });
      }
    });

    const userInformation = await UserRepository().userInformation(user.id);
    const cacheKey = `${USER_CACHE_KEY}${user.id}`;
    await this.cacheService.set(cacheKey, userInformation, null);
  }
}
