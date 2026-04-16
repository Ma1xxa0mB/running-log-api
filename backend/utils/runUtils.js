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

function parseDurationToSeconds(value) {
  if (typeof value !== 'string') {
    return Number.NaN;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return Number.NaN;
  }

  const durationParts = trimmedValue.split(':');

  if (durationParts.length !== 2 && durationParts.length !== 3) {
    return Number.NaN;
  }

  const parsedParts = durationParts.map((part) => Number.parseInt(part, 10));

  if (parsedParts.some((part) => Number.isNaN(part) || part < 0)) {
    return Number.NaN;
  }

  if (durationParts.length === 2) {
    const [minutes, seconds] = parsedParts;

    if (seconds >= 60) {
      return Number.NaN;
    }

    return minutes * 60 + seconds;
  }

  const [hours, minutes, seconds] = parsedParts;

  if (minutes >= 60 || seconds >= 60) {
    return Number.NaN;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

function validateRun(body) {
  const {
    date,
    distance_km,
    duration,
    elevation_m,
    run_type,
    run_label,
    avg_pace_min_km,
    avg_hr,
    max_hr,
    avg_temperature_c,
    surface,
    zone_1,
    zone_2,
    zone_3,
    zone_4,
    zone_5
  } = body;

  if (
    !date ||
    distance_km === '' ||
    !duration ||
    elevation_m === '' ||
    !run_type ||
    !avg_pace_min_km ||
    avg_hr === '' ||
    max_hr === '' ||
    avg_temperature_c === '' ||
    !surface ||
    !zone_1 ||
    !zone_2 ||
    !zone_3 ||
    !zone_4 ||
    !zone_5
  ) {
    return 'date, distance_km, duration, elevation_m, run_type, avg_pace_min_km, avg_hr, max_hr, avg_temperature_c, surface and zone_1 to zone_5 are required';
  }

  if (runTypesRequiringLabel.includes(run_type) && !run_label) {
    return 'run_label is required for qualitative run types';
  }

  const parsedDistance = parseNumber(distance_km);
  const parsedDuration = parseDurationToSeconds(duration);
  const parsedElevation = parseInteger(elevation_m);
  const parsedAvgHr = parseInteger(avg_hr);
  const parsedMaxHr = parseInteger(max_hr);
  const parsedAvgTemperature = parseNumber(avg_temperature_c);
  const parsedZone1 = parseDurationToSeconds(zone_1);
  const parsedZone2 = parseDurationToSeconds(zone_2);
  const parsedZone3 = parseDurationToSeconds(zone_3);
  const parsedZone4 = parseDurationToSeconds(zone_4);
  const parsedZone5 = parseDurationToSeconds(zone_5);

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
    return 'duration must be a valid time in MM:SS or H:MM:SS format';
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

  if (Number.isNaN(parsedZone1) || parsedZone1 < 0) {
    return 'zone_1 must be a valid time in MM:SS or H:MM:SS format';
  }

  if (Number.isNaN(parsedZone2) || parsedZone2 < 0) {
    return 'zone_2 must be a valid time in MM:SS or H:MM:SS format';
  }

  if (Number.isNaN(parsedZone3) || parsedZone3 < 0) {
    return 'zone_3 must be a valid time in MM:SS or H:MM:SS format';
  }

  if (Number.isNaN(parsedZone4) || parsedZone4 < 0) {
    return 'zone_4 must be a valid time in MM:SS or H:MM:SS format';
  }

  if (Number.isNaN(parsedZone5) || parsedZone5 < 0) {
    return 'zone_5 must be a valid time in MM:SS or H:MM:SS format';
  }

  if (parsedZone1 + parsedZone2 + parsedZone3 + parsedZone4 + parsedZone5 > parsedDuration) {
    return 'zone_1 to zone_5 cannot be greater than duration';
  }

  return null;
}

function buildRunFromBody(body) {
  return {
    date: body.date,
    distance_km: parseNumber(body.distance_km),
    duration_seconds: parseDurationToSeconds(body.duration),
    elevation_m: parseInteger(body.elevation_m),
    run_type: body.run_type,
    run_label: body.run_label || null,
    avg_pace_min_km: body.avg_pace_min_km,
    avg_hr: parseInteger(body.avg_hr),
    max_hr: parseInteger(body.max_hr),
    avg_temperature_c: parseNumber(body.avg_temperature_c),
    surface: body.surface,
    zone_1_seconds: parseDurationToSeconds(body.zone_1),
    zone_2_seconds: parseDurationToSeconds(body.zone_2),
    zone_3_seconds: parseDurationToSeconds(body.zone_3),
    zone_4_seconds: parseDurationToSeconds(body.zone_4),
    zone_5_seconds: parseDurationToSeconds(body.zone_5)
  };
}

module.exports = {
  validateRun,
  buildRunFromBody
};
