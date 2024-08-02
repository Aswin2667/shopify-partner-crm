import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';
import { App } from 'supertest/types';

describe('MagicLinkController (e2e)', () => {
  let app: { init: () => any; getHttpServer: () => App; close: () => any };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/magic-link/send (POST) - should send a magic link', async () => {
    return request(app.getHttpServer())
      .post('/magic-link/send')
      .send({ email: 'example@gmail.com' })
      .expect(201)
      .expect({
        status: true,
        message: 'Magic link sent to the provided email.',
      });
  });

  it('/magic-link/verify (GET) - should verify a magic token', async () => {
    return request(app.getHttpServer())
      .get('/magic-link/verify')
      .query({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      })
      .expect(200)
      .expect({
        status: true,
        message: 'Token verified successfully.',
        user: {
          id: 'ck2j49r2a0d1m0741gzhjo41v',
          name: 'John Doe',
          email: 'example@gmail.com',
          authenticationMethod: 'MAGIC_LINK',
          createdAt: 872748344,
          deletedAt: 124234123,
        },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
