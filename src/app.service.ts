import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  root(): string {
    throw new NotFoundException();
  }
}
