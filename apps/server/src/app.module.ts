import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { MagicLinkService } from './magic-link/magic-link.service';
import { MagicLinkController } from './magic-link/magic-link.controller';
import { OrganizationService } from './organization/organization.service';
import { OrganizationController } from './organization/organization.controller';
import { OrgMemberInvitationsController } from './member-invitaions/org-member-invitations.controller';
import { OrgMemberInvitationsService } from './member-invitaions/org-member-invitations.service';
import { OrgMemberController } from './org-member/org-member.controller';
import { OrgMemberService } from './org-member/org-member.service';
import { AuthMiddleware } from './auth/auth.middleware';
import { TemplateController } from './templates/template.controller';
import { TemplateService } from './templates/template.service';

@Module({
  imports: [UserModule],
  controllers: [
    UserController,
    MagicLinkController,
    OrganizationController,
    OrgMemberInvitationsController,
    OrgMemberController,
    TemplateController
  ],
  providers: [
    UserService,
    MagicLinkService,
    OrganizationService,
    OrgMemberInvitationsService,
    OrgMemberService,
    TemplateService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}