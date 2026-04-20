import { formatCurrency } from '../../utils/currencyFormatter';
import { motion } from 'framer-motion';

export default function BudgetCard({ budget, totalSpent, remaining, percentUsed, status }) {
  const barClass = status === 'danger' ? 'danger' : status === 'warning' ? 'warning' : '';

  return (
    <div className="card">
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Monthly Budget</h3>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green-dark)' }}>
        {formatCurrency(budget.monthlyBudget)}
      </div>
      <div className="budget-progress" style={{ marginTop: 20 }}>
        <div className="progress-bar-bg">
          <motion.div
            className={`progress-bar-fill ${barClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="budget-stats">
          <span>Spent: <strong>{formatCurrency(totalSpent)}</strong></span>
          <span>Remaining: <strong style={{ color: remaining < 0 ? 'var(--red)' : 'var(--green)' }}>{formatCurrency(Math.abs(remaining))}</strong></span>
          <span><strong>{percentUsed.toFixed(0)}%</strong> used</span>
        </div>
      </div>
    </div>
  );
}
