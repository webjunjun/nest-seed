import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DinerItemEntity } from 'src/entity/diner-item.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DinerItemService } from './diner-item.service';
import { DinerItemAddDto } from './dto/diner-item-add.dto';
import { DinerItemDeleteDto } from './dto/diner-item-delete.dto';
import { DinerItemQueryDto } from './dto/diner-item-query.dto';

@ApiTags('就餐预约')
@Controller('dinerItem')
export class DinerItemController {
  constructor (private readonly dinerItemService: DinerItemService) {}

  @ApiOperation({summary: '查询今日/明日三餐'})
  @UseGuards(JwtAuthGuard)
  @Post('twoDays')
  async queryTodayDiner(@Body() eaterObj: {
    eaterId: string
  }): Promise<{
    today: DinerItemEntity,
    tomorrow: DinerItemEntity
  }> {
    const pageData = await this.dinerItemService.queryTwodays(eaterObj.eaterId).catch(() => {
      throw new HttpException('查询我的今日三餐列表失败', HttpStatus.BAD_REQUEST);
    });
    return pageData;
  }

  @ApiOperation({summary: '预约明日三餐'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingTomorrowDiner(@Body() singleObject: DinerItemAddDto): Promise<{
    today: DinerItemEntity,
    tomorrow: DinerItemEntity
  }> {
    if (!singleObject.morning && !singleObject.midday && !singleObject.evening) {
      throw new HttpException('预约类型不能为空', HttpStatus.BAD_REQUEST);
    }
    let pageData = null
    if (singleObject.id) {
      pageData = await this.dinerItemService.modifyOne(singleObject).catch(() => {
        if (singleObject.morning == -1 || singleObject.midday == -1 || singleObject.evening == -1) {
          throw new HttpException('取消明日就餐失败', HttpStatus.BAD_REQUEST);
        }
        throw new HttpException('明日就餐预约失败', HttpStatus.BAD_REQUEST);
      });
    } else {
      pageData = await this.dinerItemService.addOne(singleObject).catch(() => {
        throw new HttpException('明日就餐预约失败', HttpStatus.BAD_REQUEST);
      });
    }
    return pageData;
  }

  @ApiOperation({summary: '查询所有人的今日三餐列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryTodayList(@Body() singleObject: DinerItemQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<DinerItemEntity>
  }> {
    const pageData = await this.dinerItemService.queryList(singleObject).catch(() => {
      throw new HttpException('查询三餐列表失败', HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(singleObject.pageSize) || 10,
      currentPage: Number(singleObject.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '查询自己的今日三餐列表'})
  @UseGuards(JwtAuthGuard)
  @Post('mineList')
  async queryMyDinerList(@Body() singleObject: DinerItemQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<DinerItemEntity>
  }> {
    const pageData = await this.dinerItemService.queryList(singleObject).catch(() => {
      throw new HttpException('查询我的今日三餐列表失败', HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(singleObject.pageSize) || 10,
      currentPage: Number(singleObject.currentPage) || 1,
      list: pageData
    }
  }
}
