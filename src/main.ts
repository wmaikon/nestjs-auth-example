import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from '@app/app.module';
import { NetworkConstants } from '@constants/network.constants';

async function bootstrap() {
  const server = express();
  server.disable('x-powered-by');

  const app = await NestFactory.create(AppModule, server);
  await app.listen(NetworkConstants.port);
}
bootstrap();
