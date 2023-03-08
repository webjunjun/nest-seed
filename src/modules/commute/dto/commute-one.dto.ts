import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CommuteOneDto {

  @ApiProperty({description: '出行ID'})
  @IsNotEmpty({message: '出行ID不能为空'})
  readonly commuteId: number;
}