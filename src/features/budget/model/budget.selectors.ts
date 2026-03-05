import type { BudgetState, Transaction } from './budget.types';

export function monthIdFromISO(dateISO: string) {
  return dateISO.slice(0, 7); // YYYY-MM
}

export function filterTxForMonth(txs: Transaction[], monthId: string) {
  return txs.filter((t) => monthIdFromISO(t.dateISO) === monthId);
}

export function sumIncomeCents(txs: Transaction[]) {
  return txs
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amountCents, 0);
}

export function sumExpenseCents(txs: Transaction[]) {
  return txs
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amountCents, 0);
}

export function byCategoryExpenseCents(txs: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== 'expense') continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amountCents);
  }
  return map;
}

export function currencyFromCents(cents: number) {
  const dollars = cents / 100;
  return dollars.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
  });
}

export const DEFAULT_STATE: BudgetState = {
  monthId: new Date().toISOString().slice(0, 7),
  transactions: [],
};
