import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException,
  HttpStatus, UnauthorizedException
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

// catch不填参数 捕获每一个异常
@Catch()
export class BaseExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost; // 解决httpAdapte某些情况下在构造方法中不可用

    const ctx = host.switchToHttp();
    // exception在不在HttpException里
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = '';
    console.log(exception);
    if (exception instanceof HttpException) {
      if (exception.message) {
        const currentResponse: string | object = exception.getResponse();
        if (typeof currentResponse === 'object') {
          // 校验器返回的是数组 所以取第一个
          if (typeof currentResponse['message'] === 'object') {
            message = currentResponse['message'][0];
          } else {
            message = currentResponse['message'];
          }
        } else {
          message = exception.message;
        }
      }
    } else if (exception instanceof UnauthorizedException) {
      console.log('22', exception.getResponse())
    } else {
      message = httpStatus >= 500 ? 'Internet Server Error' : 'Client Error';
    }

    // 认证不通过
    if (httpStatus === 401) {
      message = '用户未登录或登录过期';
    }

    const responseBody: {
      code: number,
      statusCode: number,
      msg: string | object,
      data: null,
      // path: string,
      timestamp: string
    } = {
      code: -1,
      statusCode: httpStatus,
      msg: message,
      data: null,
      // path: httpAdapter.getRequestUrl(ctx.getRequest()),
      // timestamp: new Date().toISOString()
      timestamp: new Date().toLocaleString()
    }

    // httpAdapter.reply(ctx.getResponse(), responseBody, 200);
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}