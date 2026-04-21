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

function validateStrengthSession(body) {
  const { date, duration } = body;

  if (!date || !duration) {
    return 'date and duration are required';
  }

  if (Number.isNaN(Date.parse(date))) {
    return 'date must be a valid date';
  }

  const parsedDuration = parseDurationToSeconds(duration);

  if (Number.isNaN(parsedDuration) || parsedDuration <= 0) {
    return 'duration must be a valid time in MM:SS or H:MM:SS format';
  }

  return null;
}

function buildStrengthSessionFromBody(body) {
  return {
    date: body.date,
    duration_seconds: parseDurationToSeconds(body.duration),
  };
}

module.exports = {
  validateStrengthSession,
  buildStrengthSessionFromBody,
};
