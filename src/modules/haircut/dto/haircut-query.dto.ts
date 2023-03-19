import { ApiProperty } from "@nestjs/swagger";

export class HaircutQueryDto {
  @ApiProperty({description: '理发下单ID'})
  readonly id: number;

  @ApiProperty({description: '预约理发人ID'})
  readonly haircutId: string;

  @ApiProperty({description: '预约理发人'})
  readonly haircutName: string;

  @ApiProperty({description: '本周理发开始日期'})
  readonly haircutStart: Date;

  @ApiProperty({description: '本周理发结束日期'})
  readonly haircutEnd: Date;

  @ApiProperty({description: '创建时间'})
  readonly created: Date;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}