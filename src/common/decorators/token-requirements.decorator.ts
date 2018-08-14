import { ReflectMetadata } from '@nestjs/common';
import { TokenTypeEnum } from '@token/enums/token-type.enum';
import { UserRoleEnum } from '@token/enums/user-role.enum';

export const TokenRequirements = (requiredTokenType: TokenTypeEnum, requiredUserRoles: UserRoleEnum[]) => ReflectMetadata('tokenrequirements', new TokenRequirementsHelper(requiredTokenType, requiredUserRoles));

export class TokenRequirementsHelper {

  private requiredTokenType: TokenTypeEnum;
  private requiredUserRoles: UserRoleEnum[];

  constructor(requiredTokenType: TokenTypeEnum, requiredUserRoles: UserRoleEnum[]) {
    this.requiredTokenType = requiredTokenType;
    this.requiredUserRoles = requiredUserRoles;
  }

  public tokenIsOfType(tokenType: TokenTypeEnum): Boolean {
    return tokenType === this.requiredTokenType;
  }

  public tokenHasAllUserRoles(userRoles: UserRoleEnum[]): Boolean {
    return this.requiredUserRoles.every(requiredRole => userRoles.indexOf(requiredRole) >= 0);
  }

}
