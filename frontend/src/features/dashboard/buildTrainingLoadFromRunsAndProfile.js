import { getRunDateKey } from './dashboardShared.js';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatLoadValue(value) {
  return value.toFixed(1);
}

const LOAD_SCALE = 0.36;

function buildRunLoad(run, profile) {
  const durationSeconds = Number(run.duration_seconds);
  const avgHr = Number(run.avg_hr);
  const hrRest = Number(profile.hr_rest);
  const hrMax = Number(profile.hr_max);

  if (!durationSeconds || durationSeconds <= 0) {
    return null;
  }

  if (!avgHr || !hrRest || !hrMax || hrRest >= hrMax) {
    return null;
  }

  const durationMin = durationSeconds / 60;
  const z1 = Number(run.zone_1_seconds) / 60;
  const z2 = Number(run.zone_2_seconds) / 60;
  const z3 = Number(run.zone_3_seconds) / 60;
  const z4 = Number(run.zone_4_seconds) / 60;
  const z5 = Number(run.zone_5_seconds) / 60;
  const totalZoneMin = z1 + z2 + z3 + z4 + z5;

  const rawRatio = (avgHr - hrRest) / (hrMax - hrRest);
  const ratio = clamp(rawRatio, 0, 1);
  const trimp = durationMin * ratio * Math.exp(1.92 * ratio);
  const zoneScoreBase = totalZoneMin > 0 ? totalZoneMin : durationMin;
  const epoLike = (z1 * 0.5 + z2 * 1 + z3 * 2 + z4 * 8 + z5 * 32) / zoneScoreBase;
  const zoneFactor = 1 + (epoLike - 1) * 0.3;
  const gradeFactor = 1 + (Number(run.elevation_m) / 1000) * 0.1;

  return trimp * zoneFactor * gradeFactor * LOAD_SCALE;
}

function buildDailyLoadMap(runs, profile) {
  return runs.reduce((dailyLoads, run) => {
    const runLoad = buildRunLoad(run, profile);

    if (runLoad === null) {
      return dailyLoads;
    }

    const runDateKey = getRunDateKey(run.date);
    return {
      ...dailyLoads,
      [runDateKey]: (dailyLoads[runDateKey] || 0) + runLoad,
    };
  }, {});
}

function buildDailyLoadSeries(dailyLoadMap) {
  const dateKeys = Object.keys(dailyLoadMap).sort();

  if (dateKeys.length === 0) {
    return [];
  }

  const startDate = new Date(`${dateKeys[0]}T00:00:00`);
  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const series = [];
  const cursor = new Date(startDate);

  while (cursor <= endDate) {
    const dateKey = getRunDateKey(cursor);

    series.push({
      dateKey,
      dailyLoad: dailyLoadMap[dateKey] || 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return series;
}

function buildTrainingLoadSeries(dailyLoadSeries) {
  let fitness = 0;
  let fatigue = 0;

  return dailyLoadSeries.map((day) => {
    const form = fitness - fatigue;

    fitness = fitness + (day.dailyLoad - fitness) / 42;
    fatigue = fatigue + (day.dailyLoad - fatigue) / 7;

    return {
      ...day,
      fitness,
      fatigue,
      form,
    };
  });
}

function buildTrainingLoadSeriesFromRunsAndProfile(runs, profile) {
  const dailyLoadMap = buildDailyLoadMap(runs, profile);
  const dailyLoadSeries = buildDailyLoadSeries(dailyLoadMap);

  return buildTrainingLoadSeries(dailyLoadSeries);
}

function formatChartDateLabel(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`);

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

export function buildTrainingLoadChartDataFromRunsAndProfile(runs, profile) {
  if (!profile?.hr_rest || !profile?.hr_max) {
    return [];
  }

  const trainingLoadSeries = buildTrainingLoadSeriesFromRunsAndProfile(runs, profile);

  return trainingLoadSeries.map((day) => ({
    ...day,
    label: formatChartDateLabel(day.dateKey),
    dailyLoad: Number(formatLoadValue(day.dailyLoad)),
    fitness: Number(formatLoadValue(day.fitness)),
    fatigue: Number(formatLoadValue(day.fatigue)),
    form: Number(formatLoadValue(day.form)),
  }));
}

export function buildTrainingLoadFromRunsAndProfile(runs, profile) {
  if (!profile?.hr_rest || !profile?.hr_max) {
    return {
      fatigueValue: '--',
      formValue: '--',
      fitnessValue: '--',
      loadValue: '--',
    };
  }

  const trainingLoadSeries = buildTrainingLoadSeriesFromRunsAndProfile(runs, profile);
  const dailyLoadMap = buildDailyLoadMap(runs, profile);
  const dailyLoadSeries = buildDailyLoadSeries(dailyLoadMap);

  if (trainingLoadSeries.length === 0) {
    return {
      fatigueValue: '0.0',
      formValue: '0.0',
      fitnessValue: '0.0',
      loadValue: '0.0',
    };
  }

  const latestDay = trainingLoadSeries[trainingLoadSeries.length - 1];

  return {
    fatigueValue: formatLoadValue(latestDay.fatigue),
    formValue: formatLoadValue(latestDay.form),
    fitnessValue: formatLoadValue(latestDay.fitness),
    loadValue: formatLoadValue(latestDay.dailyLoad),
  };
}
