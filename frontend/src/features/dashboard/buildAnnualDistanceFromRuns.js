import { getRunDateKey } from './dashboardShared.js';

const annualDistanceBase = [
  { yearMonth: '2025-05', label: 'May', km: 75.3 },
  { yearMonth: '2025-06', label: 'Jun', km: 85.17 },
  { yearMonth: '2025-07', label: 'Jul', km: 97 },
  { yearMonth: '2025-08', label: 'Aug', km: 97.63 },
  { yearMonth: '2025-09', label: 'Sep', km: 159.26 },
  { yearMonth: '2025-10', label: 'Oct', km: 62.67 },
  { yearMonth: '2025-11', label: 'Nov', km: 130.96 },
  { yearMonth: '2025-12', label: 'Dec', km: 79.97 },
  { yearMonth: '2026-01', label: 'Jan', km: 59.44 },
  { yearMonth: '2026-02', label: 'Feb', km: 122.11 },
  { yearMonth: '2026-03', label: 'Mar', km: 126.14 },
];

function getYearMonthFromRunDate(rawDate) {
  return getRunDateKey(rawDate).slice(0, 7);
}

function roundDistance(distance) {
  return Math.round(distance * 100) / 100;
}

export function buildAnnualDistanceFromRuns(runs) {
  const april2026Distance = runs.reduce((totalDistance, run) => {
    if (getYearMonthFromRunDate(run.date) !== '2026-04') {
      return totalDistance;
    }

    return totalDistance + Number(run.distance_km);
  }, 0);

  return [
    ...annualDistanceBase,
    {
      yearMonth: '2026-04',
      label: 'Apr',
      km: roundDistance(april2026Distance),
    },
  ];
}
