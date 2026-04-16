import {
  addDays,
  endOfWeekSunday,
  formatDateToKey,
  startOfWeekMonday,
} from './calendarShared.js';

export function buildMonthGrid(currentMonthDate) {
  const firstDayOfMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1,
    0
  );

  const gridStartDate = startOfWeekMonday(firstDayOfMonth);
  const gridEndDate = endOfWeekSunday(lastDayOfMonth);
  const visibleDates = [];

  let cursor = new Date(gridStartDate);
  cursor.setHours(0, 0, 0, 0);

  while (cursor <= gridEndDate) {
    visibleDates.push({
      date: new Date(cursor),
      dateKey: formatDateToKey(cursor),
      dayNumber: cursor.getDate(),
      isCurrentMonth: cursor.getMonth() === currentMonthDate.getMonth(),
    });

    cursor = addDays(cursor, 1);
  }

  return visibleDates;
}
