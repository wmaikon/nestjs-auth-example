import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { refreshTokenProviders } from '@auth/refreshtoken.providers';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UserModule)],
  controllers: [AuthController],
  providers: [AuthService, ...refreshTokenProviders],
  exports: [AuthService]
})
export class AuthModule {}
