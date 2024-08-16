import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TemplateModule } from '../../src/templates/template.module';
import { TemplateService } from '../../src/templates/template.service';

describe('TemplateController (e2e)', () => {
  let app: INestApplication;
  let templateService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAllByUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TemplateModule],
      providers: [{ provide: TemplateService, useValue: templateService }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/template (POST) should create a template', () => {
    const createTemplateDto = {
      html: '<html><body><h1>Hello World</h1></body></html>',
      userId: 'user12345',
      scope: 'ADMIN_ONLY',
    };
    templateService.create = jest.fn().mockResolvedValue({
      ...createTemplateDto,
      id: 'tmpl12345',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      deletedAt: 0,
    });

    return request(app.getHttpServer())
      .post('/template')
      .send(createTemplateDto)
      .expect(HttpStatus.CREATED)
      .expect({
        status: true,
        message: 'Template created successfully.',
        data: {
          id: '1',
          html: '<html><body><h1>Hello World</h1></body></html>',
          userId: 'user12345',
          scope: 'ADMIN_ONLY',
          createdAt: 123123123123,
          updatedAt: 123123123123,
          deletedAt: 0,
        },
      });
  });

  it('/template/:id (GET) should return a template', () => {
    const template = {
      id: 'tmpl12345',
      html: '<html><body><h1>Hello World</h1></body></html>',
      userId: 'user12345',
      createdAt: 123123123123,
      updatedAt: 123123123123,
      deletedAt: 0,
    };
    templateService.findOne = jest.fn().mockResolvedValue(template);

    return request(app.getHttpServer())
      .get('/template/tmpl12345')
      .expect(HttpStatus.OK)
      .expect({
        status: true,
        message: 'Template retrieved successfully.',
        data: template,
      });
  });

  it('/template/user/:userId (GET) should return templates for a user', () => {
    templateService.findAllByUser = jest.fn().mockResolvedValue([
      {
        id: '1',
        html: '<html><body><h1>Hello World</h1></body></html>',
        userId: 'user12345',
        scope: 'ADMIN_ONLY',
        createdAt: 123123123123,
        updatedAt: 123123123123,
        deletedAt: 0,
      },
    ]);

    return request(app.getHttpServer())
      .get('/template/user/user12345')
      .expect(HttpStatus.OK)
      .expect({
        status: true,
        message: 'Templates retrieved successfully.',
        data: [
          {
            id: '1',
            html: '<html><body><h1>Hello World</h1></body></html>',
            userId: 'user12345',
            scope: 'ADMIN_ONLY',
            createdAt: 123123123123,
            updatedAt: 123123123123,
            deletedAt: 0,
          },
        ],
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
