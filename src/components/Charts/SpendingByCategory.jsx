import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/categories';

export default function SpendingByCategory({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card chart-card">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
            contentStyle={{ borderRadius: 8, border: '1px solid #E8E2DA', fontSize: 13 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
