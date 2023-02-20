import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { join } from 'path';
import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        return {
          storage: diskStorage({
            destination(req, file, cb) {
              const dir = `./public/${new Date().toJSON().substring(0, 10).replace('T', ' ')}`;
              const rootDir = join(__dirname, '../../../', dir);
              if (!existsSync(rootDir)) {
                // 创建目录
                mkdirSync(rootDir);
              }
              cb(null, dir);
            },
            filename(req, file, cb) {
              cb(null, file.originalname);
            }
          })
        }
      }
    })
  ],
  controllers: [UploadController]
})
export class UploadModule {}
