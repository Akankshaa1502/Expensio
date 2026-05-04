import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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
        <p style={{ fontWeight: 600, marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#00704A' }}>₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

export default function MonthlyTrend({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="card chart-card">
      <h3>Monthly Spending Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00704A" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#00704A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8E2DA" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#00704A"
            strokeWidth={2.5}
            fill="url(#areaGradient)"
            dot={{ fill: '#00704A', r: 4, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#00704A', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
