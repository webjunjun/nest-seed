import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerEditDto {
  @ApiProperty({description: '就餐预约ID'})
  @IsNotEmpty({message: '就餐预约ID不能为空'})
  readonly id: number;

  @ApiProperty({description: '就餐日期'})
  @IsNotEmpty({message: '就餐日期不能为空'})
  readonly eatDate: Date;

  @ApiProperty({description: '就餐时间段'})
  @IsNotEmpty({message: '就餐时间段不能为空'})
  readonly eatTime: string;

  @ApiProperty({description: '就餐类型'})
  @IsNotEmpty({message: '就餐类型不能为空'})
  readonly eatType: string;

  @ApiProperty({description: '可预约时间段'})
  @IsNotEmpty({message: '可预约时间段不能为空'})
  readonly bookingDate: string;

  @ApiProperty({description: '类型'})
  @IsNotEmpty({message: '类型不能为空'})
  readonly type: string;

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