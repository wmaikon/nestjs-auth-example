import { Post, Body, Controller, UseInterceptors, UseGuards, UnauthorizedException } from '@nestjs/common';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { GetUserTokenDto } from './dto/get-usertoken.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/roles/user.role';

@Controller('user')
@UseInterceptors(TransformInterceptor)
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  async getUserToken(@Body() getUserTokenDto: GetUserTokenDto): Promise<string> {
    return await this.userService.getUserToken(getUserTokenDto);
  }

  @Post()
  @Roles(Role.CREATE_USER)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

}
