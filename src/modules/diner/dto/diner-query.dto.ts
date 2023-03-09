import { ApiProperty } from "@nestjs/swagger";

export class DinerQueryDto {
  @ApiProperty({description: '就餐预约ID'})
  readonly id: number;

  @ApiProperty({description: '就餐日期'})
  readonly eatDate: Date;

  @ApiProperty({description: '就餐时间段'})
  readonly eatTime: string;

  @ApiProperty({description: '就餐类型'})
  readonly eatType: string;

  @ApiProperty({description: '可预约时间段'})
  readonly bookingDate: string;

  @ApiProperty({description: '类型'})
  readonly type: string;

  @ApiProperty({description: '创建人名字'})
  readonly createdName: string;

  @ApiProperty({description: '修改人名字'})
  readonly updateName: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}