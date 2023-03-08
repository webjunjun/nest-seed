import { Injectable } from '@nestjs/common';

@Injectable()
export class DinerItemService {
  getHello(): string {
    return 'Hello World!';
  }
}
