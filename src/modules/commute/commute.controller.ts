import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommuteEntity } from 'src/entity/commute.entity';
import { ModifyUserLicensePlate } from 'src/type/nestSeed';
import { SelectQueryBuilder } from 'typeorm';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { CommuteService } from './commute.service';
import { CommuteCreateDto } from './dto/commute-create.dto';
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
  async queryCommuteOne(@Body() commuteId: number): Promise<CommuteEntity> {
    return await this.commuteService.getCommuteById(commuteId);
  }

  @ApiOperation({summary: '发布出行'})
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createCommute(@Body() commuteObject: CommuteCreateDto): Promise<string> {
    const commuteInfo = await this.commuteService.publishCommuteOne(commuteObject).catch(() => {
      throw new HttpException('发布出行失败', HttpStatus.BAD_REQUEST);
    });
    if (commuteInfo.generatedMaps.length > 0) {
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
    await this.commuteService.modifyhCommuteOne(commuteObject);
    return '修改出行成功'
  }

  @ApiOperation({summary: '删除出行'})
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteCommute(@Body() commuteId: number): Promise<string> {
    await this.commuteService.deleteCommuteOne(commuteId);
    return '删除出行成功'
  }
}
