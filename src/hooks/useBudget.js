import { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function useBudget() {
  const { transactions, budget, updateBudget } = useFinance();

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    return transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const date = parseISO(t.date);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const remaining = budget.monthlyBudget - currentMonthExpenses;
  const percentUsed = budget.monthlyBudget > 0
    ? Math.min((currentMonthExpenses / budget.monthlyBudget) * 100, 100)
    : 0;

  const status = percentUsed >= 90 ? 'danger' : percentUsed >= 70 ? 'warning' : 'safe';

  return {
    budget,
    updateBudget,
    totalSpent: currentMonthExpenses,
    remaining,
    percentUsed,
    status,
  };
}
