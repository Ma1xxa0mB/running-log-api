import { formatDuration } from '../../utils/time.js';
import { formatDateKey, formatDistanceValue, getRunDateKey } from './dashboardShared.js';

function getStartOfWeek(currentDate) {
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  return startOfWeek;
}

export function buildWeekSummaryFromRuns(runs) {
  // STEP 3
  // ACTION: BUILD
  // DATA: FEATURE DATA
  // NAME: startOfWeek
  // TYPE: date
  // CODE ORIGIN: getStartOfWeek(today)
  const today = new Date();
  const startOfWeek = getStartOfWeek(today);
  const todayKey = formatDateKey(today);
  const startOfWeekKey = formatDateKey(startOfWeek);

  // STEP 4
  // ACTION: FILTER
  // DATA: FEATURE DATA
  // NAME: weekRuns
  // TYPE: array of run objects
  // CODE ORIGIN: runs.filter(...)
  const weekRuns = runs.filter((run) => {
    const runDateKey = getRunDateKey(run.date);

    return runDateKey >= startOfWeekKey && runDateKey <= todayKey;
  });

  // STEP 5, STEP 6, STEP 7
  // ACTION: AGGREGATE
  // DATA: FEATURE DATA
  // NAME: totals
  // TYPE: object
  // CODE ORIGIN: weekRuns.reduce(...)
  const totals = weekRuns.reduce(
    (summary, run) => ({
      distance: summary.distance + Number(run.distance_km),
      duration: summary.duration + Number(run.duration_seconds),
      elevation: summary.elevation + Number(run.elevation_m),
    }),
    {
      distance: 0,
      duration: 0,
      elevation: 0,
    }
  );

  // STEP 8, STEP 9
  // ACTION: TRANSFORM then BUILD
  // DATA: FEATURE DATA
  // NAME: weekSummary
  // TYPE: object
  // CODE ORIGIN: buildWeekSummaryFromRuns(runs)
  return {
    distanceValue: formatDistanceValue(totals.distance),
    distanceUnit: 'km',
    durationValue: formatDuration(totals.duration),
    elevationValue: String(totals.elevation),
    elevationUnit: 'm',
  };
}
