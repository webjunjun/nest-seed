import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerAddDto {
  @ApiProperty({description: '就餐日期'})
  @IsNotEmpty({message: '就餐日期不能为空'})
  readonly eatDate: string;

  @ApiProperty({description: '早餐开始时间'})
  @IsNotEmpty({message: '早餐开始时间不能为空'})
  readonly morningStart: string;

  @ApiProperty({description: '早餐结束时间'})
  @IsNotEmpty({message: '早餐结束时间不能为空'})
  readonly morningEnd: string;

  @ApiProperty({description: '午餐开始时间'})
  @IsNotEmpty({message: '午餐开始不能为空'})
  readonly middayStart: string;

  @ApiProperty({description: '午餐结束时间'})
  @IsNotEmpty({message: '午餐结束时间不能为空'})
  readonly middayEnd: string;

  @ApiProperty({description: '晚餐开始时间'})
  @IsNotEmpty({message: '晚餐开始时间不能为空'})
  readonly eveningStart: string;

  @ApiProperty({description: '晚餐结束时间'})
  @IsNotEmpty({message: '晚餐结束时间不能为空'})
  readonly eveningEnd: string;

  @ApiProperty({description: '就餐类型'})
  @IsNotEmpty({message: '就餐类型不能为空'})
  readonly type: string;

  @ApiProperty({description: '预约开始时间'})
  @IsNotEmpty({message: '预约开始时间不能为空'})
  readonly bookingStart: string;

  @ApiProperty({description: '预约结束时间'})
  @IsNotEmpty({message: '预约结束时间不能为空'})
  readonly bookingEnd: string;

  @ApiProperty({description: '创建人ID'})
  @IsNotEmpty({message: '创建人ID不能为空'})
  readonly createdId: string;

  @ApiProperty({description: '创建人名字'})
  @IsNotEmpty({message: '创建人名字不能为空'})
  readonly createdName: string;
}