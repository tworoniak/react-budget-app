import styles from './TransactionsList.module.scss';
import type { Transaction } from '../model/budget.types';
import { currencyFromCents } from '../model/budget.selectors';

type Props = {
  tx: Transaction[];
  onDelete: (id: string) => void;
};

export default function TransactionsList({ tx, onDelete }: Props) {
  if (!tx.length) return <p className={styles.empty}>No transactions yet.</p>;

  return (
    <ul className={styles.list}>
      {tx.map((t) => (
        <li key={t.id} className={styles.row}>
          <div className={styles.main}>
            <div className={styles.top}>
              <span className={styles.badge} data-type={t.type}>
                {t.type}
              </span>
              <span className={styles.category}>{t.category}</span>
              <span className={styles.date}>{t.dateISO}</span>
            </div>

            {t.note ? <div className={styles.note}>{t.note}</div> : null}
          </div>

          <div className={styles.right}>
            <div className={styles.amount} data-type={t.type}>
              {t.type === 'expense' ? '-' : '+'}
              {currencyFromCents(t.amountCents)}
            </div>
            <button
              className={styles.delete}
              type='button'
              onClick={() => onDelete(t.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
