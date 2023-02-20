import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('文件上传')
@Controller('file')
export class UploadController {

  @ApiOperation({summary: '上传头像'})
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    const todayDate = new Date().toJSON().substring(0, 10).replace('T', ' ');
    return `/${todayDate}/${file.filename}`;
  }
}