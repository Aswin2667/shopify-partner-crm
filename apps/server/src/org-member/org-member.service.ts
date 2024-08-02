import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class OrgMemberService {
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
}
