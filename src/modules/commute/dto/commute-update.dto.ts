import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommuteUpdateDto {
  @ApiProperty({description: '出行ID'})
  @IsNotEmpty({message: '出行ID不能为空'})
  readonly id: number;

  @ApiProperty({description: '车牌号'})
  @IsNotEmpty({message: '车牌号不能为空'})
  readonly licensePlate: string;

  @ApiProperty({description: '开始地点'})
  @IsNotEmpty({message: '开始地点不能为空'})
  readonly startAddr: string;

  @ApiProperty({description: '结束地点'})
  @IsNotEmpty({message: '结束地点不能为空'})
  readonly endAddr: string;

  @ApiProperty({description: '途径地点'})
  @IsNotEmpty({message: '途径地点不能为空'})
  readonly passAddr: Array<string>;

  @ApiProperty({description: '座位'})
  @IsNotEmpty({message: '座位不能为空'})
  readonly seat: number;

  @ApiProperty({description: '剩余座位'})
  @IsNotEmpty({message: '剩余座位不能为空'})
  readonly restSeat: number;

  @ApiProperty({description: '出行时间'})
  @IsNotEmpty({message: '出行时间不能为空'})
  readonly commuteDate: Date;

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