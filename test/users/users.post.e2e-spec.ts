import * as request from 'supertest';

import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { bootstrapNestApplication } from 'test/helpers/bootrap-nest-application.helper';
import { dropDatabase } from 'test/helpers/dreop-database.helper';
import {
  complateUser,
  missingEmail,
  missingFirstName,
  missingPassword,
} from './uses.post.e2e-spec.sample-data';

describe('[Users] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    // Instantiate the app
    app = await bootstrapNestApplication();
    // Get the config
    config = app.get<ConfigService>(ConfigService);
    // get server endpoint
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/users - Endpoint is public', () => {
    return request(httpServer).post('/users').send({}).expect(400);
  });

  it('/users - firstName is mandatory', () => {
    return request(httpServer)
      .post('/users')
      .send(missingFirstName)
      .expect(400);
  });
  it('/users - email is mandatory', () => {
    return request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - password is mandatory', () => {
    return request(httpServer).post('/users').send(missingPassword).expect(400);
  });
  it('/users - Valid request successfully creates user', () => {
    return request(httpServer)
      .post('/users')
      .send(complateUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toBeDefined();
        expect(body.data.firstName).toBe(complateUser.firstName);
        expect(body.data.lastName).toBe(complateUser.lastName);
        expect(body.data.email).toBe(complateUser.email);
      });
  });
  it('/users - password is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(complateUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.password).toBeUndefined();
      });
  });

  it('/users - googleId is not returned in response', () => {
    return request(httpServer)
      .post('/users')
      .send(complateUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.data.googleId).toBeUndefined();
      });
  });
});
