import { Document } from 'mongoose';
import { Role } from '../../common/roles/user.role';

export interface User extends Document {
  readonly email: string;
  readonly password: string;
  readonly created_at: Date;
  readonly roles: Role[];
}
