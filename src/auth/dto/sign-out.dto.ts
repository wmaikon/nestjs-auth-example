import { IsString } from 'class-validator';

export class SignOutDto {
  @IsString() readonly refresh_token: string;
}
