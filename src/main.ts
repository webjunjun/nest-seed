import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
// import * as csurf from 'csurf';

async function bootstrap() {
  // 创建应用
  const app = await NestFactory.create(AppModule);

  // ip请求接口限流
  app.use(
    rateLimit({
      windowMs: 60 * 1000,// 1分钟
      max: 10, // 每个IP的windowMs(1分钟)内，最大请求值10次
    })
  );

  // 跨站点请求伪造CSRF保护
  // app.use(csurf());

  // 启用CORS
  app.enableCors({
    origin: '*', // 允许所有域名
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // 允许跨域的方法
    // exposedHeaders: [''], // 自定义请求头
    credentials: true, // 是否携带cookie
    // maxAge: 1800, // cookie过期时间
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // 引入swagger
  const config = new DocumentBuilder()
    .setTitle('NEST-SEED')
    .setDescription('The nest-seed API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 全局路由
  // app.setGlobalPrefix('api');

  // 全局利用dto对数据进行简单校验
  app.useGlobalPipes(new ValidationPipe());

  // 监听端口
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
