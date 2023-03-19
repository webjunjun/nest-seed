import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class HaircutAddDto {

  @ApiProperty({description: '预约理发人ID'})
  @IsNotEmpty({message: '预约理发人ID不能为空'})
  readonly haircutId: string;

  @ApiProperty({description: '预约理发人'})
  @IsNotEmpty({message: '预约理发人不能为空'})
  readonly haircutName: string;

  @ApiProperty({description: '本周理发开始日期'})
  @IsNotEmpty({message: '本周理发开始日期不能为空'})
  readonly haircutStart: Date;

  @ApiProperty({description: '本周理发结束日期'})
  @IsNotEmpty({message: '本周理发结束日期不能为空'})
  readonly haircutEnd: Date;
}