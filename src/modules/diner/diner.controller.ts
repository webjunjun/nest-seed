import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DinerEntity } from 'src/entity/diner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DinerService } from './diner.service';
import { DinerAddDto } from './dto/diner-add.dto';
import { DinerDeleteDto } from './dto/diner-delete.dto';
import { DinerEditDto } from './dto/diner-edit.dto';
import { DinerQueryDto } from './dto/diner-query.dto';

@ApiTags('就餐')
@Controller('diner')
export class DinerController {
  constructor (private readonly dinerService: DinerService) {}

  @ApiOperation({summary: '设置明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async settingBookingDate(@Body() singleObject: DinerAddDto): Promise<string> {
    await this.dinerService.addOne(singleObject).catch(() => {
      throw new HttpException('设置失败', HttpStatus.BAD_REQUEST);
    });
    return '设置成功';
  }

  @ApiOperation({summary: '更新明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateBookingDate(@Body() singleObject: DinerEditDto): Promise<string> {
    await this.dinerService.modifyOne(singleObject).catch(() => {
      throw new HttpException('修改失败', HttpStatus.BAD_REQUEST);
    });
    return '修改成功';
  }

  @ApiOperation({summary: '删除明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteBookingDate(@Body() singleObject: DinerDeleteDto): Promise<string> {
    await this.dinerService.deleteOne(singleObject).catch(() => {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    });
    return '删除成功';
  }

  @ApiOperation({summary: '查询单条明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('query')
  async querBookingDate(@Body() singleObject: DinerQueryDto): Promise<DinerEntity> {
    const data = await this.dinerService.queryOne(singleObject).catch(() => {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    });
    return data;
  }

  @ApiOperation({summary: '查询设置的预约时间段列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryTodayList(@Body() singleObject: DinerQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<DinerEntity>
  }> {
    const pageData = await this.dinerService.queryList(singleObject).catch(() => {
      throw new HttpException('查询预约时间段列表失败', HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(singleObject.pageSize) || 10,
      currentPage: Number(singleObject.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '查询最新设置的单条明日三餐和来客记录'})
  @UseGuards(JwtAuthGuard)
  @Post('tomorrow')
  async querLateBooking(): Promise<{
    today: DinerEntity,
    visit: DinerEntity,
    meal: DinerEntity
  }> {
    const data = await this.dinerService.queryLate().catch(() => {
      throw new HttpException('查询失败', HttpStatus.BAD_REQUEST);
    });
    return data;
  }
}
