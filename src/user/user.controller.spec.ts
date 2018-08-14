import { Test, TestingModule } from '@nestjs/testing';
import { hashSync } from 'bcrypt';
import { UserController } from '@user/user.controller';
import { userProviders } from '@user/user.providers';
import { UserService } from '@user/user.service';
import { AuthService } from '@auth/auth.service';
import { DatabaseModule } from '@database/database.module';
import { AuthToken } from '@token/interfaces/auth-token.interface';
import { TokenTypeEnum } from '@token/enums/token-type.enum';
import { UserRoleEnum } from '@token/enums/user-role.enum';
import { DatabaseConstants } from '@constants/database.constants';

describe('UserController', () => {
  let app: TestingModule;
  let userController: UserController;
  let userService: UserService;

  beforeAll(async () => {
    jest.setTimeout(120000);

    app = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [UserController],
      providers: [UserService, ...userProviders, AuthService],
    }).compile();

    userController = app.get<UserController>(UserController);
    userService = app.get<UserService>(UserService);

    const usersMockImplementation = [{
      email: 'test@email.com',
      password: hashSync('testPassword', DatabaseConstants.bcrypt.rounds),
      created_at: new Date('1989-01-06T21:15:00.000Z'),
      roles: []
    }, {
      email: 'test2@email.com',
      password: hashSync('testPassword2', DatabaseConstants.bcrypt.rounds),
      created_at: new Date('1989-01-06T21:15:00.000Z'),
      roles: []
    }];
    jest.spyOn(userService, 'findAll').mockImplementation(() => usersMockImplementation);
  });

  describe('GET /user/self', () => {
    it('using an invalid token should throw an error', async () => {
      
      const authToken: AuthToken = {
        sub: "test@test.com",
        type: TokenTypeEnum.CLIENT,
        rs: [UserRoleEnum.USER]
      };

      await expect(userController.getSelf(authToken)).rejects.toThrowError();
    });
  });
});
