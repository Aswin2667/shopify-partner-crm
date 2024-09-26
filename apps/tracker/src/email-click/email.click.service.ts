import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmailClickService {
  private readonly logger = new Logger(EmailClickService.name);

  async logClick(userIp: string) {
    try {
      console.log("Click logged from IP:", userIp);
      this.logger.log('Click logged');
    } catch (error) {
      this.logger.error('Error logging click:', error);
    }
  }
}
