import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserDeleteDto {
  @ApiProperty({description: '用户ID'})
  @IsNotEmpty({message: '用户ID不能为空'})
  readonly id: string;
}