import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useFinance } from '../../context/FinanceContext';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, INCOME_CATEGORIES } from '../../utils/categories';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const schema = yup.object({
  title: yup.string().required('Title is required').min(2, 'At least 2 characters'),
  amount: yup.number().typeError('Enter a valid amount').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type: yup.string().oneOf(['income', 'expense']).required(),
  date: yup.string().required('Date is required'),
  notes: yup.string(),
  recurring: yup.boolean(),
});

export default function AddTransaction() {
  const { addTransaction } = useFinance();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      recurring: false,
    },
  });

  const txType = watch('type');
  const cats = txType === 'income' ? INCOME_CATEGORIES : CATEGORIES;

  const onSubmit = (data) => {
    addTransaction({ ...data, amount: Number(data.amount) });
    toast.success('Transaction added successfully!');
    navigate('/transactions');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h2>Add Transaction</h2>
        <p>Record a new income or expense entry.</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="tx-title">Title</label>
            <input id="tx-title" className="form-input" placeholder="e.g. Grocery Shopping" {...register('title')} />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-amount">Amount (₹)</label>
              <input id="tx-amount" className="form-input" type="number" placeholder="0" {...register('amount')} />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="tx-date">Date</label>
              <input id="tx-date" className="form-input" type="date" {...register('date')} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-type">Transaction Type</label>
              <select id="tx-type" className="form-select" {...register('type')}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="tx-category">Category</label>
              <select id="tx-category" className="form-select" {...register('category')}>
                <option value="">Select category</option>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="form-error">{errors.category.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tx-notes">Notes (optional)</label>
            <textarea id="tx-notes" className="form-textarea" placeholder="Add any details..." {...register('notes')} />
          </div>

          <label className="checkbox-label" style={{ marginBottom: 24 }}>
            <input type="checkbox" {...register('recurring')} />
            This is a recurring transaction
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              Add Transaction
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/transactions')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
