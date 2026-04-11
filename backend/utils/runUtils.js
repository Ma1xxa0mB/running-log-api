const allowedRunTypes = ['easy', 'tempo', 'interval', 'long'];

function validateRun(body) {
  const { date, distance_km, duration_minutes, run_type } = body;

  if (!date || !distance_km || !duration_minutes || !run_type) {
    return 'date, distance_km, duration_minutes and run_type are required';
  }

  if (typeof distance_km !== 'number' || distance_km <= 0) {
    return 'distance_km must be a positive number';
  }

  if (typeof duration_minutes !== 'number' || duration_minutes <= 0) {
    return 'duration_minutes must be a positive number';
  }

  if (!allowedRunTypes.includes(run_type)) {
    return 'run_type must be one of: easy, tempo, interval, long';
  }

  return null;
}

function buildRunFromBody(body) {
  return {
    date: body.date,
    distance_km: body.distance_km,
    duration_minutes: body.duration_minutes,
    run_type: body.run_type,
    notes: body.notes
  };
}

module.exports = {
  validateRun,
  buildRunFromBody
};
