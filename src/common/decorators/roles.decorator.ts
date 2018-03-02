import { ReflectMetadata } from '@nestjs/common';
import { Role } from '../roles/user.role';

export const Roles = (...roles: Role[]) => ReflectMetadata('roles', roles);
