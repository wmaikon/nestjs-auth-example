import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TokenRequirementsHelper } from '@decorators/token-requirements.decorator';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check if decorator is present
    const tokenRequirements = this.reflector.get<TokenRequirementsHelper>('tokenrequirements', context.getHandler());

    if (!tokenRequirements) {
      // no token requirements
      return true;
    } else {
      const req = context.switchToHttp().getRequest();
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1];
          const decodedToken = await this.authService.validateAccessToken(token);

          // check if token is of the right type
          if (!tokenRequirements.tokenIsOfType(decodedToken.type)) return false;

          // check if token has the necessary user roles
          if (!tokenRequirements.tokenHasAllUserRoles(decodedToken.rs)) return false;

          // save token in request object
          req.token = decodedToken;

          return true;

        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    }
  }
}
