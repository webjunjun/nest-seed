import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SingleCreateDto {
  @ApiProperty({description: '标题'})
  @IsNotEmpty({message: '标题不能为空'})
  readonly title: string;

  @ApiProperty({description: '简述'})
  @IsNotEmpty({message: '简述不能为空'})
  readonly description: string;

  @ApiProperty({description: '类型'})
  @IsNotEmpty({message: '类型不能为空'})
  readonly type: number;

  @ApiProperty({description: '内容'})
  @IsNotEmpty({message: '内容不能为空'})
  readonly content: string;

  @ApiProperty({description: '创建人ID'})
  @IsNotEmpty({message: '创建人ID不能为空'})
  readonly createdId: string;

  @ApiProperty({description: '创建人名字'})
  @IsNotEmpty({message: '创建人名字不能为空'})
  readonly createdName: string;
}