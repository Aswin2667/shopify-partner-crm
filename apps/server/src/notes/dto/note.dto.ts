import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadNoteDto {
  @IsString()
  @IsNotEmpty()
  leadId: string;

  @IsString()
  @IsNotEmpty()
  data: string;
  userId: any;
}
export class UpdateLeadNoteDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    data?: string;
  }