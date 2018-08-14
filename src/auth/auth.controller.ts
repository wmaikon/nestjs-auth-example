import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { MongoExceptionFilter } from '@filters/mongo-exception.filter';
import { CreateAccessTokenDto } from '@auth/dto/create-access-token.dto';
import { SignInDto } from '@auth/dto/sign-in.dto';
import { SignOutDto } from '@auth/dto/sign-out.dto';
import { SignInReturnValue } from '@auth/interfaces/signin-returnvalue.interface';
import { SignOutReturnValue } from '@auth/interfaces/signout-returnvalue.interface';
import { CreateAccessTokenReturnValue } from '@auth/interfaces/create-accesstoken-returnvalue.interface';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
@UseFilters(MongoExceptionFilter, HttpExceptionFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  /**
  * Sign in user via email and password.
  * @param {SignInDto} signInDto - A data-transfer-object describing the user to be signed in
  * @return {Promise<SignInReturnValue>} A promise resolving in the sign in return value
  */
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto): Promise<SignInReturnValue> {
    return await this.authService.signIn(signInDto);
  }

  /**
  * Sign out user
  * @param {SignOutDto} signOutDto - A data-transfer-object describing the user to be signed out
  * @return {Promise<SignOutReturnValue>} A promise resolving in the sign out return value
  */
  @Post('signout')
  async signOut(@Body() signOutDto: SignOutDto): Promise<SignOutReturnValue> {
    return await this.authService.signOut(signOutDto);
  }

  /**
  * Get a new access token from a refresh token
  * @param {CreateAccessTokenDto} createAccessTokenDto - A data-transfer-object describing the refresh token
  * @return {Promise<CreateAccessTokenReturnValue>} A promise resolving in the access token
  */
  @Post('accesstoken')
  async createUserAccessToken(@Body() createAccessTokenDto: CreateAccessTokenDto): Promise<CreateAccessTokenReturnValue> {
    return await this.authService.createAccessTokenFromRefreshToken(createAccessTokenDto);
  }

}
