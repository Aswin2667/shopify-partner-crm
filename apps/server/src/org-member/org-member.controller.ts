import {
  Controller,
  Patch,
  Param,
  Body,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Post,
} from '@nestjs/common';
import { OrgMemberService } from './org-member.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '../common/gaurds/auth.guard';

@Controller('org-member')
export class OrgMemberController {
  constructor(private readonly orgMemberService: OrgMemberService) {}

  @Patch(':memberId')
  @UseGuards(AuthGuard)
  async updateRole(
    @Param('memberId') memberId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    try {
      const updatedMember = await this.orgMemberService.updateRole(
        memberId,
        updateRoleDto.role,
      );
      return {
        status: true,
        message: 'Member role updated successfully.',
        data: {
          memberId: updatedMember.id,
          role: updatedMember.role,
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message:
            error.message ||
            'An unexpected error occurred while updating the member role.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':memberId')
  @UseGuards(AuthGuard)
  async deleteMember(@Param('memberId') memberId: string) {
    try {
      await this.orgMemberService.deleteMember(memberId);
      return {
        status: true,
        message: 'Member deleted successfully.',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          message:
            error.message ||
            'An unexpected error occurred while deleting the member.',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':memberId/signature')
  @UseGuards(AuthGuard)
  async generateSignature(
    @Param('memberId') memberId: string,
    @Body() body: any,
  ) {
    return this.orgMemberService.generateSignature(memberId, body.signature);
  }
}
