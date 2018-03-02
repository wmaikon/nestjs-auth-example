import { Component, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../common/auth/auth.service';
import { GetUserTokenDto } from './dto/get-usertoken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';
import { Token } from '../common/auth/token.interface';

@Component()
export class UserService {
  constructor(
    @InjectModel(UserSchema) private readonly userModel: Model<User>,
    private readonly authService: AuthService
  ) {}

  async getUserPasswordByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email }, 'password').exec();
  }

  async getUserToken(getUserTokenDto: GetUserTokenDto): Promise<string> {
    // get the database user
    const dbUser = await this.getUserPasswordByEmail(getUserTokenDto.email);
    if (!dbUser) throw new UnauthorizedException();

    // compare provided password with the database user password
    const passwordsMatch = await bcrypt.compare(getUserTokenDto.password, dbUser.password);
    if (!passwordsMatch) throw new UnauthorizedException();

    const tokenPayload = { email: getUserTokenDto.email };
    const token = this.authService.sign(tokenPayload);
    return 'Bearer ' + token;
  }

  async getUserByEmail(email: string) : Promise<User> {
    return await this.userModel.findOne({ email: email}).exec();
  }

  async validateUserToken(token: string): Promise<Token> {
    return this.authService.verify(token);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return await createdUser.save();
  }
}
