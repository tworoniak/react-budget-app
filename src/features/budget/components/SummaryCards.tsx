import styles from './SummaryCards.module.scss';
import type { Transaction } from '../model/budget.types';
import {
  byCategoryExpenseCents,
  currencyFromCents,
  sumExpenseCents,
  sumIncomeCents,
} from '../model/budget.selectors';

type Props = { monthTx: Transaction[] };

export default function SummaryCards({ monthTx }: Props) {
  const income = sumIncomeCents(monthTx);
  const expense = sumExpenseCents(monthTx);
  const net = income - expense;

  const byCat = byCategoryExpenseCents(monthTx);
  const top = [...byCat.entries()].sort((a, b) => b[1] - a[1])[0];

  return (
    <section className={styles.row}>
      <div className={styles.card}>
        <div className={styles.kicker}>Income</div>
        <div className={styles.value}>{currencyFromCents(income)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.kicker}>Expenses</div>
        <div className={styles.value}>{currencyFromCents(expense)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.kicker}>Net</div>
        <div className={styles.value}>{currencyFromCents(net)}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.kicker}>Top category</div>
        <div className={styles.valueSmall}>
          {top ? (
            <>
              <strong>{top[0]}</strong> · {currencyFromCents(top[1])}
            </>
          ) : (
            <span className={styles.muted}>—</span>
          )}
        </div>
      </div>
    </section>
  );
}
