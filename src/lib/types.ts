export type TransactionType = 'CREDIT' | 'DEBIT';

export type Category =
  | 'Food'
  | 'Rent'
  | 'UPI/Misc'
  | 'Investment'
  | 'SIP'
  | 'Salary'
  | 'Shopping'
  | 'Entertainment'
  | 'Health'
  | 'Transport';

export interface Transaction {
  id: string;
  date: string;
  name: string;
  category: Category;
  amount: number;
  type: TransactionType;
  referenceNo?: string;
  bank?: string;
}

export interface Budget {
  category: Category;
  limit: number;
  spent: number;
}

export interface TaxProfile {
  annualIncome: number;
  investments80C: number; // PPF, ELSS, EPF
  nps: number;
  standardDeduction: number;
}

export interface AIInsight {
  id: string;
  message: string;
  potentialSaving: number;
  category: Category;
  type: 'TIP' | 'WARNING' | 'SUCCESS';
}
