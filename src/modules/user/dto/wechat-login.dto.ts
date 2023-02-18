import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class WechatLoginDto {

  @ApiProperty({description: '微信授权码'})
  @IsNotEmpty({message: '微信授权码不能为空'})
  readonly code: string;
}