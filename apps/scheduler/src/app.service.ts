import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getHello() {
    BigInt.prototype['toJSON'] = function () {
      return this.toString();
    };
    return await this.prismaService.user.findMany();
  }
}
