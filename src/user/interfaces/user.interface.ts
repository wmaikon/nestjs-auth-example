import { Document } from 'mongoose';
import { UserRoleEnum } from '@token/enums/user-role.enum';

export interface User extends Document {
  readonly email: string;
  readonly password: string;
  readonly created_at: Date;
  readonly roles: UserRoleEnum[];
}
