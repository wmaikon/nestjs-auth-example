import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config } from './config';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [MongooseModule.forRoot(Config.db.uri), UserModule],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule {}
