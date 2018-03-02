import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';

@Module({
  components: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
