import { ArrayUnique, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRoleEnum } from '@token/enums/user-role.enum';

export class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsEnum(UserRoleEnum, { each: true })
  @ArrayUnique()
  readonly roles: UserRoleEnum[];
}
