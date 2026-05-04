import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 10,
        border: '1px solid #E8E2DA',
        padding: '10px 14px',
        fontSize: 13,
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color, marginBottom: 1 }}>
            {entry.name}: ₹{entry.value.toLocaleString('en-IN')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function IncomeVsExpense({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card chart-card">
      <h3>Income vs Expense</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={6} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DA" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="income" name="Income" fill="#00704A" radius={[6,6,0,0]} />
          <Bar dataKey="expense" name="Expense" fill="#967259" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
