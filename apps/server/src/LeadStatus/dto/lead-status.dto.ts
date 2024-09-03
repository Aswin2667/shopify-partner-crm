import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateLeadStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsArray()
  leadIds?: string[];
    organizationId: any;
}

export class UpdateLeadStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsArray()
  leadIds?: string[];
}
