import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HelloService } from './hello.service';

@ApiTags('测试示例')
@Controller()
export class HelloController {
  constructor (private readonly helloService: HelloService) {}

  @ApiOperation({summary: '你好，世界'})
  @Get()
  getHello(): string {
    return this.helloService.getHello();
  }
}
