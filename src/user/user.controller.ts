import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { Types as MongooseTypes } from 'mongoose';
import { Token } from '@decorators/token.decorator';
import { TokenRequirements } from '@decorators/token-requirements.decorator';
import { HttpExceptionFilter } from '@filters/http-exception.filter';
import { MongoExceptionFilter } from '@filters/mongo-exception.filter';
import { AccessToken } from '@token/interfaces/access-token.interface';
import { UserService } from '@user/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { UpdateUserSelfDto } from '@user/dto/update-user-self.dto';
import { User } from '@user/interfaces/user.interface';
import { TokenTypeEnum } from '@token/enums/token-type.enum';
import { UserRoleEnum } from '@token/enums/user-role.enum';
import { TokenGuard } from '@guards/token.guard';
import { ObjectIdPipe } from '@pipes/object-id.pipe';

@Controller('user')
@UseFilters(MongoExceptionFilter, HttpExceptionFilter)
@UseGuards(TokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
  * Routes for authenticated users only
  */

  /**
  * Get the own user
  * @return {User} A single user
  */
  @Get('self')
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.USER])
  public async getSelf(@Token() token: AccessToken): Promise<User> {
    return this.userService.findOneByEmail(token.sub);
  }

  /**
  * Update the own user
  * @param {UpdateUserSelfDto} updateUserSelfDto - A data-transfer-object describing the user to be updated
  * @return {User} The updated user
  */
  @Put('self')
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.USER])
  public async updateSelf(@Token() token: AccessToken, @Body() updateUserSelfDto: UpdateUserSelfDto): Promise<User> {
    return this.userService.updateSelf(token.sub, updateUserSelfDto);
  }

  
  /**
  * Routes for administrators only
  */

  /**
  * Get all users
  * @return {User[]} A list containing all users
  */
  @Get()
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.ADMIN])
  public async getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  /**
  * Create a new user
  * @param {CreateUserDto} createUserDto - A data-transfer-object describing the new user
  * @return {User} The newly created user
  */
  @Post()
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.ADMIN])
  public async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  /**
  * Update an existing user
  * @param {ObjectId} userid - The user id
  * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
  * @return {User} The updated user
  */
  @Put(':userid')
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.ADMIN])
  public async update(@Param('userid', new ObjectIdPipe()) userid: MongooseTypes.ObjectId, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(userid, updateUserDto);
  }

  /**
  * Delete an existing user
  * @param {ObjectId} userid - The user id
  * @return {User} The deleted user
  */
  @Delete(':userid')
  @TokenRequirements(TokenTypeEnum.CLIENT, [UserRoleEnum.ADMIN])
  public async delete(@Param('userid', new ObjectIdPipe()) userid: MongooseTypes.ObjectId): Promise<User> {
    return this.userService.delete(userid);
  }

}
