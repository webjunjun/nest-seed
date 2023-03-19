import { ApiProperty } from "@nestjs/swagger";

export class CommuteSearchDto {

  @ApiProperty({description: '开始地点'})
  readonly startAddr: string;

  @ApiProperty({description: '结束地点'})
  readonly endAddr: string;

  @ApiProperty({description: '途径地点'})
  readonly passAddr: Array<string>;

  @ApiProperty({description: '出行时间'})
  readonly commuteDate: Date;

  @ApiProperty({description: '出行人ID'})
  readonly createdId: string;

  @ApiProperty({description: '出行人名字'})
  readonly createdName: string;

  @ApiProperty({description: '是否出行'})
  readonly commuteType: string;

  @ApiProperty({description: '每页查询个数'})
  readonly pageSize: number;

  @ApiProperty({description: '页码'})
  readonly currentPage: number;
}