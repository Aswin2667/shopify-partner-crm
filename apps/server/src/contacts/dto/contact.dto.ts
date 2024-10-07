import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  secondaryEmail?: string;

  @IsOptional()
  @IsString()
  primaryPhNo?: string;

  @IsOptional()
  @IsString()
  secondaryPhNo?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsUUID()
  leadId?: string;
  integrationId: any;

  @IsOptional()
  @IsUUID()
  organizationId?: string;
  title: any;
  salutation: any;
}

export class UpdateContactDto extends CreateContactDto {
  @IsUUID()
  id: string;
}
