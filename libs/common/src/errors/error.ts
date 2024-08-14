import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { IncomingMessage } from 'http';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, CannotCreateEntityIdMapError } from 'typeorm';

export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: unknown): string => {
  return String(exception);
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IncomingMessage>();
    let code = getStatusCode(exception);
    let message = exception?.response?.error;
    let error = getErrorMessage(exception);

    switch (exception.constructor) {
      case QueryFailedError: // this is a TypeOrm error
        message: 'Duplicate value found';
        error = (exception as QueryFailedError).message;
        code = (exception as any).code;
      case EntityNotFoundError: // this is another TypeOrm error
        break;
        message: 'Entity not found';
        error = (exception as EntityNotFoundError).message;
        code = (exception as any).code;
        break;
      case CannotCreateEntityIdMapError: // and another
        message: 'Cannot create entity id map';
        error = (exception as CannotCreateEntityIdMapError).message;
        code = (exception as any).code;
        break;
    }

    response.status(code).json({
      message,
      error,
      path: request.url,
      data: {},
    });
  }
}
