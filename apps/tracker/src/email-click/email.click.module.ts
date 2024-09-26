import { Module } from '@nestjs/common';
import { ClickController } from './email.click.controller';
import { EmailClickService } from './email.click.service';


@Module({
  controllers: [ClickController],
  providers: [EmailClickService],
})
export class EmailClickModule {}
