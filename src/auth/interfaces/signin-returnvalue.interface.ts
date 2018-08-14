import { User } from '@user/interfaces/user.interface';

export interface SignInReturnValue {
  readonly refresh_token: string;
  readonly access_token: string;
  readonly user: User;
}
