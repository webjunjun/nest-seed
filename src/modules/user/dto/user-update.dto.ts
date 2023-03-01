import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, MaxLength, MinLength } from "class-validator";

export class UserUpdateDto {
  @ApiProperty({description: '用户ID'})
  @IsNotEmpty({message: '用户ID不能为空'})
  readonly id: string;

  @ApiProperty({description: '真实姓名'})
  @MaxLength(16, {message: '真实姓名不能多于16个字'})
  @MinLength(2, {message: '真实姓名不能少于2个字'})
  @IsNotEmpty({message: '真实姓名不能为空'})
  readonly realName: string;

  @ApiProperty({description: '手机号码'})
  @Length(11, 11, {message: '手机号码是11位数字'})
  readonly phone: string;

  @ApiProperty({description: '头像'})
  @IsNotEmpty({message: '用户头像不能为空'})
  readonly avatar: string;

  @ApiProperty({description: '车牌号'})
  readonly licensePlate: string;

  @ApiProperty({description: '个人简介'})
  readonly brief: string;

  @ApiProperty({description: '更新人ID'})
  @IsNotEmpty({message: '更新人ID不能为空'})
  readonly updateId: string;

  @ApiProperty({description: '更新人名字'})
  @IsNotEmpty({message: '更新人名字不能为空'})
  readonly updateName: string;
}