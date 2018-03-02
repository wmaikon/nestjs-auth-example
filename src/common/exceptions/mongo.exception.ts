import { ExceptionFilter, Catch, ConflictException } from '@nestjs/common';
import { MongoError } from 'mongodb';
import { httpResponse } from './httpResponse';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, response) {

    switch (exception.code) {
      case 11000:
        // duplicate exception
        httpResponse(new ConflictException(), response);
    }

  }
}
