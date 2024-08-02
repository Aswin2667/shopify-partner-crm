import { IsString, IsEnum } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsString()
  userId: string;

  @IsEnum(['ADMIN', 'MEMBER'])
  role: string;
}

export class UpdateOrganizationDto {
  @IsString()
  name: string;
}
