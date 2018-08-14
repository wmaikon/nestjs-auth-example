import { TokenTypeEnum } from '@token/enums/token-type.enum';
import { UserRoleEnum } from '@token/enums/user-role.enum';

export interface AccessToken {
  readonly sub: string;
  readonly type: TokenTypeEnum;
  readonly rs: UserRoleEnum[];
}
