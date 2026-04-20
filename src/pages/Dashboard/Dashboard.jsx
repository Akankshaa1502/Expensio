import { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useBudget } from '../../hooks/useBudget';
import { formatCurrency } from '../../utils/currencyFormatter';
import { parseISO, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { motion } from 'framer-motion';
import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineCash, HiOutlineStar } from 'react-icons/hi';
import BudgetCard from '../../components/BudgetCard/BudgetCard';
import SpendingByCategory from '../../components/Charts/SpendingByCategory';
import TransactionCard from '../../components/TransactionCard/TransactionCard';

export default function Dashboard() {
  const { transactions } = useFinance();
  const { budget, totalSpent, remaining, percentUsed, status } = useBudget();

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonth = transactions.filter(t => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    });

    const totalIncome = thisMonth.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    // Top category
    const catMap = {};
    thisMonth.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

    return { totalIncome, totalExpenses, netBalance, topCategory };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const catMap = {};
    transactions
      .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: monthStart, end: monthEnd }))
      .forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
    return Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => parseISO(b.date) - parseISO(a.date)).slice(0, 5);
  }, [transactions]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  };

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Welcome back! Here's your financial overview for {format(new Date(), 'MMMM yyyy')}.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Income', value: formatCurrency(stats.totalIncome), icon: <HiOutlineTrendingUp />, color: 'green' },
          { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: <HiOutlineTrendingDown />, color: 'red' },
          { label: 'Net Balance', value: formatCurrency(stats.netBalance), icon: <HiOutlineCash />, color: 'blue' },
          { label: 'Top Category', value: stats.topCategory ? stats.topCategory[0] : '—', icon: <HiOutlineStar />, color: 'brown' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="card stat-card" custom={i} initial="hidden" animate="visible" variants={cardVariants}>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <h4>{stat.label}</h4>
              <p>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="charts-grid">
        <BudgetCard budget={budget} totalSpent={totalSpent} remaining={remaining} percentUsed={percentUsed} status={status} />
        <SpendingByCategory data={categoryData} />
      </div>

      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Recent Transactions</h3>
        <div className="transaction-list">
          {recentTransactions.map((t, i) => (
            <TransactionCard key={t.id} transaction={t} index={i} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}
