import { ExceptionFilter, Catch, HttpException } from '@nestjs/common';
import { httpResponse } from './httpResponse';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, response) {
    httpResponse(exception, response);
  }
}
