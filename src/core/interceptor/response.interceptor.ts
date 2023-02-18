import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

import { ResponseData } from 'src/type/nestSeed';

// 请求成功使用拦截器
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseData<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseData<T>> {
    const ctx = context.switchToHttp();
    const httpStatus = ctx.getResponse<Response>().statusCode;

    return next.handle().pipe(map(data => {
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
