import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/categories';

const CustomTooltip = ({ active, payload }) => {
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
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{payload[0].name}</p>
        <p style={{ color: '#6B7280' }}>₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingByCategory({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card chart-card">
        <h3>Spending by Category</h3>
        <div className="empty-state" style={{ padding: '40px 20px' }}>
          <div className="empty-icon">📊</div>
          <p style={{ fontSize: 13 }}>No spending data yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card chart-card">
      <h3>Spending by Category</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontWeight: 500 }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
