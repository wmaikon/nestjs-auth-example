import { IsString, IsEmail } from 'class-validator';

export class GetUserTokenDto {
  @IsEmail() readonly email: string;
  @IsString() readonly password: string;
}
