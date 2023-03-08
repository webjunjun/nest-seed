import { Injectable } from '@nestjs/common';

@Injectable()
export class DinerService {
  getHello(): string {
    return 'Hello World!';
  }
}
