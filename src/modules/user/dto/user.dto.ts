import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UserDto {

  @ApiProperty({description: '用户名'})
  @IsNotEmpty({message: '用户名不能为空'})
  readonly username: string;

  // 注意顺序 最先校验是否空，再是长度不够，再是过长
  @ApiProperty({description: '密码'})
  @MaxLength(18, {message: '密码长度最大为18位'})
  @MinLength(8, {message: '密码长度应不小于8位'})
  @IsNotEmpty({message: '密码不能为空'})
  readonly password: string;
}
