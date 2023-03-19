import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class HaircutDeleteDto {

  @ApiProperty({description: '理发下单ID'})
  @IsNotEmpty({message: '理发下单ID不能为空'})
  readonly id: number;
}