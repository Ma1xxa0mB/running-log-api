import { normalizeRunDateToKey } from './calendarShared.js';

export function buildRunsByDate(runs) {
  return runs.reduce((runsByDate, run) => {
    const dateKey = normalizeRunDateToKey(run.date);
    const currentRuns = runsByDate[dateKey] || [];

    return {
      ...runsByDate,
      [dateKey]: [...currentRuns, run],
    };
  }, {});
}
