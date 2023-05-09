import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { Logger } from '../../utils/log4js';

import { ResponseData } from 'src/type/nestSeed';

// 请求成功使用拦截器
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseData<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatus = response.statusCode;
    const ctxReq = context.getArgByIndex(1).req;

    response.header('Content-Type', 'application/json; charset=utf-8');

    return next.handle().pipe(map(data => {
      const logFormat = ` <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      Request original url: ${ctxReq.originalUrl}
      Method: ${ctxReq.method}
      IP: ${ctxReq.ip}
      User: ${JSON.stringify(ctxReq.user)}
      Response data:\n ${JSON.stringify(ctxReq.data)}
      <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<`;
      Logger.info(logFormat);
      Logger.access(logFormat);
      return {
        code: 1,
        statusCode: httpStatus,
        msg: '操作成功',
        data: data,
        // timestamp: new Date().toISOString()
        timestamp: new Date().toLocaleString()
      }
    }))
  }
}
