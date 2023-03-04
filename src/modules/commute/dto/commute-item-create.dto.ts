import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommuteItemCreateDto {

  @ApiProperty({description: '出行ID'})
  @IsNotEmpty({message: '出行ID不能为空'})
  readonly commuteId: number;

  @ApiProperty({description: '出行人ID'})
  @IsNotEmpty({message: '出行人ID不能为空'})
  readonly travelerId: string;

  @ApiProperty({description: '出行人'})
  @IsNotEmpty({message: '出行人不能为空'})
  readonly traveler: string;

  @ApiProperty({description: '出行类型'})
  @IsNotEmpty({message: '出行类型不能为空'})
  readonly type: string;

  @ApiProperty({description: '出行时间'})
  @IsNotEmpty({message: '出行时间不能为空'})
  readonly commuteDate: Date;
}