import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(['ADMIN', 'MEMBER'])
  role: string;
}
