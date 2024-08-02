import { Module } from '@nestjs/common';
import { OrgMemberService } from './org-member.service';
import { OrgMemberController } from './org-member.controller';

@Module({
  controllers: [OrgMemberController],
  providers: [OrgMemberService],
})
export class OrgMemberModule {}
