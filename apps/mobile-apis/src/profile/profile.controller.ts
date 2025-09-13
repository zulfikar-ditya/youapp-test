import {
  Body,
  Controller,
  Get,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, errorResponse, successResponse } from '@app/common';
import { UserInformation } from '@repositories/repositories';
import { Response } from 'express';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { createMulterConfig } from '@app/common/interceptos/file-upload.interceptor';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoggerUtils } from '@utils/utils';
import * as fs from 'fs';

@Controller({
  path: 'profile',
  version: '1',
})
@UseGuards(AuthGuard('jwt'))
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Res() res: Response, @CurrentUser() user: UserInformation) {
    return res.status(200).json(successResponse(200, 'Profile fetched', user));
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor(
      'avatar',
      createMulterConfig({
        destination: './uploads/avatar',
        filename: (req, file) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          return `${file.fieldname}-${uniqueSuffix}${ext}`;
        },
        preserveOriginalName: false,
      }),
    ),
  )
  async updateProfile(
    @Res() res: Response,
    @UploadedFile() avatar: Express.Multer.File,
    @CurrentUser() user: UserInformation,
    @Body() body: UpdateProfileDto,
  ) {
    try {
      const updatedUser = await this.profileService.updateProfile(user, {
        ...body,
        avatar: avatar ? avatar.path : undefined,
      });
      return res
        .status(200)
        .json(successResponse(200, 'Profile updated', updatedUser));
    } catch (error) {
      if (avatar && avatar.path !== undefined) {
        fs.unlink(avatar.path, (err: NodeJS.ErrnoException | null) => {
          if (err) {
            LoggerUtils.error(
              `Failed to delete uploaded avatar file: ${avatar.path} - ${err.message}`,
            );
          }
        });
      }

      errorResponse(res, error);
    }
  }
}
