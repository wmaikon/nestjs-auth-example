import { IsEmail, IsString } from 'class-validator';

export class CreateAccessTokenDto {
  @IsEmail() readonly email: string;
  @IsString() readonly refresh_token: string;
}
