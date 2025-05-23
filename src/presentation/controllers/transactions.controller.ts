import {
  Controller,
  Post,
  Delete,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDto } from '../../application/dtos/transaction.dto';
import {
  CreateTransactionUseCase,
  DeleteAllTransactionsUseCase,
} from '../../application/use-cases/transaction.use-cases';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ 
    status: 201, 
    description: 'Transaction successfully created and registered' 
  })
  @ApiResponse({ 
    status: 422, 
    description: 'Unprocessable Entity - Transaction violates business rules' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad Request - Malformed JSON or validation errors' 
  })
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<void> {
    this.logger.log(`Creating transaction: amount=${createTransactionDto.amount}, timestamp=${createTransactionDto.timestamp}`);
    
    await this.createTransactionUseCase.execute({
      amount: createTransactionDto.amount,
      timestamp: new Date(createTransactionDto.timestamp),
    });

    this.logger.log('Transaction created successfully');
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all transactions' })
  @ApiResponse({ 
    status: 200, 
    description: 'All transactions were successfully deleted' 
  })
  async deleteAll(): Promise<{ message: string }> {
    this.logger.log('Deleting all transactions');
    
    await this.deleteAllTransactionsUseCase.execute();
    
    this.logger.log('All transactions deleted successfully');
    return { message: 'All transactions were successfully deleted' };
  }
}
