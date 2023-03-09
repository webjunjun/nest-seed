import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerAddDto {
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

  @ApiProperty({description: '创建人ID'})
  @IsNotEmpty({message: '创建人ID不能为空'})
  readonly createdId: string;

  @ApiProperty({description: '创建人名字'})
  @IsNotEmpty({message: '创建人名字不能为空'})
  readonly createdName: string;
}