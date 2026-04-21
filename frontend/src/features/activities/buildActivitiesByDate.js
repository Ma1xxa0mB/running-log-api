import { normalizeRunDateToKey } from '../calendar/calendarShared.js';

export function buildActivitiesByDate(activities) {
  return activities.reduce((activitiesByDate, activity) => {
    const dateKey = normalizeRunDateToKey(activity.date);
    const currentActivities = activitiesByDate[dateKey] || [];

    return {
      ...activitiesByDate,
      [dateKey]: [...currentActivities, activity],
    };
  }, {});
}
