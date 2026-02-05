import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    this.logger.warn(
      `${request.method} ${request.url} ${status}`,
      exception instanceof Error ? exception.stack : undefined,
    );
    if (!response.headersSent) {
      const body =
        exception instanceof HttpException
          ? exception.getResponse()
          : 'Internal Server Error';
      const payload =
        typeof body === 'object' && body !== null
          ? { statusCode: status, ...body }
          : { statusCode: status, message: body };
      response.status(status).json(payload);
      return;
    }
    super.catch(exception, host);
  }
}
