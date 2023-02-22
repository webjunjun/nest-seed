import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import envConfig from './config/env'
import { CoreModule } from './core/core.module';
import { HelloModule } from './modules/hello/hello.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisCacheModule } from './modules/redis/redis-cache.module';
import { UploadModule } from './modules/upload/upload.module';
import { CodesModule } from './modules/codes/codes.module';

@Module({
  // 所有模块导入在这里，才能生效
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局 不用在其他模块导入
      envFilePath: [envConfig.path] // 配置文件路径
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql', // 数据库类型
          entities: [path.resolve(__dirname, './entity/*.entity.{js,ts}')], // 数据表实体
          host: configService.get<string>('DB_HOST'), // 主机
          port: configService.get<number>('DB_PORT'), // 端口号
          username: configService.get('DB_USER'), // 用户名
          password: configService.get('DB_PASSWD'), // 密码
          database: configService.get('DB_DATABASE'), // 数据库名
          timezone: configService.get('DB_TIMEZONE', '+08:00'), // 服务器上配置的时区 默认东八区
          synchronize: configService.get('DB_CREATEAUTO'), // 根据实体自动创建数据库表 生产环境建议关闭
          autoLoadEntities: false,
          dateStrings: true // 转成js的时间格式
        }
      }
    }),
    RedisCacheModule,
    CoreModule,
    UploadModule,
    HelloModule,
    AuthModule,
    UserModule,
    CodesModule
  ]
})
export class AppModule {}
