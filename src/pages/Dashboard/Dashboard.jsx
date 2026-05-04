import { useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const { budget, totalSpent, remaining, percentUsed, status } = useBudget();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="page-header" variants={itemVariants}>
        <h2>{greeting}, <span className="greeting-name">{displayName}</span> 👋</h2>
        <p>Here's your financial overview for {format(new Date(), 'MMMM yyyy')}.</p>
      </motion.div>

      <motion.div className="stats-grid" variants={itemVariants}>
        {[
          { label: 'Total Income', value: formatCurrency(stats.totalIncome), icon: <HiOutlineTrendingUp />, color: 'green' },
          { label: 'Total Expenses', value: formatCurrency(stats.totalExpenses), icon: <HiOutlineTrendingDown />, color: 'red' },
          { label: 'Net Balance', value: formatCurrency(stats.netBalance), icon: <HiOutlineCash />, color: 'blue' },
          { label: 'Top Category', value: stats.topCategory ? stats.topCategory[0] : '—', icon: <HiOutlineStar />, color: 'brown' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="card stat-card"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <h4>{stat.label}</h4>
              <p>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div className="charts-grid" variants={itemVariants}>
        <BudgetCard budget={budget} totalSpent={totalSpent} remaining={remaining} percentUsed={percentUsed} status={status} />
        <SpendingByCategory data={categoryData} />
      </motion.div>

      <motion.div style={{ marginTop: 28 }} variants={itemVariants}>
        <div className="section-title">
          Recent Transactions
          <span className="section-count">{recentTransactions.length}</span>
        </div>
        <div className="transaction-list">
          {recentTransactions.map((t, i) => (
            <TransactionCard key={t.id} transaction={t} index={i} onEdit={() => {}} onDelete={() => {}} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
