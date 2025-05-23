import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Transaction API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('OK');
          expect(res.body.timestamp).toBeDefined();
        });
    });
  });

  describe('/transactions (POST)', () => {
    it('should create a transaction successfully', () => {
      const transaction = {
        amount: 123.45,
        timestamp: new Date().toISOString(),
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(201);
    });

    it('should reject negative amount', () => {
      const transaction = {
        amount: -10.50,
        timestamp: new Date().toISOString(),
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);
    });

    it('should reject future timestamp', () => {
      const futureDate = new Date(Date.now() + 10000);
      const transaction = {
        amount: 100.50,
        timestamp: futureDate.toISOString(),
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(422);
    });

    it('should reject invalid timestamp format', () => {
      const transaction = {
        amount: 100.50,
        timestamp: 'invalid-date',
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);
    });

    it('should reject missing amount', () => {
      const transaction = {
        timestamp: new Date().toISOString(),
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);
    });

    it('should reject missing timestamp', () => {
      const transaction = {
        amount: 100.50,
      };

      return request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);
    });
  });

  describe('/transactions (DELETE)', () => {
    it('should delete all transactions', async () => {

      const transaction = {
        amount: 100.50,
        timestamp: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction);


      return request(app.getHttpServer())
        .delete('/transactions')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('All transactions were successfully deleted');
        });
    });
  });

  describe('/statistics (GET)', () => {
    beforeEach(async () => {

      await request(app.getHttpServer())
        .delete('/transactions');
    });

    it('should return zero statistics when no transactions', () => {
      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({
            count: 0,
            sum: 0,
            avg: 0,
            min: 0,
            max: 0,
          });
        });
    });

    it('should return statistics for recent transactions', async () => {
      const now = new Date();


      const transactions = [
        { amount: 100.50, timestamp: new Date(now.getTime() - 10000).toISOString() },
        { amount: 200.25, timestamp: new Date(now.getTime() - 20000).toISOString() },
        { amount: 50.75, timestamp: new Date(now.getTime() - 30000).toISOString() },
      ];

      for (const transaction of transactions) {
        await request(app.getHttpServer())
          .post('/transactions')
          .send(transaction);
      }

      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body.count).toBe(3);
          expect(res.body.sum).toBe(351.5);
          expect(res.body.avg).toBe(117.17);
          expect(res.body.min).toBe(50.75);
          expect(res.body.max).toBe(200.25);
        });
    });

    it('should not include transactions older than 60 seconds', async () => {
      const now = new Date();


      const oldTransaction = {
        amount: 1000,
        timestamp: new Date(now.getTime() - 120000).toISOString(),
      };


      const recentTransaction = {
        amount: 100,
        timestamp: new Date(now.getTime() - 10000).toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(oldTransaction);

      await request(app.getHttpServer())
        .post('/transactions')
        .send(recentTransaction);

      return request(app.getHttpServer())
        .get('/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body.count).toBe(1);
          expect(res.body.sum).toBe(100);
          expect(res.body.avg).toBe(100);
          expect(res.body.min).toBe(100);
          expect(res.body.max).toBe(100);
        });
    });
  });
});
