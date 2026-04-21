import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ChartDashboard({ chartData }) {
  return (
    <section className="dashboard-card dashboard-card--chart">
      <h3 className="card-title">Annual Distance</h3>
      <div className="chart-placeholder chart-placeholder--annual-distance">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} stroke="rgba(31, 42, 46, 0.08)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5f6b6f', fontSize: 12, fontWeight: 600 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#5f6b6f', fontSize: 12, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(143, 184, 176, 0.12)' }}
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid rgba(31, 42, 46, 0.08)',
                background: 'rgba(252, 249, 243, 0.96)',
                boxShadow: '0 18px 36px rgba(31, 42, 46, 0.10)',
              }}
              labelStyle={{ color: '#1f2a2e', fontWeight: 700 }}
              formatter={(value) => [`${Number(value).toFixed(2)} km`, 'Distance']}
            />
            <Bar dataKey="km" fill="var(--color-chart-bar)" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartDashboard;
