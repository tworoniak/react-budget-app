import { useState } from 'react';
import styles from './TransactionForm.module.scss';

import { txSchema, categories, type TxFormValues } from '../model/budget.zod';
import type { Category, Transaction, TxType } from '../model/budget.types';

type Props = {
  defaultDateISO: string; // e.g. 2026-03-01
  onAdd: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
};

function toCents(amountStr: string) {
  const cleaned = amountStr.replace(/[^0-9.]/g, '');
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export default function TransactionForm({ defaultDateISO, onAdd }: Props) {
  // Keep user-editable values, but NOT forced-syncing date in an effect
  const [values, setValues] = useState<
    Omit<TxFormValues, 'dateISO'> & { dateISO: string }
  >({
    type: 'expense',
    amount: '',
    category: 'Food',
    dateISO: defaultDateISO, // initial
    note: '',
  });

  const [error, setError] = useState<string | null>(null);

  const monthId = defaultDateISO.slice(0, 7); // YYYY-MM

  // Derive the date we will actually use/render for THIS month
  const effectiveDateISO =
    values.dateISO && values.dateISO.startsWith(monthId)
      ? values.dateISO
      : defaultDateISO;

  function update<K extends keyof typeof values>(
    key: K,
    val: (typeof values)[K],
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate using the effective date (not stale month)
    const parsed = txSchema.safeParse({
      ...values,
      dateISO: effectiveDateISO,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input');
      return;
    }

    const v = parsed.data;
    const cents = toCents(v.amount);

    if (cents <= 0) {
      setError('Enter a valid amount');
      return;
    }

    onAdd({
      type: v.type as TxType,
      amountCents: cents,
      category: v.category as Category,
      dateISO: v.dateISO, // effective date
      note: v.note?.trim() ? v.note.trim() : undefined,
    });

    setValues((prev) => ({ ...prev, amount: '', note: '' }));
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Type</label>
          <select
            className={styles.input}
            value={values.type}
            onChange={(e) => update('type', e.target.value as TxType)}
          >
            <option value='expense'>Expense</option>
            <option value='income'>Income</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Amount</label>
          <input
            className={styles.input}
            value={values.amount}
            onChange={(e) => update('amount', e.target.value)}
            inputMode='decimal'
            placeholder='0.00'
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Category</label>
          <select
            className={styles.input}
            value={values.category}
            onChange={(e) => update('category', e.target.value as Category)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Date</label>
          <input
            className={styles.input}
            type='date'
            value={effectiveDateISO}
            // user edits still go into stored state
            onChange={(e) => update('dateISO', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Note (optional)</label>
        <input
          className={styles.input}
          value={values.note ?? ''}
          onChange={(e) => update('note', e.target.value)}
          placeholder='e.g., groceries, paycheck…'
        />
      </div>

      {error ? <div className={styles.error}>{error}</div> : null}

      <button className={styles.button} type='submit'>
        Add
      </button>
    </form>
  );
}
