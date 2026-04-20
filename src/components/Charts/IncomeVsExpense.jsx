import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function IncomeVsExpense({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card chart-card">
      <h3>Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DA" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #E8E2DA', fontSize: 13 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="income" name="Income" fill="#00704A" radius={[4,4,0,0]} />
          <Bar dataKey="expense" name="Expense" fill="#967259" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
