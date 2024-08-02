import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '../../src/organization/dto/organization.dto';
import { OrganizationModule } from '../../src/organization/organization.module';
import { OrganizationService } from '../../src/organization/organization.service';
import * as request from 'supertest';

describe('OrganizationController (e2e)', () => {
  let app: INestApplication;
  let organizationService: OrganizationService;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, OrganizationModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    organizationService =
      moduleFixture.get<OrganizationService>(OrganizationService);
    userId = 'ck2j49r2a0d1m0741gzhjo41v';
  });

  it('/organization (POST) should create an organization', async () => {
    const createDto: CreateOrganizationDto = {
      name: 'humbletree',
      userId: userId,
      role: 'ADMIN',
    };

    const response = await request(app.getHttpServer())
      .post('/organization')
      .send(createDto)
      .expect(201);

    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Organization created successfully.');
    expect(response.body.data).toMatchObject({
      name: 'humbletree',
      userId: userId,
    });
  });

  it('/organization/:userId (GET) should retrieve organizations by user ID', async () => {
    const response = await request(app.getHttpServer())
      .get(`/organization/${userId}`)
      .expect(200);

    expect(response.body.status).toBe(true);
    expect(response.body.message).toBe('Organizations retrieved successfully.');
  });

  it('/organization/:id (DELETE) should delete an organization by ID', async () => {
    const createDto: CreateOrganizationDto = {
      name: 'humbletree',
      userId: userId,
      role: 'ADMIN',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/organization')
      .send(createDto)
      .expect(201);

    const orgId = createResponse.body.data.id;

    await request(app.getHttpServer())
      .delete(`/organization/${orgId}`)
      .expect(200);

    // Verify deletion
    const response = await request(app.getHttpServer())
      .get(`/organization/${userId}`)
      .expect(200);

    const organization = response.body.data.find((org) => org.id === orgId);
    expect(organization).toBeUndefined();
  });

  it("/organization/:id (PATCH) should update an organization's name", async () => {
    const createDto: CreateOrganizationDto = {
      name: 'humbletree',
      userId: userId,
      role: 'ADMIN',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/organization')
      .send(createDto)
      .expect(201);

    const orgId = createResponse.body.data.id;

    const updateDto: UpdateOrganizationDto = {
      name: 'newname',
    };

    const updateResponse = await request(app.getHttpServer())
      .patch(`/organization/${orgId}`)
      .send(updateDto)
      .expect(200);

    expect(updateResponse.body.status).toBe(true);
    expect(updateResponse.body.message).toBe(
      'Organization name updated successfully.',
    );
    expect(updateResponse.body.data.name).toBe('newname');
  });

  afterAll(async () => {
    await app.close();
  });
});
