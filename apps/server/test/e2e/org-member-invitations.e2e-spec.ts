import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, HttpStatus, HttpException } from '@nestjs/common';
import { OrgMemberInvitationsModule } from '../../src/member-invitaions/org-member-invitations.module';
import { OrgMemberInvitationsService } from '../../src/member-invitaions/org-member-invitations.service';

describe('OrgMemberInvitationsController (e2e)', () => {
  let app: INestApplication;
  let service: OrgMemberInvitationsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrgMemberInvitationsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<OrgMemberInvitationsService>(
      OrgMemberInvitationsService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/invitation/send (POST)', () => {
    it('should send an invite link', async () => {
      const sendInviteLinkDto = { email: 'test@example.com' };
      jest.spyOn(service, 'sendInviteLink').mockImplementation(async () => {});

      const response = await request(app.getHttpServer())
        .post('/invitation/send')
        .send(sendInviteLinkDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        status: true,
        message: 'Invite link sent to the provided email.',
      });
    });

    it('should handle errors', async () => {
      const sendInviteLinkDto = { email: 'test@example.com' };
      jest.spyOn(service, 'sendInviteLink').mockImplementation(() => {
        throw new HttpException('Custom error message', HttpStatus.BAD_REQUEST);
      });

      const response = await request(app.getHttpServer())
        .post('/invitation/send')
        .send(sendInviteLinkDto)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe('Custom error message');
    });
  });

  describe('/invitation/verify (GET)', () => {
    it('should verify the token', async () => {
      const token = 'valid-token';
      const user = {
        id: 'ck2j49r2a0d1m0741gzhjo41v',
        name: 'John Doe',
        email: 'example@gmail.com',
        authenticationMethod: 'MAGIC_LINK',
        createdAt: 872748344,
        deletedAt: null,
      };
      jest
        .spyOn(service, 'verifyInviteToken')
        .mockImplementation(async () => user);

      const response = await request(app.getHttpServer())
        .get('/invitation/verify')
        .query({ token })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        status: true,
        message: 'Token verified successfully.',
        user,
      });
    });

    it('should handle errors', async () => {
      const token = 'invalid-token';
      jest.spyOn(service, 'verifyInviteToken').mockImplementation(() => {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      });

      const response = await request(app.getHttpServer())
        .get('/invitation/verify')
        .query({ token })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Invalid token');
    });
  });
});
