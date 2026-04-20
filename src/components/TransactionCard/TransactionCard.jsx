import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../../utils/currencyFormatter';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { HiArrowPath } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { CATEGORY_ICONS } from '../../utils/categories';

export default function TransactionCard({ transaction, onEdit, onDelete, index = 0 }) {
  const { title, amount, category, type, date, notes, recurring } = transaction;

  return (
    <motion.div
      className="transaction-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <div className="t-icon">
        {CATEGORY_ICONS[category] || '💰'}
      </div>
      <div className="t-details">
        <div className="t-title">
          {title}
          {recurring && (
            <span className="recurring-badge" style={{ marginLeft: 8 }}>
              <HiArrowPath size={10} /> Recurring
            </span>
          )}
        </div>
        <div className="t-meta">
          <span>{category}</span>
          <span>{format(parseISO(date), 'dd MMM yyyy')}</span>
          {notes && <span>{notes}</span>}
        </div>
      </div>
      <div className={`t-amount ${type}`}>
        {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
      </div>
      <div className="t-actions">
        <button className="btn-icon" onClick={() => onEdit(transaction)} title="Edit">
          <HiOutlinePencil size={16} />
        </button>
        <button className="btn-icon" onClick={() => onDelete(transaction.id)} title="Delete" style={{ color: 'var(--red)' }}>
          <HiOutlineTrash size={16} />
        </button>
      </div>
    </motion.div>
  );
}
