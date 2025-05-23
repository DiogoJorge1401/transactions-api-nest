import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateTransactionDto } from './transaction.dto';

describe('CreateTransactionDto', () => {
  it('should validate a correct transaction', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      amount: 123.45,
      timestamp: new Date().toISOString(),
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject negative amount', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      amount: -10,
      timestamp: new Date().toISOString(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should reject missing amount', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      timestamp: new Date().toISOString(),
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('amount');
  });

  it('should reject invalid timestamp', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      amount: 100,
      timestamp: 'invalid-date',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('timestamp');
  });

  it('should reject missing timestamp', async () => {
    const dto = plainToInstance(CreateTransactionDto, {
      amount: 100,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('timestamp');
  });
});
