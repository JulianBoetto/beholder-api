import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth service', () => {
  let app: INestApplication;
  let access_token: string = '';
  let refresh_token: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Login', () => {
    it('Success', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: process.env.EMAIL,
          password: process.env.ACCESS_PASSWORD,
        })
        .expect(200);

      const { body } = response;
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');
      expect(body).toHaveProperty('pushToken');
      expect(typeof body.access_token).toBe('string');
      expect(typeof body.refresh_token).toBe('string');
      expect(typeof body.pushToken).toBe('string');
      access_token = body.access_token;
      refresh_token = body.refresh_token;
    });

    it('Unauthorized (incorrect password)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: process.env.EMAIL,
          password: 'wrong password',
        })
        .expect(401);

      const { text } = response;
      expect(text).toEqual(
        '{"statusCode":401,"message":"Email address or password provided is incorrect.","error":"Unauthorized"}',
      );
    });

    it('Unauthorized (incorrect email)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'incorrect email',
          password: process.env.ACCESS_PASSWORD,
        })
        .expect(401);

      const { text } = response;
      expect(text).toEqual(
        '{"statusCode":401,"message":"Email address or password provided is incorrect.","error":"Unauthorized"}',
      );
    });
  });

  describe('Logout', () => {
    it('Success', () => {
      request(app.getHttpServer())
        .delete('/auth/logout')
        .set({
          Authorization: `Bearer ${access_token}`,
        })
        .expect(200);
    });

    it('Unauthorized (without access token)', async () => {
      const response = await request(app.getHttpServer())
        .delete('/auth/logout')
        .expect(401);

      const { text } = response;
      expect(text).toEqual('{"statusCode":401,"message":"Unauthorized"}');
    });
  });

  describe('Refresh token', () => {
    it('New access and refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set({
          Authorization: `Bearer ${refresh_token}`,
        });

      const { body } = response;
      expect(body).toHaveProperty('access_token');
      expect(body).toHaveProperty('refresh_token');
      expect(body).toHaveProperty('pushToken');
      expect(typeof body.access_token).toBe('string');
      expect(typeof body.refresh_token).toBe('string');
      expect(typeof body.pushToken).toBe('string');
    });

    it('Unauthorized (without refresh token)', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .expect(401);

      const { text } = response;
      expect(text).toEqual('{"statusCode":401,"message":"Unauthorized"}');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
