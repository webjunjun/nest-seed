import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommuteItemDto {

  @ApiProperty({description: '出行ID'})
  @IsNotEmpty({message: '出行ID不能为空'})
  readonly commuteId: number;

  @ApiProperty({description: '出行人ID'})
  @IsNotEmpty({message: '出行人ID不能为空'})
  readonly travelerId: string;
}