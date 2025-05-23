import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction, CreateTransactionParams, TransactionStatistics } from '../../domain/entities/transaction.entity';

@Injectable()
export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(params: CreateTransactionParams): Promise<void> {
    const now = new Date();
    
    if (params.timestamp > now) {
      throw new UnprocessableEntityException('Transaction cannot be in the future');
    }

    await this.transactionRepository.create(params);
  }
}

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<void> {
    await this.transactionRepository.deleteAll();
  }
}

@Injectable()
export class GetTransactionStatisticsUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<TransactionStatistics> {
    const now = new Date();
    const sixtySecondsAgo = new Date(now.getTime() - 60 * 1000);
    
    const recentTransactions = await this.transactionRepository.findByTimeRange(
      sixtySecondsAgo,
      now
    );

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
