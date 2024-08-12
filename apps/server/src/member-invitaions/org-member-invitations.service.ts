import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendInviteLinkDto } from './dto/invite-link.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { DateHelper } from '@org/utils';
@Injectable()
export class OrgMemberInvitationsService {

  constructor(
    @InjectQueue('events') private readonly eventQueue: Queue,
  ) {}
  
  async sendInviteLink(sendInviteLinkData: SendInviteLinkDto): Promise<void> {
    try {
      console.log('Send invite link to', sendInviteLinkData);
      const upsertPromises = await sendInviteLinkData.emails.map(async email => {
        const token = uuidv4();
       await prisma.orgMemberInvite.upsert({
          where: {
            organizationId_email: {
              organizationId: sendInviteLinkData.organizationId,
              email: email,
            },
          },
          update: {
            inviterId: sendInviteLinkData.invitedBy,
            role: 'MEMBER',
            updatedAt: DateHelper.getCurrentUnixTime(),
            token: token,
          },
          create: {
            inviterId: sendInviteLinkData.invitedBy,
            organizationId: sendInviteLinkData.organizationId,
            role: 'MEMBER',
            createdAt: DateHelper.getCurrentUnixTime(),
            token: token,
            deletedAt: 0,
            updatedAt: 0,
            email: email,
          },
        })
        const actionUrl = `http://localhost:3000/invite?token=${token}&orgId=${sendInviteLinkData.organizationId}`;
        const updatedData = {
          ...sendInviteLinkData,
          emails:email,
          action_url: actionUrl,
        };
         this.eventQueue.add('ORGANIZATION_MEMBER_INVITATION', updatedData);
      }
      );


      console.log(upsertPromises)
     
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'An error occurred while sending the invite link.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyInviteToken(token: string): Promise<any> {
    try {
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

  async getInvitationByOrgId(orgId:string){
    return await prisma.orgMemberInvite.findMany({
      where:{
        organizationId:orgId
      }
    })
  }
}
