import { ApiProperty } from "@nestjs/swagger";

export class VisitorDinerSearchDto {
  @ApiProperty({description: '就餐时间'})
  readonly dinerDate: Date;

  @ApiProperty({description: '就餐时间'})
  readonly dinerDateStart: Date;

  @ApiProperty({description: '就餐时间'})
  readonly dinerDateEnd: Date;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}