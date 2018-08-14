import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService,
    // global pipe
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })
    }
  ]
})
export class AppModule {}
