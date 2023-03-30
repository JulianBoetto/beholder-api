import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth service Int', () => {
  let app: INestApplication;

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
    });

    it('Unauthorized', async () => {
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
  });
});
