import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VisitorDinerCreateDto {

  @ApiProperty({description: '预约人ID'})
  @IsNotEmpty({message: '预约人ID不能为空'})
  readonly bookerId: string;

  @ApiProperty({description: '预约人名字'})
  @IsNotEmpty({message: '预约人不能为空'})
  readonly bookerName: string;

  @ApiProperty({description: '就餐人数'})
  @IsNotEmpty({message: '就餐人数不能为空'})
  readonly dinerNum: number;

  @ApiProperty({description: '就餐时间'})
  @IsNotEmpty({message: '就餐时间不能为空'})
  readonly dinerDate: Date;

  @ApiProperty({description: '来客单位'})
  @IsNotEmpty({message: '来客单位不能为空'})
  readonly visitorCompany: string;

  @ApiProperty({description: '来客级别'})
  @IsNotEmpty({message: '来客级别不能为空'})
  readonly visitorLevel: string;

  @ApiProperty({description: '备注'})
  @IsNotEmpty({message: '备注不能为空'})
  readonly remark: string;

  @ApiProperty({description: '创建人ID'})
  @IsNotEmpty({message: '创建人ID不能为空'})
  readonly createdId: string;

  @ApiProperty({description: '创建人名字'})
  @IsNotEmpty({message: '创建人名字不能为空'})
  readonly createdName: string;
}