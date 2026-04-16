import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchRuns } from '../api/runsApi.js';
import { buildVisibleRuns } from '../features/runs/buildVisibleRuns.js';
import { formatDuration } from '../utils/time.js';

const initialFilters = {
  sortBy: 'date_desc',
  runTypeFilter: 'all',
  minDistanceFilter: 'all',
  minElevationFilter: 'all',
  minDurationFilter: 'all',
};

function formatRunTypeLabel(runType) {
  const labels = {
    easy: 'Easy',
    long: 'Long',
    tempo: 'Tempo',
    vo2max: 'VO2 Max',
    sprint: 'Sprint',
    muscu: 'Muscu',
  };

  return labels[runType] || runType;
}

function formatSurfaceLabel(surface) {
  const labels = {
    outdoor: 'Outdoor',
    treadmill: 'Treadmill',
  };

  return labels[surface] || surface;
}

function formatRunDate(dateValue) {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function RunsPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    async function loadRuns() {
      try {
        const result = await fetchRuns();
        setRuns(result);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadRuns();
  }, []);

  function handleFilterChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  const visibleRuns = buildVisibleRuns(runs, filters);

  return (
    <section className="page-card">
      <div className="runs-page-card">
        <div className="runs-page-header">
          <div>
            <h2>Runs</h2>
          </div>
        </div>

        {!loading && !error ? (
          <div className="runs-controls">
            <label className="form-field">
              <span className="form-label">Sort By</span>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="date_desc">Latest first</option>
                <option value="distance_desc">Distance high to low</option>
                <option value="elevation_desc">Elevation high to low</option>
                <option value="duration_desc">Duration high to low</option>
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Run Type</span>
              <select name="runTypeFilter" value={filters.runTypeFilter} onChange={handleFilterChange}>
                <option value="all">All runs</option>
                <option value="easy">Easy</option>
                <option value="long">Long</option>
                <option value="tempo">Tempo</option>
                <option value="vo2max">VO2 Max</option>
                <option value="sprint">Sprint</option>
                <option value="muscu">Muscu</option>
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Min Distance</span>
              <select
                name="minDistanceFilter"
                value={filters.minDistanceFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All distances</option>
                <option value="10">10 km and more</option>
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Min Elevation</span>
              <select
                name="minElevationFilter"
                value={filters.minElevationFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All elevation</option>
                <option value="400">400 m and more</option>
              </select>
            </label>

            <label className="form-field">
              <span className="form-label">Min Duration</span>
              <select
                name="minDurationFilter"
                value={filters.minDurationFilter}
                onChange={handleFilterChange}
              >
                <option value="all">All durations</option>
                <option value="4500">1h15 and more</option>
              </select>
            </label>
          </div>
        ) : null}

        {loading ? <p className="runs-page-feedback">Loading runs...</p> : null}
        {!loading && error ? <p className="runs-page-feedback">{error}</p> : null}

        {!loading && !error ? (
          <div className="runs-list">
            {visibleRuns.length === 0 ? (
              <p className="runs-page-feedback">No runs match the current filters.</p>
            ) : (
              visibleRuns.map((run) => (
                <Link
                  key={run.id}
                  to={`/runs/${run.id}`}
                  className={`run-list-card run-list-card--${run.run_type}`}
                >
                  <div className="run-list-card__top">
                    <div className="run-list-card__title-row">
                      <span
                        className={`run-list-card__badge run-list-card__badge--${run.run_type}`}
                      >
                        {formatRunTypeLabel(run.run_type)}
                      </span>
                      {run.run_label ? (
                        <p className="run-list-card__label">{run.run_label}</p>
                      ) : null}
                    </div>

                    <div className="run-list-card__date-group">
                      <span className="run-list-card__surface">
                        {formatSurfaceLabel(run.surface)}
                      </span>
                      <span className="run-list-card__date">{formatRunDate(run.date)}</span>
                    </div>
                  </div>

                  <div className="run-list-card__content">
                    <div className="run-list-card__detail">
                      <div className="run-list-card__metric">
                        <span className="run-list-card__metric-label">Distance</span>
                        <span className="run-list-card__metric-value">{run.distance_km} km</span>
                      </div>
                      <div className="run-list-card__metric">
                        <span className="run-list-card__metric-label">Time</span>
                        <span className="run-list-card__metric-value">
                          {formatDuration(run.duration_seconds)}
                        </span>
                      </div>
                      <div className="run-list-card__metric">
                        <span className="run-list-card__metric-label">Elevation</span>
                        <span className="run-list-card__metric-value">{run.elevation_m} m</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default RunsPage;
