import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DinerItemDeleteDto {
  @ApiProperty({description: '就餐明细ID'})
  @IsNotEmpty({message: '就餐明细ID不能为空'})
  readonly id: number;
}