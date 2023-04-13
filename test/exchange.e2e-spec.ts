import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ExchangeModule } from '../src/exchange/exchange.module';

describe('Exchange service', () => {
  let app: INestApplication;
  let access_token: string = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ExchangeModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.EMAIL,
        password: process.env.ACCESS_PASSWORD,
      });

    access_token = response.body.access_token;
  });

  describe('Balances', () => {
    it('Full balance', async () => {
      const response = await request(app.getHttpServer())
        .get(`/exchange/balance/full/usd`)
        .set({
          Authorization: `Bearer ${access_token}`,
        })
        .expect(200);

      const { body } = response;
      console.log(body)
      // for (let i = 0; i < body; i++) {
      //   if (i > 3) break;
      //   const symbol = body[i];
      //   expect(symbol).toHaveProperty('basePrecision');
      //   expect(symbol).toHaveProperty('quotePrecision');
      //   expect(symbol).toHaveProperty('base');
      //   expect(symbol).toHaveProperty('quote');
      //   expect(symbol).toHaveProperty('stepSize');
      //   expect(symbol).toHaveProperty('tickSize');
      //   expect(symbol).toHaveProperty('minNotional');
      //   expect(symbol).toHaveProperty('minLotSize');
      //   expect(symbol).toHaveProperty('isFavorite');
      //   expect(symbol.symbol).toMatch(/[A-Z]+/);
      //   expect(symbol.basePrecision).toBeGreaterThan(0);
      //   expect(symbol.quotePrecision).toBeGreaterThan(0);
      //   expect(symbol.base).toMatch(/[A-Z]+/);
      //   expect(symbol.quote).toMatch(/[A-Z]+/);
      //   expect(symbol.stepSize).toMatch(/^\d+\.\d+$/);
      //   expect(symbol.tickSize).toMatch(/^\d+\.\d+$/);
      //   expect(symbol.minNotional).toMatch(/^\d+\.\d+$/);
      //   expect(symbol.minLotSize).toMatch(/^\d+\.\d+$/);
      //   expect(typeof symbol.isFavorite).toBe('boolean');
      // }
    });

    // it('GET Symbol by id', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get('/symbols/BTCUSDT')
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   expect(body).toHaveProperty('symbol');
    //   expect(body).toHaveProperty('basePrecision');
    //   expect(body).toHaveProperty('quotePrecision');
    //   expect(body).toHaveProperty('base');
    //   expect(body).toHaveProperty('quote');
    //   expect(typeof body.symbol).toBe('string');
    //   expect(typeof body.basePrecision).toBe('number');
    //   expect(typeof body.quotePrecision).toBe('number');
    //   expect(typeof body.base).toBe('string');
    //   expect(typeof body.quote).toBe('string');
    // });

    // it('UPDATE', async () => {
    //   const response = await request(app.getHttpServer())
    //     .patch('/symbols/btcusdt')
    //     .send({
    //       isFavorite: true,
    //     })
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   expect(body).toHaveProperty('isFavorite');
    //   expect(body.isFavorite).toEqual(true);
    // });

    // it('GET All symbols without pages', async () => {
    //   const response = await request(app.getHttpServer())
    //     .get('/symbols')
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   for (let i = 0; i < body; i++) {
    //     if (i > 3) break;
    //     const symbol = body[i];
    //     expect(symbol).toHaveProperty('symbol');
    //     expect(symbol).toHaveProperty('basePrecision');
    //     expect(symbol).toHaveProperty('quotePrecision');
    //     expect(symbol).toHaveProperty('base');
    //     expect(symbol).toHaveProperty('quote');
    //     expect(symbol).toHaveProperty('stepSize');
    //     expect(symbol).toHaveProperty('tickSize');
    //     expect(symbol).toHaveProperty('minNotional');
    //     expect(symbol).toHaveProperty('minLotSize');
    //     expect(symbol).toHaveProperty('isFavorite');
    //     expect(symbol.symbol).toMatch(/[A-Z]+/);
    //     expect(symbol.basePrecision).toBeGreaterThan(0);
    //     expect(symbol.quotePrecision).toBeGreaterThan(0);
    //     expect(symbol.base).toMatch(/[A-Z]+/);
    //     expect(symbol.quote).toMatch(/[A-Z]+/);
    //     expect(symbol.stepSize).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.tickSize).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.minNotional).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.minLotSize).toMatch(/^\d+\.\d+$/);
    //     expect(typeof symbol.isFavorite).toBe('boolean');
    //   }
    // });

    // it('GET All symbols with pages', async () => {
    //   const page = 1;
    //   const response = await request(app.getHttpServer())
    //     .get(`/symbols/?page=${page}`)
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   expect(body).toHaveProperty('count');
    //   expect(body).toHaveProperty('rows');
    //   expect(body.count).toEqual(10);
    //   expect(body.rows.length).toEqual(10);
    //   for (let i = 0; i < body.count; i++) {
    //     if (i > 3) break;
    //     const symbol = body.rows[i];
    //     expect(symbol).toHaveProperty('symbol');
    //     expect(symbol).toHaveProperty('basePrecision');
    //     expect(symbol).toHaveProperty('quotePrecision');
    //     expect(symbol).toHaveProperty('base');
    //     expect(symbol).toHaveProperty('quote');
    //     expect(symbol).toHaveProperty('stepSize');
    //     expect(symbol).toHaveProperty('tickSize');
    //     expect(symbol).toHaveProperty('minNotional');
    //     expect(symbol).toHaveProperty('minLotSize');
    //     expect(symbol).toHaveProperty('isFavorite');
    //     expect(symbol.symbol).toMatch(/[A-Z]+/);
    //     expect(symbol.basePrecision).toBeGreaterThan(0);
    //     expect(symbol.quotePrecision).toBeGreaterThan(0);
    //     expect(symbol.base).toMatch(/[A-Z]+/);
    //     expect(symbol.quote).toMatch(/[A-Z]+/);
    //     expect(symbol.stepSize).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.tickSize).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.minNotional).toMatch(/^\d+\.\d+$/);
    //     expect(symbol.minLotSize).toMatch(/^\d+\.\d+$/);
    //     expect(typeof symbol.isFavorite).toBe('boolean');
    //   }
    // });

    // it('GET only favorites symbols where quote is USDT', async () => {
    //   const quote = 'usdt';
    //   const onlyFavorites = true;
    //   const response = await request(app.getHttpServer())
    //     .get(`/symbols/?onlyFavorites=${onlyFavorites}&quote=${quote}`)
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   expect(body).toHaveProperty('count');
    //   expect(body).toHaveProperty('rows');
    //   const symbol = body.rows[0];
    //   expect(body.count).toEqual(1);
    //   expect(symbol).toHaveProperty('symbol');
    //   expect(symbol).toHaveProperty('basePrecision');
    //   expect(symbol).toHaveProperty('quotePrecision');
    //   expect(symbol).toHaveProperty('base');
    //   expect(symbol).toHaveProperty('quote');
    //   expect(symbol).toHaveProperty('stepSize');
    //   expect(symbol).toHaveProperty('tickSize');
    //   expect(symbol).toHaveProperty('minNotional');
    //   expect(symbol).toHaveProperty('minLotSize');
    //   expect(symbol).toHaveProperty('isFavorite');
    //   expect(symbol.symbol).toMatch(/[A-Z]+/);
    //   expect(symbol.basePrecision).toBeGreaterThan(0);
    //   expect(symbol.quotePrecision).toBeGreaterThan(0);
    //   expect(symbol.base).toMatch(/[A-Z]+/);
    //   expect(symbol.quote).toMatch(/[A-Z]+/);
    //   expect(symbol.stepSize).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.tickSize).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.minNotional).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.minLotSize).toMatch(/^\d+\.\d+$/);
    //   expect(typeof symbol.isFavorite).toBe('boolean');
    // });

    // it('GET only favorites symbols where base is BTC', async () => {
    //   const base = 'btc';
    //   const onlyFavorites = true;
    //   const response = await request(app.getHttpServer())
    //     .get(`/symbols/?onlyFavorites=${onlyFavorites}&base=${base}`)
    //     .set({
    //       Authorization: `Bearer ${access_token}`,
    //     })
    //     .expect(200);

    //   const { body } = response;
    //   expect(body).toHaveProperty('count');
    //   expect(body).toHaveProperty('rows');
    //   const symbol = body.rows[0];
    //   expect(body.count).toEqual(1);
    //   expect(symbol).toHaveProperty('symbol');
    //   expect(symbol).toHaveProperty('basePrecision');
    //   expect(symbol).toHaveProperty('quotePrecision');
    //   expect(symbol).toHaveProperty('base');
    //   expect(symbol).toHaveProperty('quote');
    //   expect(symbol).toHaveProperty('stepSize');
    //   expect(symbol).toHaveProperty('tickSize');
    //   expect(symbol).toHaveProperty('minNotional');
    //   expect(symbol).toHaveProperty('minLotSize');
    //   expect(symbol).toHaveProperty('isFavorite');
    //   expect(symbol.symbol).toMatch(/[A-Z]+/);
    //   expect(symbol.basePrecision).toBeGreaterThan(0);
    //   expect(symbol.quotePrecision).toBeGreaterThan(0);
    //   expect(symbol.base).toMatch(/[A-Z]+/);
    //   expect(symbol.quote).toMatch(/[A-Z]+/);
    //   expect(symbol.stepSize).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.tickSize).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.minNotional).toMatch(/^\d+\.\d+$/);
    //   expect(symbol.minLotSize).toMatch(/^\d+\.\d+$/);
    //   expect(typeof symbol.isFavorite).toBe('boolean');
    // });
  });

  afterAll(async () => {
    await app.close();
  });
});
