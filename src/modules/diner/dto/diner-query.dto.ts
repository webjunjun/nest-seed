import { ApiProperty } from "@nestjs/swagger";

export class DinerQueryDto {
  @ApiProperty({description: '就餐预约ID'})
  readonly id: number;

  @ApiProperty({description: '就餐日期'})
  readonly eatDate: Date;

  @ApiProperty({description: '就餐类型'})
  readonly type: string;

  @ApiProperty({description: '预约开始时间'})
  readonly bookingStart: Date;

  @ApiProperty({description: '预约结束时间'})
  readonly bookingEnd: Date;

  @ApiProperty({description: '创建人名字'})
  readonly createdName: string;

  @ApiProperty({description: '修改人名字'})
  readonly updateName: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}