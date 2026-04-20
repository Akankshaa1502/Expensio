import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyTrend({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card chart-card">
      <h3>Monthly Spending Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DA" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Expenses']}
            contentStyle={{ borderRadius: 8, border: '1px solid #E8E2DA', fontSize: 13 }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#00704A"
            strokeWidth={2.5}
            dot={{ fill: '#00704A', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
