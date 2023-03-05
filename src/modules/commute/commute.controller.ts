import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommuteEntity } from 'src/entity/commute.entity';
import { ModifyUserLicensePlate } from 'src/type/nestSeed';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CommuteService } from './commute.service';
import { CommuteCreateDto } from './dto/commute-create.dto';
import { CommuteItemCreateDto } from './dto/commute-item-create.dto';
import { CommuteSearchDto } from './dto/commute-search.dto';
import { CommuteUpdateDto } from './dto/commute-update.dto';

@ApiTags('出行')
@Controller('commute')
export class CommuteController {
  constructor (
    private readonly commuteService: CommuteService,
    private readonly userService: UserService
  ) {}

  @ApiOperation({summary: '分页查询出行'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryCommuteList(@Body() commutePage: CommuteSearchDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<CommuteEntity>
  }> {
    const pageData = await this.commuteService.getCommuteList(commutePage);
    return {
      pageSize: Number(commutePage.pageSize) || 10,
      currentPage: Number(commutePage.currentPage) || 1,
      list: pageData
    }
  }

  @ApiOperation({summary: '查询单条出行记录'})
  @UseGuards(JwtAuthGuard)
  @Post('one')
  async queryCommuteOne(@Body() commuteInfo: {
    commuteId: number
  }): Promise<CommuteEntity> {
    if (!commuteInfo.commuteId) {
      throw new HttpException('出行ID不能为空', HttpStatus.BAD_REQUEST);
    }
    return await this.commuteService.getCommuteById(commuteInfo.commuteId);
  }

  @ApiOperation({summary: '发布出行'})
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCommute(@Body() commuteObject: CommuteCreateDto): Promise<string> {
    const commuteInfo = await this.commuteService.publishCommuteOne(commuteObject).catch(() => {
      throw new HttpException('发布出行失败', HttpStatus.BAD_REQUEST);
    });
    if (commuteInfo.generatedMaps.length > 0) {
      if (commuteObject.modifyUserInfo) {
        const userData: ModifyUserLicensePlate = {
          userId: commuteObject.createdId,
          licensePlate: commuteObject.licensePlate,
          updateId: commuteObject.createdId,
          updateName: commuteObject.createdName
        }
        await this.userService.updateLicensePlateById(userData).catch(async () => {
          await this.commuteService.deleteCommuteOne(commuteInfo.generatedMaps[0].id);
          throw new HttpException('发布出行失败', HttpStatus.BAD_REQUEST);
        });
      }
      await this.commuteService.addCommuteItem({
        commuteId: commuteInfo.generatedMaps[0].id,
        travelerId: commuteObject.createdId,
        traveler: commuteObject.createdName,
        type: '发布',
        commuteDate: new Date()
      }).catch(async () => {
        await this.commuteService.deleteCommuteOne(commuteInfo.generatedMaps[0].id);
        throw new HttpException('发布出行失败', HttpStatus.BAD_REQUEST);
      });
    }
    return '发布出行成功';
  }

  @ApiOperation({summary: '编辑出行'})
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateCommute(@Body() commuteObject: CommuteUpdateDto): Promise<string> {
    await this.commuteService.modifyhCommuteOne(commuteObject).catch(() => {
      throw new HttpException('修改出行失败', HttpStatus.BAD_REQUEST);
    });
    return '修改出行成功';
  }

  @ApiOperation({summary: '删除出行'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteCommute(@Body()  commuteInfo: {
    commuteId: number
  }): Promise<string> {
    await this.commuteService.deleteCommuteOne(commuteInfo.commuteId).catch(() => {
      throw new HttpException('删除出行失败', HttpStatus.BAD_REQUEST);
    });
    return '删除出行成功';
  }

  @ApiOperation({summary: '查询是否预约拼车'})
  @UseGuards(JwtAuthGuard)
  @Post('resultBooking')
  async resultBooking(@Body() commuteItem: {commuteId: number, travelerId: string}): Promise<Boolean> {
    const result = await this.commuteService.queryCommuteItem(commuteItem).catch(() => {
      throw new HttpException('查询预约拼车记录失败', HttpStatus.BAD_REQUEST);
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
    await this.commuteService.addCommuteItem(commuteInfo).catch(() => {
      throw new HttpException('预约拼车出行失败', HttpStatus.BAD_REQUEST);
    });
    return '预约拼车出行成功';
  }

  @ApiOperation({summary: '取消预约拼车出行'})
  @UseGuards(JwtAuthGuard)
  @Post('cnacelBooking')
  async cnacelBookingCommute(@Body() commuteInfo: {
    commuteId: number,
    travelerId: string
  }): Promise<string> {
    await this.commuteService.deleteCommuteItem(commuteInfo).catch(() => {
      throw new HttpException('取消拼车出行失败', HttpStatus.BAD_REQUEST);
    });
    return '取消拼车出行成功';
  }
}
