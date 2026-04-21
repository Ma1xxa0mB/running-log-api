import { formatDuration } from '../../utils/time.js';

function formatRunTypeLabel(runType) {
  const labels = {
    easy: 'Easy',
    long: 'Long',
    tempo: 'Tempo',
    vo2max: 'VO2 Max',
    sprint: 'Sprint',
  };

  return labels[runType] || runType;
}

function formatSurfaceLabel(surface) {
  const labels = {
    outdoor: 'Outdoor',
    treadmill: 'Treadmill',
  };

  return labels[surface] || surface;
}

export function buildCalendarCells(visibleDates, runsByDate) {
  return visibleDates.map((visibleDate) => {
    const dayRuns = runsByDate[visibleDate.dateKey] || [];

    return {
      ...visibleDate,
      hasRuns: dayRuns.length > 0,
      runs: dayRuns.map((run) => {
        if (run.activityType === 'strength') {
          return {
            id: run.id,
            activityType: 'strength',
            runType: 'strength',
            runTypeLabel: 'Strength',
            surfaceLabel: '',
            distance: '',
            duration: formatDuration(run.duration_seconds),
          };
        }

        return {
          id: run.id,
          activityType: 'run',
          runType: run.run_type,
          runTypeLabel: formatRunTypeLabel(run.run_type),
          surfaceLabel: formatSurfaceLabel(run.surface),
          distance: `${Number(run.distance_km).toFixed(2)} km`,
          duration: formatDuration(run.duration_seconds),
        };
      }),
    };
  });
}
