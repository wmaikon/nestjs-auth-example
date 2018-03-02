import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { Config } from './config';
import { HttpExceptionFilter } from './common/exceptions/http.exception';
import { MongoExceptionFilter } from './common/exceptions/mongo.exception';
import { ValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalFilters(new MongoExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(Config.network.port);
}
bootstrap();
