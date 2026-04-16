function normalizeNumber(value) {
  return Number(value) || 0;
}

function matchesRunType(run, runTypeFilter) {
  if (runTypeFilter === 'all') {
    return true;
  }

  return run.run_type === runTypeFilter;
}

function matchesMinDistance(run, minDistanceFilter) {
  if (minDistanceFilter === 'all') {
    return true;
  }

  return normalizeNumber(run.distance_km) >= Number(minDistanceFilter);
}

function matchesMinElevation(run, minElevationFilter) {
  if (minElevationFilter === 'all') {
    return true;
  }

  return normalizeNumber(run.elevation_m) >= Number(minElevationFilter);
}

function matchesMinDuration(run, minDurationFilter) {
  if (minDurationFilter === 'all') {
    return true;
  }

  return normalizeNumber(run.duration_seconds) >= Number(minDurationFilter);
}

function sortRuns(runs, sortBy) {
  const sortedRuns = [...runs];

  sortedRuns.sort((firstRun, secondRun) => {
    if (sortBy === 'distance_desc') {
      return normalizeNumber(secondRun.distance_km) - normalizeNumber(firstRun.distance_km);
    }

    if (sortBy === 'elevation_desc') {
      return normalizeNumber(secondRun.elevation_m) - normalizeNumber(firstRun.elevation_m);
    }

    if (sortBy === 'duration_desc') {
      return normalizeNumber(secondRun.duration_seconds) - normalizeNumber(firstRun.duration_seconds);
    }

    const firstDate = new Date(firstRun.date).getTime();
    const secondDate = new Date(secondRun.date).getTime();

    if (firstDate === secondDate) {
      return Number(secondRun.id) - Number(firstRun.id);
    }

    return secondDate - firstDate;
  });

  return sortedRuns;
}

export function buildVisibleRuns(runs, filters) {
  const filteredRuns = runs.filter((run) => (
    matchesRunType(run, filters.runTypeFilter)
    && matchesMinDistance(run, filters.minDistanceFilter)
    && matchesMinElevation(run, filters.minElevationFilter)
    && matchesMinDuration(run, filters.minDurationFilter)
  ));

  return sortRuns(filteredRuns, filters.sortBy);
}
