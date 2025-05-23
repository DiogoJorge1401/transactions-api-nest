import { InMemoryTransactionRepository } from './in-memory-transaction.repository';
import { CreateTransactionParams } from '../../domain/entities/transaction.entity';

describe('InMemoryTransactionRepository', () => {
  let repository: InMemoryTransactionRepository;

  beforeEach(() => {
    repository = new InMemoryTransactionRepository();
  });

  describe('create', () => {
    it('should create and store a transaction', async () => {
      const params: CreateTransactionParams = {
        amount: 123.45,
        timestamp: new Date(),
      };

      const transaction = await repository.create(params);

      expect(transaction).toBeDefined();
      expect(transaction.id).toBeDefined();
      expect(transaction.amount).toBe(params.amount);
      expect(transaction.timestamp).toBe(params.timestamp);
      expect(transaction.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const params1: CreateTransactionParams = {
        amount: 100,
        timestamp: new Date(),
      };
      const params2: CreateTransactionParams = {
        amount: 200,
        timestamp: new Date(),
      };

      await repository.create(params1);
      await repository.create(params2);

      const transactions = await repository.findAll();

      expect(transactions).toHaveLength(2);
      expect(transactions[0].amount).toBe(100);
      expect(transactions[1].amount).toBe(200);
    });
  });

  describe('findByTimeRange', () => {
    it('should return transactions within time range', async () => {
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60000);
      const twoMinutesAgo = new Date(now.getTime() - 120000);

      await repository.create({
        amount: 100,
        timestamp: twoMinutesAgo, // Outside range
      });
      await repository.create({
        amount: 200,
        timestamp: oneMinuteAgo, // Within range
      });
      await repository.create({
        amount: 300,
        timestamp: now, // Within range
      });

      const transactions = await repository.findByTimeRange(oneMinuteAgo, now);

      expect(transactions).toHaveLength(2);
      expect(transactions.some(t => t.amount === 200)).toBe(true);
      expect(transactions.some(t => t.amount === 300)).toBe(true);
      expect(transactions.some(t => t.amount === 100)).toBe(false);
    });
  });

  describe('deleteAll', () => {
    it('should delete all transactions', async () => {
      await repository.create({ amount: 100, timestamp: new Date() });
      await repository.create({ amount: 200, timestamp: new Date() });

      await repository.deleteAll();

      const transactions = await repository.findAll();
      expect(transactions).toHaveLength(0);
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics for transactions in the last 60 seconds', async () => {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30000);
      const twoMinutesAgo = new Date(now.getTime() - 120000);

      // Transaction outside 60s window
      await repository.create({
        amount: 1000,
        timestamp: twoMinutesAgo,
      });

      // Transactions within 60s window
      await repository.create({
        amount: 100.50,
        timestamp: thirtySecondsAgo,
      });
      await repository.create({
        amount: 200.25,
        timestamp: now,
      });

      const statistics = await repository.getStatistics();

      expect(statistics.count).toBe(2);
      expect(statistics.sum).toBe(300.75);
      expect(statistics.avg).toBe(150.38);
      expect(statistics.min).toBe(100.50);
      expect(statistics.max).toBe(200.25);
    });

    it('should return zero statistics when no transactions in the last 60 seconds', async () => {
      const twoMinutesAgo = new Date(Date.now() - 120000);
      
      await repository.create({
        amount: 100,
        timestamp: twoMinutesAgo,
      });

      const statistics = await repository.getStatistics();

      expect(statistics.count).toBe(0);
      expect(statistics.sum).toBe(0);
      expect(statistics.avg).toBe(0);
      expect(statistics.min).toBe(0);
      expect(statistics.max).toBe(0);
    });
  });
});
