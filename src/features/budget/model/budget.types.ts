export type TxType = 'income' | 'expense';

export type Category =
  | 'Housing'
  | 'Food'
  | 'Transportation'
  | 'Bills'
  | 'Entertainment'
  | 'Health'
  | 'Shopping'
  | 'Other';

export type Transaction = {
  id: string;
  type: TxType;
  amountCents: number; // store cents to avoid floating point issues
  category: Category;
  dateISO: string; // YYYY-MM-DD
  note?: string;
  createdAt: number;
};

export type BudgetState = {
  monthId: string; // YYYY-MM
  transactions: Transaction[];
};
