import { IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ 
    example: 123.45, 
    description: 'Transaction amount (must be positive or zero)' 
  })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsNotEmpty({ message: 'Amount is required' })
  @Min(0, { message: 'Amount cannot be negative' })
  amount: number;

  @ApiProperty({ 
    example: '2024-02-20T12:34:56.789Z', 
    description: 'Transaction timestamp in ISO 8601 format (UTC)' 
  })
  @IsDateString({}, { message: 'Timestamp must be a valid ISO 8601 date string' })
  @IsNotEmpty({ message: 'Timestamp is required' })
  timestamp: string;
}

export class TransactionStatisticsDto {
  @ApiProperty({ example: 10, description: 'Total number of transactions in the last 60 seconds' })
  count: number;

  @ApiProperty({ example: 1234.56, description: 'Sum of all transaction amounts' })
  sum: number;

  @ApiProperty({ example: 123.45, description: 'Average of all transaction amounts' })
  avg: number;

  @ApiProperty({ example: 12.34, description: 'Minimum transaction amount' })
  min: number;

  @ApiProperty({ example: 456.78, description: 'Maximum transaction amount' })
  max: number;
}
