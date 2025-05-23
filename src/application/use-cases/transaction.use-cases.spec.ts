import { Test, TestingModule } from '@nestjs/testing';
import { UnprocessableEntityException } from '@nestjs/common';
import {
  CreateTransactionUseCase,
  DeleteAllTransactionsUseCase,
  GetTransactionStatisticsUseCase,
} from './transaction.use-cases';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

describe('Transaction Use Cases', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase;
  let getTransactionStatisticsUseCase: GetTransactionStatisticsUseCase;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  const mockTransactionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByTimeRange: jest.fn(),
    deleteAll: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        DeleteAllTransactionsUseCase,
        GetTransactionStatisticsUseCase,
        {
          provide: TransactionRepository,
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    createTransactionUseCase = module.get<CreateTransactionUseCase>(CreateTransactionUseCase);
    deleteAllTransactionsUseCase = module.get<DeleteAllTransactionsUseCase>(DeleteAllTransactionsUseCase);
    getTransactionStatisticsUseCase = module.get<GetTransactionStatisticsUseCase>(GetTransactionStatisticsUseCase);
    transactionRepository = module.get(TransactionRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateTransactionUseCase', () => {
    it('should create a transaction successfully', async () => {
      const pastDate = new Date(Date.now() - 1000);
      const params = { amount: 100.50, timestamp: pastDate };
      
      mockTransactionRepository.create.mockResolvedValue({
        id: '1',
        amount: 100.50,
        timestamp: pastDate,
        createdAt: new Date(),
      });

      await createTransactionUseCase.execute(params);

      expect(transactionRepository.create).toHaveBeenCalledWith(params);
    });

    it('should throw UnprocessableEntityException for future timestamp', async () => {
      const futureDate = new Date(Date.now() + 10000);
      const params = { amount: 100.50, timestamp: futureDate };

      await expect(createTransactionUseCase.execute(params))
        .rejects
        .toThrow(UnprocessableEntityException);

      expect(transactionRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('DeleteAllTransactionsUseCase', () => {
    it('should delete all transactions', async () => {
      mockTransactionRepository.deleteAll.mockResolvedValue(undefined);

      await deleteAllTransactionsUseCase.execute();

      expect(transactionRepository.deleteAll).toHaveBeenCalled();
    });
  });

  describe('GetTransactionStatisticsUseCase', () => {
    it('should return statistics for recent transactions', async () => {
      const now = new Date();
      const recentTransactions: Transaction[] = [
        {
          id: '1',
          amount: 100.50,
          timestamp: new Date(now.getTime() - 30000),
          createdAt: new Date(),
        },
        {
          id: '2',
          amount: 200.25,
          timestamp: new Date(now.getTime() - 45000),
          createdAt: new Date(),
        },
      ];

      mockTransactionRepository.findByTimeRange.mockResolvedValue(recentTransactions);

      const result = await getTransactionStatisticsUseCase.execute();

      expect(result).toEqual({
        count: 2,
        sum: 300.75,
        avg: 150.38,
        min: 100.50,
        max: 200.25,
      });
    });

    it('should return zero statistics when no recent transactions', async () => {
      mockTransactionRepository.findByTimeRange.mockResolvedValue([]);

      const result = await getTransactionStatisticsUseCase.execute();

      expect(result).toEqual({
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      });
    });
  });
});
