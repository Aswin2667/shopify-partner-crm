export class SendInviteLinkDto {
  email: string;
  organizationId: string;
  invitedBy: string;
  role: 'ADMIN' | 'MEMBER';
}
