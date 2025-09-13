import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username_or_email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
