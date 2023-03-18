import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RichTextEntity } from 'src/entity/rich-text.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SingleCreateDto } from './dto/single-create.dto';
import { SingleDeleteDto } from './dto/single-delete.dto';
import { SingleQueryDto } from './dto/single-query.dto';
import { SingleUpdateDto } from './dto/single-update.dto';
import { SingleService } from './single.service';

@ApiTags('单页面')
@Controller('single')
export class SingleController {
  constructor (private readonly singleService: SingleService) {}

  @ApiOperation({summary: '新增文章'})
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addSinglePage(@Body() singleObject: SingleCreateDto): Promise<string> {
    await this.singleService.addOne(singleObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '新增单页面成功';
  }

  @ApiOperation({summary: '编辑文章'})
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateSinglePage(@Body() singleObject: SingleUpdateDto): Promise<string> {
    await this.singleService.modifyOne(singleObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '修改单页面成功';
  }

  @ApiOperation({summary: '删除文章'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteSinglePage(@Body() singleObject: SingleDeleteDto): Promise<string> {
    await this.singleService.deleteOne(singleObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '删除单页面成功';
  }

  @ApiOperation({summary: '查询文章'})
  @UseGuards(JwtAuthGuard)
  @Post('query')
  async querySinglePage(@Body() singleObject: SingleQueryDto): Promise<RichTextEntity> {
    const data = await this.singleService.queryOne(singleObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return data;
  }

  @ApiOperation({summary: '查询文章列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async querySinglePageList(@Body() singleObject: SingleQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<RichTextEntity>
  }> {
    const pageData = await this.singleService.queryList(singleObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(singleObject.pageSize) || 10,
      currentPage: Number(singleObject.currentPage) || 1,
      list: pageData
    }
  }
}
