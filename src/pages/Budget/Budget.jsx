import { useState } from 'react';
import { useBudget } from '../../hooks/useBudget';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { HiOutlinePencil, HiOutlineCheck } from 'react-icons/hi';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { CATEGORY_ICONS } from '../../utils/categories';

export default function Budget() {
  const { budget, totalSpent, remaining, percentUsed, status, updateBudget } = useBudget();
  const { transactions } = useFinance();
  const [editing, setEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(budget.monthlyBudget);

  const handleSave = () => {
    updateBudget({ monthlyBudget: Number(newBudget) });
    setEditing(false);
    toast.success('Budget updated!');
  };

  // Category breakdown for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const monthExpenses = transactions.filter(t =>
    t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd })
  );
  const catBreakdown = {};
  monthExpenses.forEach(t => { catBreakdown[t.category] = (catBreakdown[t.category] || 0) + t.amount; });
  const sortedCats = Object.entries(catBreakdown).sort((a, b) => b[1] - a[1]);

  // Recurring expenses
  const recurringExpenses = transactions.filter(t => t.recurring && t.type === 'expense');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h2>Budget</h2>
        <p>Track your monthly spending against your budget for {format(now, 'MMMM yyyy')}.</p>
      </div>

      <div style={{ maxWidth: 640, marginBottom: 28 }}>
        <BudgetCard budget={budget} totalSpent={totalSpent} remaining={remaining} percentUsed={percentUsed} status={status} />

        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Set Monthly Budget</h3>
            {!editing ? (
              <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
                <HiOutlinePencil size={14} /> Edit
              </button>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                <HiOutlineCheck size={14} /> Save
              </button>
            )}
          </div>
          {editing ? (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                className="form-input"
                type="number"
                value={newBudget}
                onChange={e => setNewBudget(e.target.value)}
                placeholder="Enter monthly budget"
              />
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Your current monthly budget is <strong>{formatCurrency(budget.monthlyBudget)}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: 0 }}>
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Category Breakdown</h3>
          {sortedCats.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No expenses this month.</p>
          ) : (
            sortedCats.map(([cat, amt]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
                  {CATEGORY_ICONS[cat] || '📎'} {cat}
                </span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{formatCurrency(amt)}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Recurring Expenses</h3>
          {recurringExpenses.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No recurring expenses found.</p>
          ) : (
            recurringExpenses.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[t.category] || '📎'} {t.title}</span>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--red)' }}>-{formatCurrency(t.amount)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
