import { Module } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { InMemoryTransactionRepository } from '../infrastructure/repositories/in-memory-transaction.repository';
import {
  CreateTransactionUseCase,
  DeleteAllTransactionsUseCase,
  GetTransactionStatisticsUseCase,
} from '../application/use-cases/transaction.use-cases';
import { TransactionsController } from './controllers/transactions.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { HealthController } from './controllers/health.controller';

@Module({
  controllers: [TransactionsController, StatisticsController, HealthController],
  providers: [
    {
      provide: TransactionRepository,
      useClass: InMemoryTransactionRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetTransactionStatisticsUseCase,
  ],
})
export class ApiModule {}
