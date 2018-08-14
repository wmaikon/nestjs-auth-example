import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { generate as generateRandString } from 'randomstring';
import { AuthConstants } from '@constants/auth.constants';
import { TokenTypeEnum } from '@token/enums/token-type.enum';
import { AccessToken } from '@token/interfaces/access-token.interface';
import { RefreshToken } from '@token/interfaces/refresh-token.interface';
import { User } from '@user/interfaces/user.interface';
import { SignInDto } from '@auth/dto/sign-in.dto';
import { SignInReturnValue } from '@auth/interfaces/signin-returnvalue.interface';
import { UserService } from '@user/user.service';
import { SignOutDto } from '@auth/dto/sign-out.dto';
import { SignOutReturnValue } from '@auth/interfaces/signout-returnvalue.interface';
import { CreateAccessTokenReturnValue } from '@auth/interfaces/create-accesstoken-returnvalue.interface';
import { CreateAccessTokenDto } from '@auth/dto/create-access-token.dto';

@Injectable()
export class AuthService {

  private jwtPrivateKey: Buffer;
  private jwtPublicKey: Buffer;

  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @Inject('RefreshTokenModelToken') private readonly refreshTokenModel: Model<RefreshToken>) {
    try {
      this.jwtPrivateKey = fs.readFileSync(AuthConstants.cert.privateKey);
      this.jwtPublicKey = fs.readFileSync(AuthConstants.cert.publicKey);
    } catch (err) {
      throw new Error('One or more certificates could not be loaded');
    }
  }

  /**
  * Sign in a user
  * @param {SignInDto} signInDto - The DTO describing the user who wants to sign in
  * @return {Promise<SignInReturnValue>} A promise resolving in the sign in return value
  */
  public async signIn(signInDto: SignInDto): Promise<SignInReturnValue> {
    // get database user and validate password
    const dbUser = await this.userService.findOneByEmailWithPassword(signInDto.email);
    const passwordsMatch = await this.userService.validateCredentials(dbUser, signInDto.password);
    if (!passwordsMatch) throw new UnauthorizedException();

    // generate and store refresh token
    const refreshToken = generateRandString(AuthConstants.refresh_token.length);
    const userRefreshToken = new this.refreshTokenModel({
      refresh_token: refreshToken,
      email: signInDto.email
    });
    await userRefreshToken.save();

    // generate an access token for immediate usage as well
    const accessToken = this.createAccessTokenFromUser(dbUser);

    // create return object
    const returnValue: SignInReturnValue = {
      refresh_token: refreshToken,
      access_token: accessToken,
      user: dbUser
    };

    return returnValue;
  }

  /**
  * Sign out a user
  * @param {SignOutDto} signOutDto - The DTO describing the user who wants to sign out
  * @return {Promise<SignOutReturnValue>} A promise resolving in the sign out return value
  */
  public async signOut(signOutDto: SignOutDto): Promise<SignOutReturnValue> {
    const removedRefreshToken = await this.refreshTokenModel.findOneAndRemove({ refresh_token: signOutDto.refresh_token }).exec();

    const returnValue: SignOutReturnValue = {
      signedout: !!removedRefreshToken
    };
    return returnValue;
  }

  /**
  * Get a new access token from a refresh token
  * @param {CreateAccessTokenDto} createAccessTokenDto - A data-transfer-object describing the refresh token
  * @return {Promise<CreateAccessTokenReturnValue>} A promise resolving in the access token
  */
  public async createAccessTokenFromRefreshToken(createAccessTokenDto: CreateAccessTokenDto): Promise<CreateAccessTokenReturnValue> {
    const refreshToken = await this.refreshTokenModel.findOne({ refresh_token: createAccessTokenDto.refresh_token }).exec();
    if (refreshToken && refreshToken.email === createAccessTokenDto.email) {

      // extend lifetime of the user refresh token by saving it again
      await refreshToken.save();

      // create a new access token
      const dbUser = await this.userService.findOne({ email: createAccessTokenDto.email });
      const newUserAccessToken: CreateAccessTokenReturnValue = {
        access_token: this.createAccessTokenFromUser(dbUser)
      };
      return newUserAccessToken;
    } else {
      throw new UnauthorizedException();
    }
  }

  /**
  * Generate an access token for a given user
  * @param {User} user - The user for whom to create the token
  * @return {string} The generated access token
  */
  private createAccessTokenFromUser(user: User): string {
    const payload: AccessToken = {
      type: TokenTypeEnum.CLIENT,
      sub: user.email,
      rs: user.roles
    };
    return jwt.sign(payload, this.jwtPrivateKey, AuthConstants.access_token.options);
  }

  /**
  * Validate an access token. Throws an exception when the token is invalid
  * @param {string} token - The token to validate
  * @return {AccessToken} The decoded token
  */
  public validateAccessToken(accessToken: string): AccessToken {
    return jwt.verify(accessToken, this.jwtPublicKey, { issuer: AuthConstants.access_token.options.issuer }) as AccessToken;
  }
  
}
