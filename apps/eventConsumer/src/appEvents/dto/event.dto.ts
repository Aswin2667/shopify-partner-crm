import { IsString, IsArray, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ShopDto {
  @IsString()
  id: string;

  @IsString()
  myshopifyDomain: string;
}

class EventDto {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => ShopDto)
  shop: ShopDto;

  @IsDateString()
  occurredAt: string;
}

class AppDto {
  @IsString()
  appId: string;

  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsString()
  integrationId: string;

  @IsString()
  organizationId: string;
}

export class AppInstallsUninstallsEventsDto {
  @ValidateNested()
  @Type(() => AppDto)
  app: AppDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventDto)
  events: EventDto[];
}
