import { ApiProperty } from "@nestjs/swagger";

export class UserQueryDto {
  @ApiProperty({description: '用户ID'})
  readonly id: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}