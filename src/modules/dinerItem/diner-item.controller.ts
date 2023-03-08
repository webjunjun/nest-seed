import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DinerItemService } from './diner-item.service';

@ApiTags('就餐')
@Controller('dinerItem')
export class DinerItemController {
  constructor (private readonly dinerItemService: DinerItemService) {}

  @ApiOperation({summary: '查询今日/明日三餐'})
  @UseGuards(JwtAuthGuard)
  @Post('twoDays')
  async queryTodayDiner() {
    // 
  }

  @ApiOperation({summary: '预约明日三餐'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingTomorrowDiner() {
    // 
  }

  @ApiOperation({summary: '取消明日三餐'})
  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async deleteTomorrowDiner() {
    // 
  }

  @ApiOperation({summary: '查询所有人的今日三餐列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryTodayList() {
    // 
  }

  @ApiOperation({summary: '查询自己的今日三餐列表'})
  @UseGuards(JwtAuthGuard)
  @Post('mineList')
  async queryMyDinerList() {
    // 
  }
}
