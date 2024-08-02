import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { OrgMemberModule } from '../../src/org-member/org-member.module';
import { OrgMemberService } from '../../src/org-member/org-member.service';

describe('OrgMemberController (e2e)', () => {
  let app: INestApplication;
  let service: OrgMemberService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrgMemberModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    service = moduleFixture.get<OrgMemberService>(OrgMemberService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/org-member/:memberId (PATCH)', () => {
    it('should update member role successfully', async () => {
      const memberId = 'ck2j49r2a0d1m0741gzhjo41v';
      const role = 'ADMIN';

      // Mock authenticated admin user
      app.use((req, res, next) => {
        req.user = {
          id: 'user-id',
          role: 'ADMIN',
        };
        next();
      });

      const response = await request(app.getHttpServer())
        .patch(`/org-member/${memberId}`)
        .send({ role })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        status: true,
        message: 'Member role updated successfully.',
        data: {
          memberId,
          role,
        },
      });
    });

    it('should return 400 for invalid role', async () => {
      const memberId = 'ck2j49r2a0d1m0741gzhjo41v';
      const role = 'INVALID_ROLE';

      // Mock authenticated admin user
      app.use((req, res, next) => {
        req.user = {
          id: 'user-id',
          role: 'ADMIN',
        };
        next();
      });

      const response = await request(app.getHttpServer())
        .patch(`/org-member/${memberId}`)
        .send({ role })
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        status: false,
        message:
          'Invalid data for role update. Please check the provided data.',
      });
    });

    it('should return 404 for non-existing member', async () => {
      const memberId = 'non-existing-id';
      const role = 'ADMIN';

      // Mock authenticated admin user
      app.use((req, res, next) => {
        req.user = {
          id: 'user-id',
          role: 'ADMIN',
        };
        next();
      });

      const response = await request(app.getHttpServer())
        .patch(`/org-member/${memberId}`)
        .send({ role })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        status: false,
        message: 'Member not found.',
      });
    });

    // it('should return 401 for unauthorized access', async () => {
    //   const memberId = 'ck2j49r2a0d1m0741gzhjo41v';
    //   const role = 'ADMIN';

    //   // Mock unauthorized user
    //   app.use((req, res, next) => {
    //     req.user = {
    //       id: 'user-id',
    //       role: 'MEMBER',
    //     };
    //     next();
    //   });

    //   const response = await request(app.getHttpServer())
    //     .patch(`/org-member/${memberId}`)
    //     .send({ role })
    //     .expect(HttpStatus.UNAUTHORIZED);

    //   expect(response.body).toEqual({
    //     status: false,
    //     message: 'Unauthorized access. Only admin can perform this action.',
    //   });
    // });
  });

  describe('/org-member/:memberId (DELETE)', () => {
    it('should delete member successfully', async () => {
      const memberId = 'ck2j49r2a0d1m0741gzhjo41v';

      // Mock authenticated admin user
      app.use((req, res, next) => {
        req.user = {
          id: 'user-id',
          role: 'ADMIN',
        };
        next();
      });

      const response = await request(app.getHttpServer())
        .delete(`/org-member/${memberId}`)
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        status: true,
        message: 'Member deleted successfully.',
      });
    });

    // it('should return 400 for invalid member ID', async () => {
    //   const memberId = 'invalid-id';

    //   // Mock authenticated admin use

    //   const response = await request(app.getHttpServer())
    //     .delete(`/org-member/${memberId}`)
    //     .expect(HttpStatus.BAD_REQUEST);

    //   expect(response.body).toEqual({
    //     status: false,
    //     message: 'Invalid member ID. Please check the provided ID.',
    //   });
    // });

    it('should return 404 for non-existing member', async () => {
      const memberId = 'non-existing-id';

      const response = await request(app.getHttpServer())
        .delete(`/org-member/${memberId}`)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        status: false,
        message: 'Member not found.',
      });
    });

    // it('should return 401 for unauthorized access', async () => {
    //     const memberId = 'ck2j49r2a0d1m0741gzhjo41v';
    //     const response = await request(app.getHttpServer())
    //       .delete(`/org-member/${memberId}`)
    //       .expect(HttpStatus.UNAUTHORIZED);

    //     expect(response.body).toEqual({
    //     error: "Unauthorized",
    //       message: 'User not authenticated.',
    //     });
    //   });
  });
});
