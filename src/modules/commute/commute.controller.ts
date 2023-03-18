import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommuteItemEntity } from 'src/entity/commute-item.entity';
import { CommuteEntity } from 'src/entity/commute.entity';
import { ModifyUserLicensePlate } from 'src/type/nestSeed';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CommuteService } from './commute.service';
import { CommuteCreateDto } from './dto/commute-create.dto';
import { CommuteItemCreateDto } from './dto/commute-item-create.dto';
import { CommuteItemQueryDto } from './dto/commute-item-query.dto';
import { CommuteItemSearchDto } from './dto/commute-item-search.dto';
import { CommuteItemDto } from './dto/commute-item.dto';
import { CommuteOneDto } from './dto/commute-one.dto';
import { CommuteSearchDto } from './dto/commute-search.dto';
import { CommuteStatsDto } from './dto/commute-stats.dto';
import { CommuteUpdateDto } from './dto/commute-update.dto';

@ApiTags('出行')
@Controller('commute')
export class CommuteController {
  constructor (
    private readonly commuteService: CommuteService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({summary: '分页查询发布类型的出行记录'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryCommuteList(@Body() commutePage: CommuteSearchDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<CommuteEntity>
  }> {
    const pageData = await this.commuteService.getCommuteList(commutePage).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(commutePage.pageSize) || 10,
      currentPage: Number(commutePage.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '查询单条发布类型的出行记录'})
  @UseGuards(JwtAuthGuard)
  @Post('one')
  async queryCommuteOne(@Body() commuteInfo: CommuteOneDto): Promise<CommuteEntity> {
    if (!commuteInfo.commuteId) {
      throw new HttpException('出行ID不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.commuteService.getCommuteById(commuteInfo.commuteId).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
  }

  @ApiOperation({summary: '发布出行'})
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCommute(@Body() commuteObject: CommuteCreateDto): Promise<string> {
    const commuteInfo = await this.commuteService.publishCommuteOne(commuteObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    if (commuteInfo.generatedMaps.length > 0) {
      if (commuteObject.modifyUserInfo) {
        const userData: ModifyUserLicensePlate = {
          userId: commuteObject.createdId,
          licensePlate: commuteObject.licensePlate,
          updateId: commuteObject.createdId,
          updateName: commuteObject.createdName
        }
        await this.userService.updateLicensePlateById(userData).catch(async (e) => {
          await this.commuteService.deleteCommuteOne(commuteInfo.generatedMaps[0].id);
          throw new HttpException(e, HttpStatus.BAD_REQUEST);
        });
      }
      await this.commuteService.addCommuteItem({
        commuteId: commuteInfo.generatedMaps[0].id,
        travelerId: commuteObject.createdId,
        traveler: commuteObject.createdName,
        type: '发布',
        commuteDate: commuteObject.commuteDate
      }).catch(async (e) => {
        await this.commuteService.deleteCommuteOne(commuteInfo.generatedMaps[0].id);
        throw new HttpException(e, HttpStatus.BAD_REQUEST);
      });
    }
    return '发布出行成功';
  }

  @ApiOperation({summary: '编辑出行'})
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateCommute(@Body() commuteObject: CommuteUpdateDto): Promise<string> {
    await this.commuteService.modifyhCommuteOne(commuteObject).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '修改出行成功';
  }

  @ApiOperation({summary: '删除出行'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteCommute(@Body()  commuteInfo: CommuteOneDto): Promise<string> {
    await this.commuteService.deleteCommuteOne(commuteInfo.commuteId).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '删除出行成功';
  }

  @ApiOperation({summary: '查询是否预约拼车'})
  @UseGuards(JwtAuthGuard)
  @Post('resultBooking')
  async resultBooking(@Body() commuteItem: CommuteItemDto): Promise<Boolean> {
    const result = await this.commuteService.queryCommuteItem(commuteItem).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    if (result.length > 0) {
      return true;
    }
    return false;
  }

  @ApiOperation({summary: '预约拼车出行'})
  @UseGuards(JwtAuthGuard)
  @Post('booking')
  async bookingCommute(@Body() commuteInfo: CommuteItemCreateDto): Promise<string> {
    await this.commuteService.addCommuteItem(commuteInfo).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '预约拼车出行成功';
  }

  @ApiOperation({summary: '取消预约拼车出行'})
  @UseGuards(JwtAuthGuard)
  @Post('cnacelBooking')
  async cnacelBookingCommute(@Body() commuteInfo: CommuteItemDto): Promise<string> {
    await this.commuteService.deleteCommuteItem(commuteInfo).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return '取消拼车出行成功';
  }

  @ApiOperation({summary: '查询预约出行的拼车信息'})
  @UseGuards(JwtAuthGuard)
  @Post('item')
  async queryItemList(@Body() commuteItem: CommuteItemQueryDto): Promise<Array<CommuteItemEntity>> {
    const pageData = await this.commuteService.queryItemList(commuteItem).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return pageData
  }

  @ApiOperation({summary: '统计个人出行的已发布、已拼车、总出行次数'})
  @UseGuards(JwtAuthGuard)
  @Post('stats')
  async queryPersonStats(@Body() commuteItem: CommuteStatsDto): Promise<{
    publish: number,
    ping: number,
    travel: number
  }> {
    const pageData = await this.commuteService.queryStats(commuteItem).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return pageData
  }

  @ApiOperation({summary: '分页查询我的发布类型和拼车类型的出行列表'})
  @UseGuards(JwtAuthGuard)
  @Post('mineList')
  async queryAllTypeCommuteList(@Body() commutePage: CommuteItemSearchDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<CommuteEntity>
  }> {
    const pageData = await this.commuteService.getAllTypeCommuteList(commutePage).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(commutePage.pageSize) || 10,
      currentPage: Number(commutePage.currentPage) || 1,
      list: pageData
    }
  }
}
