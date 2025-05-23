export interface Transaction {
  id: string;
  amount: number;
  timestamp: Date;
  createdAt: Date;
}

export interface CreateTransactionParams {
  amount: number;
  timestamp: Date;
}

export interface TransactionStatistics {
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
}
