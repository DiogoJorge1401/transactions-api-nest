import { Transaction, CreateTransactionParams, TransactionStatistics } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract create(params: CreateTransactionParams): Promise<Transaction>;
  abstract findAll(): Promise<Transaction[]>;
  abstract findByTimeRange(startTime: Date, endTime: Date): Promise<Transaction[]>;
  abstract deleteAll(): Promise<void>;
  abstract getStatistics(): Promise<TransactionStatistics>;
}
