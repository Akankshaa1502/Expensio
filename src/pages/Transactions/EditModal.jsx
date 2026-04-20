import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories';
import { HiOutlineX } from 'react-icons/hi';
import { motion } from 'framer-motion';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  amount: yup.number().typeError('Enter a valid amount').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

export default function EditModal({ transaction, onClose, onSave }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: transaction.title,
      amount: transaction.amount,
      category: transaction.category,
      type: transaction.type,
      date: transaction.date,
      notes: transaction.notes || '',
      recurring: transaction.recurring || false,
    },
  });

  const txType = watch('type');
  const cats = txType === 'income' ? INCOME_CATEGORIES : CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="modal-header">
          <h3>Edit Transaction</h3>
          <button className="btn-icon" onClick={onClose}><HiOutlineX size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSave)}>
          <div className="form-group">
            <label>Title</label>
            <input className="form-input" {...register('title')} />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input className="form-input" type="number" {...register('amount')} />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
            <div className="form-group">
              <label>Date</label>
              <input className="form-input" type="date" {...register('date')} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select className="form-select" {...register('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" {...register('category')}>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea className="form-textarea" {...register('notes')} />
          </div>
          <label className="checkbox-label" style={{ marginBottom: 20 }}>
            <input type="checkbox" {...register('recurring')} />
            Recurring transaction
          </label>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
