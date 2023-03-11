import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerEditDto {
  @ApiProperty({description: '就餐预约ID'})
  @IsNotEmpty({message: '就餐预约ID不能为空'})
  readonly id: number;

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
  @IsNotEmpty({message: '类型不能为空'})
  readonly bookingEnd: string;

  @ApiProperty({description: '最后修改时间'})
  @IsNotEmpty({message: '最后修改时间不能为空'})
  readonly lastModify: Date;

  @ApiProperty({description: '更新人ID'})
  @IsNotEmpty({message: '更新人ID不能为空'})
  readonly updateId: string;

  @ApiProperty({description: '更新人名字'})
  @IsNotEmpty({message: '更新人名字不能为空'})
  readonly updateName: string;
}