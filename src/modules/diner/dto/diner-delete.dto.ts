import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerDeleteDto {
  @ApiProperty({description: '就餐预约ID'})
  @IsNotEmpty({message: '就餐预约ID不能为空'})
  readonly id: number;
}