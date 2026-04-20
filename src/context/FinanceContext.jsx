import { createContext, useState, useEffect, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

const FinanceContext = createContext();

const STORAGE_KEY = 'expensio_transactions';
const BUDGET_KEY = 'expensio_budget';

const seedTransactions = [
  { id: uuidv4(), title: 'Freelance Payment', amount: 45000, category: 'Salary', type: 'income', date: '2026-04-18', notes: 'Web dev project', recurring: false },
  { id: uuidv4(), title: 'Monthly Salary', amount: 65000, category: 'Salary', type: 'income', date: '2026-04-01', notes: 'April salary', recurring: true },
  { id: uuidv4(), title: 'Zomato Order', amount: 450, category: 'Food', type: 'expense', date: '2026-04-19', notes: 'Dinner', recurring: false },
  { id: uuidv4(), title: 'Netflix Subscription', amount: 649, category: 'Subscriptions', type: 'expense', date: '2026-04-05', notes: 'Monthly plan', recurring: true },
  { id: uuidv4(), title: 'House Rent', amount: 15000, category: 'Rent', type: 'expense', date: '2026-04-01', notes: 'April rent', recurring: true },
  { id: uuidv4(), title: 'Grocery Shopping', amount: 3200, category: 'Food', type: 'expense', date: '2026-04-15', notes: 'Weekly groceries', recurring: false },
  { id: uuidv4(), title: 'Uber Rides', amount: 850, category: 'Travel', type: 'expense', date: '2026-04-12', notes: 'Office commute', recurring: false },
  { id: uuidv4(), title: 'Gym Membership', amount: 2000, category: 'Health', type: 'expense', date: '2026-04-02', notes: 'Monthly gym', recurring: true },
  { id: uuidv4(), title: 'Electricity Bill', amount: 1800, category: 'Utilities', type: 'expense', date: '2026-04-10', notes: 'April bill', recurring: true },
  { id: uuidv4(), title: 'Amazon Shopping', amount: 4500, category: 'Shopping', type: 'expense', date: '2026-04-08', notes: 'Headphones', recurring: false },
  { id: uuidv4(), title: 'Movie Tickets', amount: 600, category: 'Entertainment', type: 'expense', date: '2026-04-14', notes: 'Weekend movie', recurring: false },
  { id: uuidv4(), title: 'Spotify Premium', amount: 119, category: 'Subscriptions', type: 'expense', date: '2026-04-05', notes: 'Music streaming', recurring: true },
  { id: uuidv4(), title: 'Train Tickets', amount: 1200, category: 'Travel', type: 'expense', date: '2026-04-07', notes: 'Trip home', recurring: false },
  { id: uuidv4(), title: 'Freelance Gig', amount: 12000, category: 'Salary', type: 'income', date: '2026-03-28', notes: 'Logo design', recurring: false },
  { id: uuidv4(), title: 'Coffee & Snacks', amount: 320, category: 'Food', type: 'expense', date: '2026-04-17', notes: 'Starbucks', recurring: false },
  { id: uuidv4(), title: 'Internet Bill', amount: 999, category: 'Utilities', type: 'expense', date: '2026-04-10', notes: 'Broadband', recurring: true },
  { id: uuidv4(), title: 'March Salary', amount: 65000, category: 'Salary', type: 'income', date: '2026-03-01', notes: 'March salary', recurring: true },
  { id: uuidv4(), title: 'Dining Out', amount: 1800, category: 'Food', type: 'expense', date: '2026-03-20', notes: 'Birthday dinner', recurring: false },
  { id: uuidv4(), title: 'Shoes', amount: 3500, category: 'Shopping', type: 'expense', date: '2026-03-15', notes: 'Running shoes', recurring: false },
];

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : seedTransactions;
  });

  const [budget, setBudget] = useState(() => {
    const stored = localStorage.getItem(BUDGET_KEY);
    return stored ? JSON.parse(stored) : { monthlyBudget: 50000 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction) => {
    const newTx = { ...transaction, id: uuidv4() };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const updateTransaction = (id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (newBudget) => {
    setBudget(newBudget);
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      budget,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateBudget,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};

export default FinanceContext;
