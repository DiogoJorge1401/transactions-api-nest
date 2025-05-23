import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import {
  CreateTransactionUseCase,
  DeleteAllTransactionsUseCase,
} from '../../application/use-cases/transaction.use-cases';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let createTransactionUseCase: jest.Mocked<CreateTransactionUseCase>;
  let deleteAllTransactionsUseCase: jest.Mocked<DeleteAllTransactionsUseCase>;

  const mockCreateTransactionUseCase = {
    execute: jest.fn(),
  };

  const mockDeleteAllTransactionsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: CreateTransactionUseCase,
          useValue: mockCreateTransactionUseCase,
        },
        {
          provide: DeleteAllTransactionsUseCase,
          useValue: mockDeleteAllTransactionsUseCase,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    createTransactionUseCase = module.get(CreateTransactionUseCase);
    deleteAllTransactionsUseCase = module.get(DeleteAllTransactionsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a transaction', async () => {
      const createTransactionDto = {
        amount: 123.45,
        timestamp: new Date().toISOString(),
      };

      mockCreateTransactionUseCase.execute.mockResolvedValue(undefined);

      await controller.create(createTransactionDto);

      expect(createTransactionUseCase.execute).toHaveBeenCalledWith({...createTransactionDto, timestamp: new Date(createTransactionDto.timestamp)});
    });
  });

  describe('deleteAll', () => {
    it('should delete all transactions', async () => {
      mockDeleteAllTransactionsUseCase.execute.mockResolvedValue(undefined);

      const result = await controller.deleteAll();

      expect(deleteAllTransactionsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'All transactions were successfully deleted',
      });
    });
  });
});
