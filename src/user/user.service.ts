import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { compare as bcryptCompare } from 'bcrypt';
import { Model, Types as MongooseTypes } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserSelfDto } from './dto/update-user-self.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@Inject('UserModelToken') private readonly userModel: Model<User>) {}

  /**
  * Get all users
  * @return {User[]} A list containing all users
  */
  public async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  /**
  * Get a single user through defined criterias
  * @param {object} criteria - The defined criterias
  * @param {string} projection - Optional projection field (i.e. which fields to return)
  * @return {User} A single user
  */
  public async findOne(criteria: object, projection?: string): Promise<User> {
    if (!criteria) throw new BadRequestException();
    const user = await this.userModel.findOne(criteria, projection).exec();
    if (!user) throw new NotFoundException();
    return user;
  }

  /**
  * Get a single user through its email address
  * @param {string} email - The user's email address
  * @return {User} A single user
  */
  public async findOneByEmail(email: string): Promise<User> {
    return await this.findOne({ email: email });
  }

  /**
  * Get a single user through its email address and return also the password field
  * @param {string} email - The user's email address
  * @return {User} A single user
  */
  public async findOneByEmailWithPassword(email: string): Promise<User> {
    return await this.findOne({ email: email }, '+password');
  }

  /**
  * Get a single user through its identifier
  * @param {ObjectId} userid - The mongodb object id
  * @return {User} A single user
  */
  public async findOneById(userid: MongooseTypes.ObjectId): Promise<User> {
    return await this.findOne({ _id: userid });
  }

  /**
  * Validates the credentials for a given user
  * @param {User} user - The user for which to validate the password
  * @return {Boolean} - Value indicating if the passwords match
  */
  public async validateCredentials(user: User, password: string): Promise<Boolean> {
    return bcryptCompare(password, user.password);
  }

  /**
  * Create a new user
  * @param {CreateUserDto} createUserDto - A data-transfer-object describing the new user
  * @return {User} The newly created user
  */
  public async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  /**
  * Update an existing user
  * @param {ObjectId} userid - The mongodb object id
  * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
  * @return {User} The updated user
  */
  public async update(userid: MongooseTypes.ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const dbUser = await this.findOneById(userid);
    if (!dbUser) throw new BadRequestException();
    dbUser.set(updateUserDto);
    return dbUser.save();
  }

  /**
  * Update the own user
  * @param {String} email - The email address of the current user
  * @param {UpdateUserDto} updateUserDto - A data-transfer-object describing the user to be updated
  * @return {User} The updated user
  */
  public async updateSelf(email: string, updateUserSelfDto: UpdateUserSelfDto): Promise<User> {
    const dbUser = await this.findOneByEmail(email);
    if (!dbUser) throw new BadRequestException();
    dbUser.set(updateUserSelfDto);
    return dbUser.save();
  }

  /**
  * Delete an existing user
  * @param {ObjectId} userid - The mongodb object id
  * @return {User} The deleted user
  */
  public async delete(userid: MongooseTypes.ObjectId): Promise<User> {
    const dbUser = await this.findOneById(userid);
    if (!dbUser) throw new BadRequestException();
    return dbUser.remove();
  }

}
