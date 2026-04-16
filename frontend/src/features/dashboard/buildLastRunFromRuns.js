import { formatDuration } from '../../utils/time.js';
import { formatDistanceValue, getRunDateKey } from './dashboardShared.js';

function formatLastRunType(runType) {
  const labels = {
    easy: 'Easy',
    long: 'Long',
    tempo: 'Tempo',
    vo2max: 'VO2 Max',
    sprint: 'Sprint',
    muscu: 'Muscu',
  };

  return labels[runType] || runType;
}

function formatLastRunSurface(surface) {
  const labels = {
    outdoor: 'Outdoor',
    treadmill: 'Treadmill',
  };

  return labels[surface] || surface;
}

function formatLastRunDate(rawDate) {
  const runDate = new Date(`${getRunDateKey(rawDate)}T00:00:00`);

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(runDate);
}

export function buildLastRunFromRuns(runs) {
  if (runs.length === 0) {
    return {
      type: '--',
      badgeTone: 'easy-dark',
      cardTone: 'easy',
      surface: '--',
      date: '--',
      distance: '--',
      duration: '--',
      elevation: '--',
      hr: '--',
    };
  }

  const sortedRuns = [...runs].sort((firstRun, secondRun) => {
    const firstDateKey = getRunDateKey(firstRun.date);
    const secondDateKey = getRunDateKey(secondRun.date);

    if (firstDateKey === secondDateKey) {
      return Number(secondRun.id) - Number(firstRun.id);
    }

    return firstDateKey < secondDateKey ? 1 : -1;
  });

  const latestRun = sortedRuns[0];

  return {
    type: formatLastRunType(latestRun.run_type),
    badgeTone: `${latestRun.run_type}-dark`,
    cardTone: latestRun.run_type,
    surface: formatLastRunSurface(latestRun.surface),
    date: formatLastRunDate(latestRun.date),
    distance: `${formatDistanceValue(Number(latestRun.distance_km))} km`,
    duration: formatDuration(latestRun.duration_seconds),
    elevation: `${latestRun.elevation_m} m`,
    hr: latestRun.avg_hr ? `${latestRun.avg_hr} bpm` : '--',
  };
}
