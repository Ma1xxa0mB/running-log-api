export function formatDateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function normalizeRunDateToKey(rawDate) {
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return rawDate;
  }

  return formatDateToKey(new Date(rawDate));
}

export function startOfWeekMonday(date) {
  const monday = new Date(date);
  const day = monday.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;

  monday.setDate(monday.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function endOfWeekSunday(date) {
  const sunday = startOfWeekMonday(date);
  sunday.setDate(sunday.getDate() + 6);
  sunday.setHours(0, 0, 0, 0);

  return sunday;
}

export function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  nextDate.setHours(0, 0, 0, 0);

  return nextDate;
}
