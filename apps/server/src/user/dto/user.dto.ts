import { IsString, IsEnum, IsOptional, IsEmail } from 'class-validator';
enum UserAuthenticationMethod {
  GOOGLE = 'GOOGLE',
  MAGIC_LINK = 'MAGIC_LINK',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['GOOGLE', 'MAGIC_LINK'])
  authenticationMethod: UserAuthenticationMethod;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class UpdateUserDto extends CreateUserDto {}
