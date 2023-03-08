import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DinerService } from './diner.service';

@ApiTags('就餐')
@Controller('diner')
export class DinerController {
  constructor (private readonly dinerService: DinerService) {}

  @ApiOperation({summary: '设置明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async settingBookingDate() {
    // 
  }

  @ApiOperation({summary: '更新明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateBookingDate() {
    // 
  }

  @ApiOperation({summary: '删除明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteBookingDate() {
    // 
  }

  @ApiOperation({summary: '查询单条明日来客/三餐预约时间段'})
  @UseGuards(JwtAuthGuard)
  @Post('query')
  async querBookingDate() {
    // 
  }
}
