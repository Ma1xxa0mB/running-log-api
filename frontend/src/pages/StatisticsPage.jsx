import { useEffect, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchCurrentUser } from '../api/userApi.js';
import { fetchRuns } from '../api/runsApi.js';
import { buildTrainingLoadChartDataFromRunsAndProfile } from '../features/dashboard/buildTrainingLoadFromRunsAndProfile.js';

function StatisticsPage() {
  const [runs, setRuns] = useState([]);
  const [runsLoading, setRunsLoading] = useState(true);
  const [runsError, setRunsError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [currentUserError, setCurrentUserError] = useState('');

  useEffect(() => {
    async function loadRuns() {
      try {
        const result = await fetchRuns();
        setRuns(result);
      } catch (error) {
        setRunsError(error.message);
      } finally {
        setRunsLoading(false);
      }
    }

    loadRuns();
  }, []);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        setCurrentUserError(error.message);
      } finally {
        setCurrentUserLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  if (runsLoading || currentUserLoading) {
    return (
      <section className="page-card">
        <div className="statistics-page-card">
          <p className="runs-page-feedback">Loading statistics...</p>
        </div>
      </section>
    );
  }

  if (runsError || currentUserError) {
    return (
      <section className="page-card">
        <div className="statistics-page-card">
          <p className="form-feedback form-feedback--error">{runsError || currentUserError}</p>
        </div>
      </section>
    );
  }

  if (!currentUser?.hr_rest || !currentUser?.hr_max) {
    return (
      <section className="page-card">
        <div className="statistics-page-card">
          <div className="form-page-header">
            <h2>Statistics</h2>
            <p className="form-page-description">
              Add your resting HR and max HR in Account before building the training-load graph.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const chartData = buildTrainingLoadChartDataFromRunsAndProfile(runs, currentUser);

  return (
    <section className="page-card">
      <div className="statistics-page-card">
        <h2>Statistics</h2>

        {chartData.length === 0 ? (
          <p className="runs-page-feedback">No chart data yet for this account.</p>
        ) : (
          <div className="statistics-chart-shell">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid vertical={false} stroke="rgba(31, 42, 46, 0.08)" />
                <XAxis
                  dataKey="label"
                  minTickGap={24}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#5f6b6f', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  yAxisId="left"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#5f6b6f', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#5f6b6f', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid rgba(31, 42, 46, 0.08)',
                    background: 'rgba(252, 249, 243, 0.96)',
                    boxShadow: '0 18px 36px rgba(31, 42, 46, 0.10)',
                  }}
                  labelStyle={{ color: '#1f2a2e', fontWeight: 700 }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '12px', fontWeight: 700 }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="dailyLoad"
                  name="Daily Load"
                  fill="#92A996"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fatigue"
                  name="ATL"
                  stroke="#B96A52"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fitness"
                  name="CTL"
                  stroke="#627A96"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="form"
                  name="TSB"
                  stroke="#5A7450"
                  strokeWidth={2.5}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

export default StatisticsPage;
