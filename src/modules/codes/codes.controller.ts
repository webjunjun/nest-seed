import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterCodeEntity } from 'src/entity/register-code.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CodesService } from './codes.service';
import { CodesQueryDto } from './dto/codes-query.dto';

@ApiTags('内部注册码')
@Controller('code')
export class CodesController {
  constructor (
    private readonly codesService: CodesService
  ) {}

  @ApiOperation({summary: '批量生成注册码'})
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generateCode(@Body() codes: Array<string>): Promise<string> {
    const codesArray = codes;
    if (!codesArray) {
      throw new HttpException('参数不能为空', HttpStatus.BAD_REQUEST);
    }
    if (codesArray instanceof Array) {
      const allCodes = codesArray.map(item => ({ code: item }))
      await this.codesService.generateCode(allCodes);
    } else {
      throw new HttpException('数据格式不对', HttpStatus.BAD_REQUEST);
    }
    return '插入成功';
  }

  @ApiOperation({summary: '查询注册码列表'})
  @UseGuards(JwtAuthGuard)
  @Post('list')
  async queryCodeList(@Body() codesObj: CodesQueryDto): Promise<{
    pageSize: number,
    currentPage: number
    list: Array<RegisterCodeEntity>
  }> {
    const pageData = await this.codesService.queryList(codesObj).catch((e) => {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    });
    return {
      pageSize: Number(codesObj.pageSize) || 10,
      currentPage: Number(codesObj.currentPage) || 1,
      list: pageData
    }
  }
}
