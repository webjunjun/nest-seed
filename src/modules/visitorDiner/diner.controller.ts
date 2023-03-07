import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VisitorDinerEntity } from 'src/entity/visitor-diner.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VisitorDinerService } from './diner.service';
import { VisitorDinerCreateDto } from './dto/diner-create.dto';
import { VisitorDinerSearchDto } from './dto/diner-search.dto';
import { VisitorDinerUpdateDto } from './dto/diner-update.dto';

@ApiTags('来客就餐预约')
@Controller('visitor')
export class VisitorDinerController {
  constructor (
    private readonly visitorDinerService: VisitorDinerService
  ) {}

  @ApiOperation({summary: '分页查询来客就餐'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryCommuteList(@Body() visitorPage: VisitorDinerSearchDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<VisitorDinerEntity>
  }> {
    const pageData = await this.visitorDinerService.queryVisitorList(visitorPage).catch(() => {
      throw new HttpException('查询来客就餐预约列表失败', HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(visitorPage.pageSize) || 10,
      currentPage: Number(visitorPage.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '查询单条来客就餐'})
  @UseGuards(JwtAuthGuard)
  @Post('queryOne')
  async queryCommuteOne(@Body() visitorInfo: {
    visitorId: number
  }): Promise<VisitorDinerEntity> {
    const data = await this.visitorDinerService.getVisitorDinerById(visitorInfo.visitorId).catch(() => {
      throw new HttpException('查询来客就餐预约失败', HttpStatus.BAD_REQUEST);
    });
    return data;
  }

  @ApiOperation({summary: '发布来客就餐'})
  @UseGuards(JwtAuthGuard)
  @Post('publish')
  async createCommute(@Body() dinerObject: VisitorDinerCreateDto): Promise<string> {
    await this.visitorDinerService.publishVisitorDiner(dinerObject).catch(() => {
      throw new HttpException('发布来客就餐预约失败', HttpStatus.BAD_REQUEST);
    });
    return '发布来客就餐预约成功';
  }

  @ApiOperation({summary: '编辑来客就餐'})
  @UseGuards(JwtAuthGuard)
  @Post('modify')
  async updateVisitorDiner(@Body() dinerObject: VisitorDinerUpdateDto): Promise<string> {
    await this.visitorDinerService.modifyVisitorDiner(dinerObject).catch(() => {
      throw new HttpException('修改来客就餐预约失败', HttpStatus.BAD_REQUEST);
    });
    return '修改来客就餐预约成功';
  }

  @ApiOperation({summary: '删除来客就餐记录'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteVisitorDiner(@Body() visitorInfo: {
    visitorId: number
  }): Promise<string> {
    await this.visitorDinerService.deleteVisitorDiner(visitorInfo.visitorId).catch(() => {
      throw new HttpException('删除来客就餐预约失败', HttpStatus.BAD_REQUEST);
    });
    return '删除来客就餐预约成功';
  }
}
