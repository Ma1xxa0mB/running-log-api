import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const annualDistanceData = [
  { month: 'Jan', km: 120 },
  { month: 'Feb', km: 98 },
  { month: 'Mar', km: 135 },
  { month: 'Apr', km: 88 },
  { month: 'May', km: 142 },
  { month: 'Jun', km: 110 },
  { month: 'Jul', km: 80 },
  { month: 'Aug', km: 125 },
  { month: 'Sep', km: 95 },
  { month: 'Oct', km: 130 },
  { month: 'Nov', km: 105 },
  { month: 'Dec', km: 140 },
];

function ChartDashboard() {
  return (
    <section className="dashboard-card dashboard-card--chart">
      <h3 className="card-title">Annual Distance</h3>
      <div className="chart-placeholder">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={annualDistanceData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Bar dataKey="km" fill="#1f96da" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartDashboard;
