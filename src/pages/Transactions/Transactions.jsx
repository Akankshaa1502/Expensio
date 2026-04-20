import { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useFinance } from '../../context/FinanceContext';
import TransactionCard from '../../components/TransactionCard/TransactionCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import EditModal from './EditModal';
import { Link } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function Transactions() {
  const {
    transactions, searchQuery, setSearchQuery,
    categoryFilter, setCategoryFilter,
    typeFilter, setTypeFilter,
    dateFrom, setDateFrom, dateTo, setDateTo,
    sortBy, setSortBy,
    deleteTransaction,
  } = useTransactions();

  const { updateTransaction } = useFinance();
  const [editingTx, setEditingTx] = useState(null);

  const handleDelete = (id) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

  const handleEdit = (tx) => setEditingTx(tx);

  const handleUpdate = (data) => {
    updateTransaction(editingTx.id, { ...data, amount: Number(data.amount) });
    setEditingTx(null);
    toast.success('Transaction updated');
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2>Transactions</h2>
          <p>{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/transactions/new" className="btn btn-primary">
          <HiOutlinePlus /> Add New
        </Link>
      </div>

      <div className="toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <Filters
        categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      <div className="transaction-list" style={{ marginTop: 8 }}>
        {transactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No transactions found</h3>
            <p>Try adjusting your filters or add a new transaction.</p>
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((t, i) => (
              <TransactionCard
                key={t.id}
                transaction={t}
                index={i}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        )}
      </div>

      {editingTx && (
        <EditModal
          transaction={editingTx}
          onClose={() => setEditingTx(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
