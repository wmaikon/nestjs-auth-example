import { IsString, IsEmail, IsDate, IsOptional, IsEnum, ArrayUnique } from 'class-validator';
import { Role } from '../../common/roles/user.role';

export class CreateUserDto {
  @IsEmail() readonly email: string;
  @IsString() readonly password: string;

  @IsOptional()
  @IsDate()
  readonly created_at: Date;

  @IsOptional()
  @IsEnum(Role, { each: true })
  @ArrayUnique()
  readonly roles: Role[];
}
