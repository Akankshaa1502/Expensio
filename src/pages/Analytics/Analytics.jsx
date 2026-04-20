import { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';
import { useCurrency } from '../../hooks/useCurrency';
import { motion } from 'framer-motion';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash, HiOutlineGlobeAlt } from 'react-icons/hi';
import SpendingByCategory from '../../components/Charts/SpendingByCategory';
import MonthlyTrend from '../../components/Charts/MonthlyTrend';
import IncomeVsExpense from '../../components/Charts/IncomeVsExpense';

export default function Analytics() {
  const { transactions } = useFinance();
  const { convert, loading: ratesLoading } = useCurrency();

  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { totalIncome, totalExpenses, net: totalIncome - totalExpenses };
  }, [transactions]);

  const usdEquivalent = convert ? convert(stats.net, 'USD') : null;

  const categoryData = useMemo(() => {
    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    return Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const ms = startOfMonth(d);
      const me = endOfMonth(d);
      const total = transactions
        .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: ms, end: me }))
        .reduce((s, t) => s + t.amount, 0);
      months.push({ month: format(d, 'MMM'), amount: total });
    }
    return months;
  }, [transactions]);

  const incomeVsExpenseData = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const ms = startOfMonth(d);
      const me = endOfMonth(d);
      const monthTx = transactions.filter(t => isWithinInterval(parseISO(t.date), { start: ms, end: me }));
      months.push({
        month: format(d, 'MMM'),
        income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }
    return months;
  }, [transactions]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="page-header">
        <h2>Analytics</h2>
        <p>Deep dive into your financial patterns and trends.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'All-time Income', value: formatCurrency(stats.totalIncome), icon: <HiOutlineTrendingUp />, color: 'green' },
          { label: 'All-time Expenses', value: formatCurrency(stats.totalExpenses), icon: <HiOutlineTrendingDown />, color: 'red' },
          { label: 'Net Balance', value: formatCurrency(stats.net), icon: <HiOutlineCash />, color: 'blue' },
          { label: 'Balance (USD)', value: ratesLoading ? 'Loading...' : usdEquivalent ? `$${Number(usdEquivalent).toLocaleString()}` : '—', icon: <HiOutlineGlobeAlt />, color: 'brown' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="card stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <h4>{stat.label}</h4>
              <p>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <SpendingByCategory data={categoryData} />
        <MonthlyTrend data={monthlyTrendData} />
      </div>

      <div style={{ marginTop: 20 }}>
        <IncomeVsExpense data={incomeVsExpenseData} />
      </div>
    </motion.div>
  );
}
