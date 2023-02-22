import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CodesService } from './codes.service';

@ApiTags('内部注册码')
@Controller('code')
export class CodesController {
  constructor (
    private readonly codesService: CodesService
  ) {}

  @ApiOperation({summary: '批量生成注册码'})
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
}
