import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendInviteLinkDto } from './dto/invite-link.dto';

@Injectable()
export class OrgMemberInvitationsService {
  async sendInviteLink(sendInviteLinkDto: SendInviteLinkDto): Promise<void> {
    try {
      console.log('Send invite link to', sendInviteLinkDto);
    } catch (error) {
      throw new HttpException(
        'An error occurred while sending the invite link.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyInviteToken(token: string): Promise<any> {
    try {
      console.log('Verify token', token);
      return {
        id: 'ck2j49r2a0d1m0741gzhjo41v',
        name: 'John Doe',
        email: 'example@gmail.com',
        authenticationMethod: 'MAGIC_LINK',
        createdAt: 872748344,
        deletedAt: null,
      };
    } catch (error) {
      throw new HttpException(
        'An error occurred while verifying the token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
