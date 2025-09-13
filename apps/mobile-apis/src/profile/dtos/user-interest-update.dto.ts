import { IsNotEmpty, IsString } from 'class-validator';

export class UserInterestUpdateDto {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  names: string[];
}
