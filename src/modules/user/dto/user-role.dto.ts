import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserRoleDto {
  @ApiProperty({description: '用户ID'})
  @IsNotEmpty({message: '用户ID不能为空'})
  readonly id: string;

  @ApiProperty({description: '角色ID'})
  @IsNotEmpty({message: '角色ID不能为空'})
  readonly role: number;

  @ApiProperty({description: '角色名'})
  @IsNotEmpty({message: '角色名不能为空'})
  readonly roleName: string;

  @ApiProperty({description: '更新人ID'})
  @IsNotEmpty({message: '更新人ID不能为空'})
  readonly updateId: string;

  @ApiProperty({description: '更新人名字'})
  @IsNotEmpty({message: '更新人名字不能为空'})
  readonly updateName: string;
}