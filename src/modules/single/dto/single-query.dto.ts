import { ApiProperty } from "@nestjs/swagger";

export class SingleQueryDto {
  @ApiProperty({description: '页面ID'})
  readonly id: string;

  @ApiProperty({description: '类型'})
  readonly type: string;

  @ApiProperty({description: '标题'})
  readonly title: string;

  @ApiProperty({description: '创建人名字'})
  readonly createdName: string;

  @ApiProperty({description: '修改人名字'})
  readonly updateName: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}