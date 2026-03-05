import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';

import { readJson, writeJson } from '../../lib/storage/storage';
import MonthPicker from './components/MonthPicker';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import TransactionsList from './components/TransactionsList';

import { DEFAULT_STATE, filterTxForMonth } from './model/budget.selectors';
import type { BudgetState, Transaction } from './model/budget.types';

const KEY = 'budget:v1';

function uid() {
  return (
    crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`
  );
}

export default function BudgetPage() {
  const [state, setState] = useState<BudgetState>(() =>
    readJson(KEY, DEFAULT_STATE),
  );

  useEffect(() => {
    writeJson(KEY, state);
  }, [state]);

  const monthTx = useMemo(
    () => filterTxForMonth(state.transactions, state.monthId),
    [state.transactions, state.monthId],
  );

  function addTransaction(next: Omit<Transaction, 'id' | 'createdAt'>) {
    setState((prev) => ({
      ...prev,
      transactions: [
        { ...next, id: uid(), createdAt: Date.now() },
        ...prev.transactions,
      ],
    }));
  }

  function deleteTransaction(id: string) {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }

  // handy default date inside current month
  const defaultDateISO = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (today.startsWith(state.monthId)) return today;
    return `${state.monthId}-01`;
  }, [state.monthId]);

  return (
    <div className='page'>
      <header className='header'>
        <div className='header__inner'>
          <div>
            <h1 className='h1'>Budget Tracker</h1>
            <p className='subtle'>React + TS + Vite + Sass • v1 (local)</p>
          </div>

          <MonthPicker
            monthId={state.monthId}
            onChange={(monthId) => setState((p) => ({ ...p, monthId }))}
          />
        </div>
      </header>

      <main className='container'>
        <SummaryCards monthTx={monthTx} />

        <section className='grid'>
          <div className='card'>
            <h2 className='h2'>Add transaction</h2>
            <TransactionForm
              defaultDateISO={defaultDateISO}
              onAdd={addTransaction}
            />
          </div>

          <div className='card'>
            <h2 className='h2'>This month</h2>
            <TransactionsList tx={monthTx} onDelete={deleteTransaction} />
          </div>
        </section>
      </main>
    </div>
  );
}
