import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction, CreateTransactionParams, TransactionStatistics } from '../../domain/entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InMemoryTransactionRepository implements TransactionRepository {
  private transactions: Transaction[] = [];

  async create(params: CreateTransactionParams): Promise<Transaction> {
    const transaction: Transaction = {
      id: uuidv4(),
      amount: params.amount,
      timestamp: params.timestamp,
      createdAt: new Date()
    };

    this.transactions.push(transaction);
    return transaction;
  }

  async findAll(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<Transaction[]> {
    return this.transactions.filter(
      transaction => 
        transaction.timestamp >= startTime && 
        transaction.timestamp <= endTime
    );
  }

  async deleteAll(): Promise<void> {
    this.transactions = [];
  }

  async getStatistics(): Promise<TransactionStatistics> {
    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);
    
    const recentTransactions = await this.findByTimeRange(sixtySecondsAgo, now);

    if (recentTransactions.length === 0) {
      return {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0
      };
    }

    const amounts = recentTransactions.map(transaction => transaction.amount);
    const sum = amounts.reduce((acc, amount) => acc + amount, 0);
    const count = amounts.length;
    const avg = sum / count;
    const min = Math.min(...amounts);
    const max = Math.max(...amounts);

    return {
      count,
      sum: Number(sum.toFixed(2)),
      avg: Number(avg.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2))
    };
  }
}
