import { IsEmail, IsString } from 'class-validator';

export class SendMagicLinkDto {
  @IsEmail(
    {},
    { message: 'Invalid email address. Please check the provided email.' },
  )
  email: string;
}

export class VerifyMagicTokenDto {
  @IsString({ message: 'Token must be a string.' })
  token: string;
}
