import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SingleDeleteDto {

  @ApiProperty({description: '页面ID'})
  @IsNotEmpty({message: '页面ID不能为空'})
  readonly id: string;
}