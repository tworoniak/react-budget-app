import { z } from 'zod';

export const categories = [
  'Housing',
  'Food',
  'Transportation',
  'Bills',
  'Entertainment',
  'Health',
  'Shopping',
  'Other',
] as const;

export const txSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .string()
    .min(1, 'Amount is required')
    .refine(
      (v) => !Number.isNaN(Number(v)) && Number(v) > 0,
      'Enter a valid amount',
    ),
  category: z.enum(categories),
  dateISO: z.string().min(10, 'Date is required'),
  note: z.string().optional(),
});

export type TxFormValues = z.infer<typeof txSchema>;
