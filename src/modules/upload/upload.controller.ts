import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('文件上传')
@Controller('file')
export class UploadController {

  @ApiOperation({summary: '上传头像'})
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): string {
    const todayDate = new Date().toJSON().substring(0, 10).replace('T', ' ');
    return `/${todayDate}/${file.filename}`;
  }
}