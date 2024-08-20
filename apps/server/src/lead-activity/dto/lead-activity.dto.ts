import {
  IsNotEmpty,
  IsUUID,
  IsEnum,
  IsOptional,
  IsJSON,
} from 'class-validator';

export enum LeadActivityType {
  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_UPDATED = 'LEAD_UPDATED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  NOTE_DELETED = 'NOTE_DELETED',
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  TASK = 'TASK',
  MEETING = 'MEETING',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

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
