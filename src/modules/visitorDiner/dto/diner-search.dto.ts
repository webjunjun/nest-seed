import { ApiProperty } from "@nestjs/swagger";

export class VisitorDinerSearchDto {
  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}