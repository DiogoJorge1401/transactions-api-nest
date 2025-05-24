import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { TransactionRepository } from '../src/domain/repositories/transaction.repository';
import { InMemoryTransactionRepository } from '../src/infrastructure/repositories/in-memory-transaction.repository';

describe('Transaction API (e2e)', () => {
  let app: INestApplication<App>;
  let moduleFixture: TestingModule;


  const createApp = async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    return app;
  };

  const closeApp = async () => {
    if (app) {
      await app.close();
    }
    if (moduleFixture) {
      await moduleFixture.close();
    }
  };

  afterEach(async () => {
    await closeApp()
  });

  beforeEach(async () => {
    app = await createApp()
  });

  describe('/health (GET)', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('/transactions (POST)', () => {
    it('should create a transaction successfully', async () => {
      const transaction = {
        amount: 123.45,
        timestamp: new Date().toISOString(),
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(201);

    });

    it('should reject negative amount', async () => {
      const transaction = {
        amount: -10.50,
        timestamp: new Date().toISOString(),
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);

    });

    it('should reject future timestamp', async () => {
      const futureDate = new Date(Date.now() + 10000);
      const transaction = {
        amount: 100.50,
        timestamp: futureDate.toISOString(),
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(422);

    });

    it('should reject invalid timestamp format', async () => {
      const transaction = {
        amount: 100.50,
        timestamp: 'invalid-date',
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);

    });

    it('should reject missing amount', async () => {
      const transaction = {
        timestamp: new Date().toISOString(),
      };
      await request(app.getHttpServer())
        .post('/transactions')
        .send(transaction)
        .expect(400);

    });

    it('should reject missing timestamp', async () => {
      const transaction = {
        amount: 100.50,
      };
      await request(app.getHttpServer())
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
      const response = await request(app.getHttpServer())
        .delete('/transactions')
        .expect(200);
      expect(response.body.message).toBe('All transactions were successfully deleted');

    });
  });

  describe('/statistics (GET)', () => {
    it('should return zero statistics when no transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);
      expect(response.body).toEqual({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
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
      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);
      expect(response.body.count).toBe(3);
      expect(response.body.sum).toBe(351.5);
      expect(response.body.avg).toBe(117.17);
      expect(response.body.min).toBe(50.75);
      expect(response.body.max).toBe(200.25);

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
      const response = await request(app.getHttpServer())
        .get('/statistics')
        .expect(200);
      expect(response.body.count).toBe(1);
      expect(response.body.sum).toBe(100);
      expect(response.body.avg).toBe(100);
      expect(response.body.min).toBe(100);
      expect(response.body.max).toBe(100);
    });
  });
});
