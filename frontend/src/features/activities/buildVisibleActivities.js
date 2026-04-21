function normalizeNumber(value) {
  return Number(value) || 0;
}

function matchesType(activity, runTypeFilter) {
  if (runTypeFilter === 'all') {
    return true;
  }

  if (runTypeFilter === 'strength') {
    return activity.activityType === 'strength';
  }

  return activity.activityType === 'run' && activity.run_type === runTypeFilter;
}

function matchesMinDistance(activity, minDistanceFilter) {
  if (minDistanceFilter === 'all') {
    return true;
  }

  if (activity.activityType !== 'run') {
    return false;
  }

  return normalizeNumber(activity.distance_km) >= Number(minDistanceFilter);
}

function matchesMinElevation(activity, minElevationFilter) {
  if (minElevationFilter === 'all') {
    return true;
  }

  if (activity.activityType !== 'run') {
    return false;
  }

  return normalizeNumber(activity.elevation_m) >= Number(minElevationFilter);
}

function matchesMinDuration(activity, minDurationFilter) {
  if (minDurationFilter === 'all') {
    return true;
  }

  return normalizeNumber(activity.duration_seconds) >= Number(minDurationFilter);
}

function sortActivities(activities, sortBy) {
  const sortedActivities = [...activities];

  sortedActivities.sort((firstActivity, secondActivity) => {
    if (sortBy === 'distance_desc') {
      return normalizeNumber(secondActivity.distance_km) - normalizeNumber(firstActivity.distance_km);
    }

    if (sortBy === 'elevation_desc') {
      return normalizeNumber(secondActivity.elevation_m) - normalizeNumber(firstActivity.elevation_m);
    }

    if (sortBy === 'duration_desc') {
      return normalizeNumber(secondActivity.duration_seconds) - normalizeNumber(firstActivity.duration_seconds);
    }

    const firstDate = new Date(firstActivity.date).getTime();
    const secondDate = new Date(secondActivity.date).getTime();

    if (firstDate === secondDate) {
      return Number(secondActivity.id) - Number(firstActivity.id);
    }

    return secondDate - firstDate;
  });

  return sortedActivities;
}

export function buildVisibleActivities(activities, filters) {
  const filteredActivities = activities.filter((activity) => (
    matchesType(activity, filters.runTypeFilter)
    && matchesMinDistance(activity, filters.minDistanceFilter)
    && matchesMinElevation(activity, filters.minElevationFilter)
    && matchesMinDuration(activity, filters.minDurationFilter)
  ));

  return sortActivities(filteredActivities, filters.sortBy);
}
