import { ArrayUnique, IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';
import { UserRoleEnum } from '@token/enums/user-role.enum';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly password: string;

  @IsOptional()
  @IsEnum(UserRoleEnum, { each: true })
  @ArrayUnique()
  readonly roles: UserRoleEnum[];
}
