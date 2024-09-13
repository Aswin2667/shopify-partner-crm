import { IsString, IsObject, IsOptional, ValidateNested, IsDefined, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

class ActorDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  type: string;  
}

class MetadataDto {
  @IsString()
  eventSource: string;  

  @IsString()
  version: string;  

  @IsString()
  @IsOptional()
  priority?: string;  
}

export class EventDto {
  @IsString()
  eventType: string;  

  @IsString()
  eventId: string;  
  @IsISO8601()
  timestamp: string;  

  @ValidateNested()
  @Type(() => ActorDto)
  @IsOptional()
  actor?: ActorDto; 

  @IsObject()
  @IsDefined()
  payload: any;  

  @ValidateNested()
  @Type(() => MetadataDto)
  metadata: MetadataDto;
}
