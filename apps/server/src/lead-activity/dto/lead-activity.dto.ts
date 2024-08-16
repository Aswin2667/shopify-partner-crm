import { IsNotEmpty, IsUUID, IsEnum, IsOptional, IsJSON } from 'class-validator';
import { LeadActivityType } from '@prisma/client';

export class CreateLeadActivityDto {
  @IsUUID()
  @IsNotEmpty()
  leadId: string;

  @IsEnum(LeadActivityType)
  @IsNotEmpty()
  type: LeadActivityType;

  @IsJSON()
  @IsNotEmpty()
  data: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
