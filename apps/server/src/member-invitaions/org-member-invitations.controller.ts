import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrgMemberInvitationsService } from './org-member-invitations.service';
import { SendInviteLinkDto } from './dto/invite-link.dto';

@Controller('invitation')
export class OrgMemberInvitationsController {
  constructor(
    private readonly orgMemberInvitationsService: OrgMemberInvitationsService,
  ) {}

  @Post('send')
  async sendInviteLink(@Body() sendInviteLinkDto: SendInviteLinkDto) {
    try {
      await this.orgMemberInvitationsService.sendInviteLink(sendInviteLinkDto);
      return {
        status: true,
        message: 'Invite link sent to the provided email.',
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while sending the invite link.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('verify')
  async verifyInviteToken(@Query('token') token: string) {
    try {
      const user =
        await this.orgMemberInvitationsService.verifyInviteToken(token);
      if (!user) {
        return {
          status: false,
          message: 'Invalid token',
          user: null,
        };
      }
      return {
        status: true,
        message: 'Token verified successfully.',
        data:user,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while verifying the token.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('accept')
  async acceptInviteToken(@Query('token') token: string) {
    try {
      const user =
        await this.orgMemberInvitationsService.acceptInviteToken(token);
      if (!user) {
        return {
          status: false,
          message: 'Invalid token',
          user: null,
        };
      }
      return {
        status: true,
        message: 'Invitation Accepted successfully.',
        data:user,
      };
    } catch (error) {
      throw new HttpException(
        error.message ||
          'An unexpected error occurred while verifying the token.',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('all')
  async getOrgMemberInvitationsByOrgId(@Query('orgId') orgId: string) {
    if (!orgId) {
      throw new HttpException(
        { status: false, message: 'Organization ID is required', data: null },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const members =
        await this.orgMemberInvitationsService.getMemberByOrgId(orgId);
      const pendingInvitations =
        await this.orgMemberInvitationsService.getPendingInvitationByOrgId(
          orgId,
        );
      return {
        status: true,
        message: 'Invitations retrieved successfully',
        data: { members, pendingInvitations },
      };
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw new HttpException(
        {
          status: false,
          message: 'An error occurred while retrieving invitations',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
