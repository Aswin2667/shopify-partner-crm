import { IsString, IsEnum } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsEnum(['ADMIN', 'MEMBER'])
  role: string;
  description: any;
}

export class UpdateOrganizationDto {
  @IsString()
  name: string;
}

export class OrgMemberAdd {
  @IsString()
  userId: string;

  @IsString()
  organizationId: string;

  @IsEnum(['ADMIN', 'MEMBER'])
  role: string;
}
