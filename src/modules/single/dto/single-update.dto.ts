import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SingleUpdateDto {
  @ApiProperty({description: '页面ID'})
  @IsNotEmpty({message: '页面ID不能为空'})
  readonly id: number;

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

  @ApiProperty({description: '最后修改时间'})
  @IsNotEmpty({message: '修改时间不能为空'})
  readonly lastModify: string;

  @ApiProperty({description: '更新人ID'})
  @IsNotEmpty({message: '更新人ID不能为空'})
  readonly updateId: string;

  @ApiProperty({description: '更新人名字'})
  @IsNotEmpty({message: '更新人名字不能为空'})
  readonly updateName: string;
}