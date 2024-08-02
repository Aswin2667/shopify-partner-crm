import { Module } from '@nestjs/common';
import { OrgMemberInvitationsService } from './org-member-invitations.service';
import { OrgMemberInvitationsController } from './org-member-invitations.controller';

@Module({
  controllers: [OrgMemberInvitationsController],
  providers: [OrgMemberInvitationsService],
})
export class OrgMemberInvitationsModule {}
