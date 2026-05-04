import { formatCurrency } from '../../utils/currencyFormatter';
import { motion } from 'framer-motion';
import { HiOutlineCurrencyDollar } from 'react-icons/hi';

export default function BudgetCard({ budget, totalSpent, remaining, percentUsed, status }) {
  const barClass = status === 'danger' ? 'danger' : status === 'warning' ? 'warning' : '';

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div className="stat-icon green" style={{ width: 36, height: 36, fontSize: 18 }}>
          <HiOutlineCurrencyDollar />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--green-dark)' }}>Monthly Budget</h3>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--green-dark)', letterSpacing: '-1px' }}>
        {formatCurrency(budget.monthlyBudget)}
      </div>
      <div className="budget-progress" style={{ marginTop: 20 }}>
        <div className="progress-bar-bg">
          <motion.div
            className={`progress-bar-fill ${barClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentUsed, 100)}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
