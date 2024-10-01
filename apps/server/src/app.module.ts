import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { WinstonModule } from 'nest-winston';
import { MulterModule } from '@nestjs/platform-express';
import * as winston from 'winston';
import { S3Service } from './s3/s3.service';
import { S3Controller } from 's3.controller';
import { BullModule, BullQueueEvents } from '@nestjs/bull';
import { ProjectModule } from './project/project.module';
import * as path from 'path';
import { LeadController } from './leads/lead.controller';
import { LeadService } from './leads/lead.service';
import { PrismaService, } from '@org/data-source';
import { LeadActivityService } from './lead-activity/lead-activity.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { LeadActivityController } from './lead-activity/lead-activity.controller';
import { LeadNotesController } from './notes/notes.controller';
import { LeadNotesService } from './notes/notes.service';
import { ContactController } from './contacts/contact.controller';
import { ContactService } from './contacts/contact.service';
import { IntegrationModule } from './integration/integration.module';
import { Service } from './.service';
import { LeadStatusModule } from './LeadStatus/lead-status.module';
import { LeadStatusService } from './LeadStatus/lead-status.service';
import { UnsubscribeLinkModule } from './unsubscribe-link/unsubscribe-link.module';
import { UnsubscribeLinkService } from './unsubscribe-link/unsubscribe-link.service';
import { UnsubscribeLinkController } from './unsubscribe-link/unsubscribe-link.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: path.resolve(__dirname, '../../../../', '.env'),
      isGlobal: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6378,
      },
    }),
    BullModule.registerQueue({
      name: 'events',
    }),
    MailModule,
    ProjectModule,
    AuthModule,
    IntegrationModule,
    LeadStatusModule,
    UnsubscribeLinkModule,
  ],
  controllers: [
    UserController,
    MagicLinkController,
    OrganizationController,
    OrgMemberInvitationsController,
    OrgMemberController,
    TemplateController,
    S3Controller,
    // IntegrationsController,
    LeadController,
    LeadActivityController,
    LeadNotesController,
    ContactController,
    UnsubscribeLinkController
  ],
  providers: [
    UserService,
    MagicLinkService,
    OrganizationService,
    OrgMemberInvitationsService,
    OrgMemberService,
    TemplateService,
    S3Service,
    // IntegrationsService,
    LeadService,
    PrismaService,
    LeadActivityService,
    LeadStatusService,
    LeadActivityService,
    LeadNotesService,
    ContactService,
    Service,
    UnsubscribeLinkService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
