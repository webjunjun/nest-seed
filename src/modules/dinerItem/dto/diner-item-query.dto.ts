import { ApiProperty } from "@nestjs/swagger";

export class DinerItemQueryDto {
  @ApiProperty({description: '就餐明细ID'})
  readonly id: number;

  @ApiProperty({description: '就餐预约ID'})
  readonly dinerId: number;

  @ApiProperty({description: '就餐人ID'})
  readonly eaterId: string;

  @ApiProperty({description: '就餐人'})
  readonly eater: string;

  @ApiProperty({description: '类型'})
  readonly type: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}