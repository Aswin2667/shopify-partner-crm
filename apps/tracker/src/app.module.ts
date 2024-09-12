import { Module } from '@nestjs/common';
import { EmailOpenModule } from './email-open/email.open.module';
import { EmailClickModule } from './email-click/email.click.module';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [EmailOpenModule, EmailClickModule],
})
export class AppModule {}