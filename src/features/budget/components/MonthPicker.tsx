import styles from './MonthPicker.module.scss';

type Props = {
  monthId: string; // YYYY-MM
  onChange: (monthId: string) => void;
};

export default function MonthPicker({ monthId, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <label className={styles.label}>Month</label>
      <input
        className={styles.input}
        type='month'
        value={monthId}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
