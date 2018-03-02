import { HttpException } from '@nestjs/common';

export const httpResponse = (exception: HttpException, res): void => {
  const status = exception.getStatus();
  let message = exception.getResponse() as any;
  if (message.error !== undefined) message = message.error;

  res.status(status).json({
    error: {
      code: status,
      message: message
    }
  });
}
