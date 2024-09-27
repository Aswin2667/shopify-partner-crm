import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SendInviteLinkDto } from './dto/invite-link.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { DateHelper } from '@org/utils';
@Injectable()
export class OrgMemberInvitationsService {
  async acceptInviteToken(token: string) {
    try {
      // Delete the invitation based on the token and retrieve the invite details
      const inviteData = await prisma.orgMemberInvite.delete({
        where: {
          token: token,
        },
      });
      console.log(inviteData)
      const user = await prisma.user.findUnique({
        where: {
          email: inviteData.email,   
      }});
      console.log(user)
      // Add the new member to the organization
      const newMember = await prisma.orgMember.create({
        data: {
          createdAt: DateHelper.getCurrentUnixTime(),
          updatedAt: DateHelper.getCurrentUnixTime(), // Assuming this is the current timestamp
          deletedAt: 0, // Assuming 0 indicates it's not deleted
          role: inviteData.role,
          userId: user.id, // Use the invitee's ID
          organizationId: inviteData.organizationId,
        },
      });
  
      return newMember;
    } catch (error) {
      console.error("Error accepting invite token:", error);
      throw new Error("Failed to accept the invitation."); // Throw error to handle it properly in the calling function
    }
  }
  
  constructor(@InjectQueue('events') private readonly eventQueue: Queue) {}

  async sendInviteLink(sendInviteLinkData: SendInviteLinkDto): Promise<void> {
    try {
      console.log('Send invite link to', sendInviteLinkData);
      const upsertPromises = await sendInviteLinkData.emails.map(
        async (email) => {
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
          });
          const actionUrl = `http://localhost:3000/invite?token=${token}&orgId=${sendInviteLinkData.organizationId}`;
          const updatedData = {
            ...sendInviteLinkData,
            emails: email,
            action_url: actionUrl,
          };
          this.eventQueue.add('ORGANIZATION_MEMBER_INVITATION', updatedData);
        },
      );

      console.log(upsertPromises);
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
      const invitation =  await prisma.orgMemberInvite.findFirst({
        where: {
          token: token,
        },
        include:{
           inviter: true,
           organization: true
        }
      })
      return invitation
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'An error occurred while verifying the token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMemberByOrgId(orgId: string) {
    return await prisma.orgMember.findMany({
      where: {
        organizationId: orgId,
      },include:{
        user: true
      }
    });
  }
  async getPendingInvitationByOrgId(orgId: string) {
    return await prisma.orgMemberInvite.findMany({
      where: {
        organizationId: orgId,
      },
    });
  }
}
