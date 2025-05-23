import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionStatisticsDto } from '../../application/dtos/transaction.dto';
import { GetTransactionStatisticsUseCase } from '../../application/use-cases/transaction.use-cases';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  private readonly logger = new Logger(StatisticsController.name);

  constructor(
    private readonly getTransactionStatisticsUseCase: GetTransactionStatisticsUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get transaction statistics for the last 60 seconds' })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics successfully retrieved',
    type: TransactionStatisticsDto
  })
  async getStatistics(): Promise<TransactionStatisticsDto> {
    this.logger.log('Getting transaction statistics for the last 60 seconds');
    
    const statistics = await this.getTransactionStatisticsUseCase.execute();
    
    this.logger.log(`Statistics retrieved: ${JSON.stringify(statistics)}`);
    return statistics;
  }
}
