import { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useDebounce } from './useDebounce';
import { parseISO, isWithinInterval, compareDesc, compareAsc } from 'date-fns';

export function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Date range filter
    if (dateFrom && dateTo) {
      result = result.filter(t => {
        const date = parseISO(t.date);
        return isWithinInterval(date, {
          start: parseISO(dateFrom),
          end: parseISO(dateTo),
        });
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? compareDesc(parseISO(a.date), parseISO(b.date))
          : compareAsc(parseISO(a.date), parseISO(b.date));
      }
      if (sortBy === 'amount') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
      if (sortBy === 'category') {
        const cmp = a.category.localeCompare(b.category);
        return sortOrder === 'desc' ? -cmp : cmp;
      }
      return 0;
    });

    return result;
  }, [transactions, debouncedSearch, categoryFilter, typeFilter, dateFrom, dateTo, sortBy, sortOrder]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    searchQuery, setSearchQuery,
    categoryFilter, setCategoryFilter,
    typeFilter, setTypeFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
