import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerItemDeleteDto {
  @ApiProperty({description: '就餐明细ID'})
  @IsNotEmpty({message: '就餐明细ID不能为空'})
  readonly id: number;

  @ApiProperty({description: '是否早餐'})
  readonly morning: number;

  @ApiProperty({description: '是否中餐'})
  readonly midday: number;

  @ApiProperty({description: '是否晚餐'})
  readonly evening: number;
}