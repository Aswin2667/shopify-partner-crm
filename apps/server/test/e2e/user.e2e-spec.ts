import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST createUser', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      authenticationMethod: 'GOOGLE',
    };

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201)
      .expect({
        status: true,
        message: 'User created successfully.',
        data: { id: '1', ...createUserDto },
      });
  });

  it('/DELETE deleteUser/:id', async () => {
    return request(app.getHttpServer()).delete('/user/1').expect(200).expect({
      status: true,
      message: 'User deleted successfully.',
    });
  });

  it('/PATCH updateUser/:id', async () => {
    const updateUserDto = { name: 'Jane Doe' };
    return request(app.getHttpServer())
      .patch('/user/1')
      .send(updateUserDto)
      .expect(200)
      .expect({
        status: true,
        message: 'User name updated successfully.',
        data: { id: '1', name: 'Jane Doe' },
      });
  });

  it('/GET getUser/:id', async () => {
    return request(app.getHttpServer())
      .get('/user/1')
      .expect(200)
      .expect({
        status: true,
        message: 'User retrieved successfully.',
        data: { id: '1', name: 'John Doe' },
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
