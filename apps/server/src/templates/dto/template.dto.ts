import { IsString, IsEnum } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  html: string;

  @IsString()
  userId: string;

  @IsEnum(['ADMIN_ONLY', 'MEMBER'])
  scope: string;
  name: any;
  orgId: any;
}

export class UpdateTemplateDto {
  @IsString()
  html: string;
}
