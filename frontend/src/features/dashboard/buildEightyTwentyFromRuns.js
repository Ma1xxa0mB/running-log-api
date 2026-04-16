import { formatDateKey, getRunDateKey } from './dashboardShared.js';

function getRollingSevenDayStart(currentDate) {
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0);

  return startDate;
}

function formatPercent(value) {
  return `${Math.round(value)}%`;
}

export function buildEightyTwentyFromRuns(runs) {
  const today = new Date();
  const startDate = getRollingSevenDayStart(today);
  const todayKey = formatDateKey(today);
  const startDateKey = formatDateKey(startDate);

  const periodRuns = runs.filter((run) => {
    const runDateKey = getRunDateKey(run.date);

    return runDateKey >= startDateKey && runDateKey <= todayKey;
  });

  const zoneTotals = periodRuns.reduce(
    (summary, run) => ({
      zone1: summary.zone1 + Number(run.zone_1_seconds),
      zone2: summary.zone2 + Number(run.zone_2_seconds),
      zone3: summary.zone3 + Number(run.zone_3_seconds),
      zone4: summary.zone4 + Number(run.zone_4_seconds),
      zone5: summary.zone5 + Number(run.zone_5_seconds),
    }),
    {
      zone1: 0,
      zone2: 0,
      zone3: 0,
      zone4: 0,
      zone5: 0,
    }
  );

  const easySeconds = zoneTotals.zone1 + zoneTotals.zone2;
  const moderateSeconds = zoneTotals.zone3;
  const hardSeconds = zoneTotals.zone4 + zoneTotals.zone5;
  const totalSeconds = periodRuns.reduce(
    (summary, run) => summary + Number(run.duration_seconds),
    0
  );

  if (totalSeconds === 0) {
    return {
      label: 'Last 7 days',
      easyPercent: '0%',
      moderatePercent: '0%',
      hardPercent: '0%',
    };
  }

  return {
    label: 'Last 7 days',
    easyPercent: formatPercent((easySeconds / totalSeconds) * 100),
    moderatePercent: formatPercent((moderateSeconds / totalSeconds) * 100),
    hardPercent: formatPercent((hardSeconds / totalSeconds) * 100),
  };
}
