const allowedRunTypes = ['easy', 'long', 'tempo', 'vo2max', 'sprint', 'muscu'];
const allowedSurfaces = ['outdoor', 'treadmill'];
const runTypesRequiringLabel = ['tempo', 'vo2max', 'sprint', 'muscu'];

function parseNumber(value) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    return Number(value);
  }

  return Number.NaN;
}

function parseInteger(value) {
  const parsedValue = parseNumber(value);

  if (!Number.isInteger(parsedValue)) {
    return Number.NaN;
  }

  return parsedValue;
}

function validateRun(body) {
  const {
    date,
    distance_km,
    duration_minutes,
    elevation_m,
    run_type,
    run_label,
    avg_pace_min_km,
    avg_hr,
    max_hr,
    avg_temperature_c,
    surface
  } = body;

  if (
    !date ||
    distance_km === '' ||
    duration_minutes === '' ||
    elevation_m === '' ||
    !run_type ||
    !avg_pace_min_km ||
    avg_hr === '' ||
    max_hr === '' ||
    avg_temperature_c === '' ||
    !surface
  ) {
    return 'date, distance_km, duration_minutes, elevation_m, run_type, avg_pace_min_km, avg_hr, max_hr, avg_temperature_c and surface are required';
  }

  if (runTypesRequiringLabel.includes(run_type) && !run_label) {
    return 'run_label is required for qualitative run types';
  }

  const parsedDistance = parseNumber(distance_km);
  const parsedDuration = parseInteger(duration_minutes);
  const parsedElevation = parseInteger(elevation_m);
  const parsedAvgHr = parseInteger(avg_hr);
  const parsedMaxHr = parseInteger(max_hr);
  const parsedAvgTemperature = parseNumber(avg_temperature_c);

  if (!date) {
    return 'date is required';
  }

  if (Number.isNaN(Date.parse(date))) {
    return 'date must be a valid date';
  }

  if (!Number.isFinite(parsedDistance) || parsedDistance <= 0) {
    return 'distance_km must be a positive number';
  }

  if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
    return 'duration_minutes must be a positive integer';
  }

  if (Number.isNaN(parsedElevation) || parsedElevation < 0) {
    return 'elevation_m must be a positive integer or zero';
  }

  if (!allowedRunTypes.includes(run_type)) {
    return 'run_type must be one of: easy, long, tempo, vo2max, sprint, muscu';
  }

  if (typeof avg_pace_min_km !== 'string' || avg_pace_min_km.trim() === '') {
    return 'avg_pace_min_km is required';
  }

  if (Number.isNaN(parsedAvgHr) || parsedAvgHr <= 0) {
    return 'avg_hr must be a positive integer';
  }

  if (Number.isNaN(parsedMaxHr) || parsedMaxHr <= 0) {
    return 'max_hr must be a positive integer';
  }

  if (parsedMaxHr < parsedAvgHr) {
    return 'max_hr must be greater than or equal to avg_hr';
  }

  if (!Number.isFinite(parsedAvgTemperature)) {
    return 'avg_temperature_c must be a valid number';
  }

  if (!allowedSurfaces.includes(surface)) {
    return 'surface must be one of: outdoor, treadmill';
  }

  return null;
}

function buildRunFromBody(body) {
  return {
    date: body.date,
    distance_km: parseNumber(body.distance_km),
    duration_minutes: parseInteger(body.duration_minutes),
    elevation_m: parseInteger(body.elevation_m),
    run_type: body.run_type,
    run_label: body.run_label || null,
    avg_pace_min_km: body.avg_pace_min_km,
    avg_hr: parseInteger(body.avg_hr),
    max_hr: parseInteger(body.max_hr),
    avg_temperature_c: parseNumber(body.avg_temperature_c),
    surface: body.surface
  };
}

module.exports = {
  validateRun,
  buildRunFromBody
};
