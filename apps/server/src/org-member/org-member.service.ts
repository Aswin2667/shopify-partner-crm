import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@org/data-source';

@Injectable()
export class OrgMemberService {
  private readonly logger = new Logger(OrgMemberService.name);
  constructor(private readonly prisma: PrismaService) {}
  private members = [{ id: 'ck2j49r2a0d1m0741gzhjo41v', role: 'MEMBER' }];

  async updateRole(memberId: string, role: string) {
    const member = this.members.find((m) => m.id === memberId);
    if (!member) {
      throw new NotFoundException('Member not found.');
    }

    if (!['ADMIN', 'MEMBER'].includes(role)) {
      throw new BadRequestException(
        'Invalid data for role update. Please check the provided data.',
      );
    }

    member.role = role;
    return member;
  }

  async deleteMember(memberId: string) {
    const memberIndex = this.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException('Member not found.');
    }

    this.members.splice(memberIndex, 1);
  }

  async generateSignature(memberId: string, signature: string) {
    const member = await this.prisma.orgMember.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException(`Member not found with id ${memberId}.`);
    }

    const orgMemberWithSignature = await this.prisma.orgMember.update({
      where: {
        id: memberId,
      },
      data: {
        signature,
      },
    });

    return orgMemberWithSignature;
  }
}
