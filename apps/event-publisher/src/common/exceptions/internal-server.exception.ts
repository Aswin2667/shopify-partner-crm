import { InternalServerErrorException } from '@nestjs/common';

export class InternalServerException extends InternalServerErrorException {
  constructor(message?: string) {
    super(message || 'An unexpected error occurred');
  }
}
