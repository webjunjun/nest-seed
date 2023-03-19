import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HaircutEntity } from 'src/entity/haircut.entity';
import { InsertResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HaircutAddDto } from './dto/haircut-add.dto';
import { HaircutDeleteDto } from './dto/haircut-delete.dto';
import { HaircutQueryDto } from './dto/haircut-query.dto';
import { HaircutService } from './haircut.service';

@ApiTags('理发预约')
@Controller('haircut')
export class HaircutController {
  constructor (private readonly haircutService: HaircutService) {}

  @ApiOperation({summary: '查询是否预约理发'})
  @UseGuards(JwtAuthGuard)
  @Post('resultBooking')
  async queryBookingHistory(@Body() haircutObj: HaircutQueryDto): Promise<HaircutEntity> {
    return this.haircutService.resultBooking(haircutObj);
  }

  @ApiOperation({summary: '取消预约理发'})
  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancelBooking(@Body() haircutObj: HaircutDeleteDto): Promise<boolean> {
    return this.haircutService.deleteOne(haircutObj).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    });
  }

  @ApiOperation({summary: '预约理发'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingHair(@Body() haircutObj: HaircutAddDto): Promise<boolean> {
    return this.haircutService.addOne(haircutObj).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    });
  }

  @ApiOperation({summary: '预约理发列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryBookingList(@Body() haircutObj: HaircutQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<HaircutEntity>
  }> {
    const pageData = await this.haircutService.queryList(haircutObj).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(haircutObj.pageSize) || 10,
      currentPage: Number(haircutObj.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '预约理发总数/本周总数'})
  @UseGuards(JwtAuthGuard)
  @Post('count')
  async queryBookingCount(@Body() haircutObj: HaircutQueryDto): Promise<number> {
    return this.haircutService.queryBookingCount(haircutObj).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST)
    });
  }
}
