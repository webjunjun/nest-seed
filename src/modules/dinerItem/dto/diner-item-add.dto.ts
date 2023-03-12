import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerItemAddDto {
  @ApiProperty({description: '就餐明细ID'})
  readonly id: number;

  @ApiProperty({description: '就餐预约ID'})
  @IsNotEmpty({message: '就餐预约ID不能为空'})
  readonly dinerId: number;

  @ApiProperty({description: '就餐日期'})
  @IsNotEmpty({message: '就餐日期不能为空'})
  readonly dinerDate: string;

  @ApiProperty({description: '是否早餐'})
  readonly morning: number;

  @ApiProperty({description: '是否中餐'})
  readonly midday: number;

  @ApiProperty({description: '是否晚餐'})
  readonly evening: number;

  @ApiProperty({description: '就餐人ID'})
  @IsNotEmpty({message: 'eaterId不能为空'})
  readonly eaterId: string;

  @ApiProperty({description: '就餐人'})
  @IsNotEmpty({message: '就餐人不能为空'})
  readonly eater: string;

  @ApiProperty({description: '类型'})
  @IsNotEmpty({message: '类型不能为空'})
  readonly type: string;
}