import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { GetTransactionStatisticsUseCase } from '../../application/use-cases/transaction.use-cases';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let getTransactionStatisticsUseCase: jest.Mocked<GetTransactionStatisticsUseCase>;

  const mockGetTransactionStatisticsUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: GetTransactionStatisticsUseCase,
          useValue: mockGetTransactionStatisticsUseCase,
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    getTransactionStatisticsUseCase = module.get(GetTransactionStatisticsUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStatistics', () => {
    it('should return transaction statistics', async () => {
      const expectedStatistics = {
        count: 5,
        sum: 1000.50,
        avg: 200.10,
        min: 50.25,
        max: 450.75,
      };

      mockGetTransactionStatisticsUseCase.execute.mockResolvedValue(expectedStatistics);

      const result = await controller.getStatistics();

      expect(getTransactionStatisticsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(expectedStatistics);
    });

    it('should return zero statistics when no transactions', async () => {
      const expectedStatistics = {
        count: 0,
        sum: 0,
        avg: 0,
        min: 0,
        max: 0,
      };

      mockGetTransactionStatisticsUseCase.execute.mockResolvedValue(expectedStatistics);

      const result = await controller.getStatistics();

      expect(getTransactionStatisticsUseCase.execute).toHaveBeenCalled();
      expect(result).toEqual(expectedStatistics);
    });
  });
});
