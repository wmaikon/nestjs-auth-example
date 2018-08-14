import { ArgumentsHost, Catch, ConflictException, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { httpResponse } from '@filters/http-response';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    switch (exception.code) {
      case 11000:
        // duplicate exception
        httpResponse(new ConflictException(), host);
    }
  }
}
