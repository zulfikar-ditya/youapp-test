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

@Injectable()
export class ProfileService {
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
    const cacheKey = `user:${user.id}`;
    await this.cacheService.set(cacheKey, userInformation, null);

    return userInformation;
  }
}
