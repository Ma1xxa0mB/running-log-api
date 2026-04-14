import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../api/client.js';

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

  useEffect(() => {
    async function loadRuns() {
      try {
        const response = await fetch(`${API_BASE_URL}/runs`, {
          credentials: 'include',
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || 'Failed to fetch runs');
          return;
        }

        setRuns(result);
      } catch (fetchError) {
        setError('Failed to fetch runs');
      } finally {
        setLoading(false);
      }
    }

    loadRuns();
  }, []);

  return (
    <section className="page-card">
      <div className="runs-page-card">
        <div className="runs-page-header">
          <div>
            <p className="page-kicker">Protected page</p>
            <h2>Runs</h2>
            <p className="runs-page-description">
              Real runs fetched from the backend for the current account.
            </p>
          </div>

          <Link className="form-button form-button--primary" to="/runs/new">
            Add Run
          </Link>
        </div>

        {loading ? <p className="runs-page-feedback">Loading runs...</p> : null}
        {!loading && error ? <p className="runs-page-feedback">{error}</p> : null}

        {!loading && !error ? (
          <div className="runs-list">
            {runs.length === 0 ? (
              <p className="runs-page-feedback">No runs yet for this account.</p>
            ) : (
              runs.map((run) => (
                <Link key={run.id} to={`/runs/${run.id}`} className="run-list-card">
                  <div className="run-list-card__top">
                    <span
                      className={`run-list-card__badge run-list-card__badge--${run.run_type}`}
                    >
                      {formatRunTypeLabel(run.run_type)}
                    </span>
                    <span className="run-list-card__date">{formatRunDate(run.date)}</span>
                  </div>

                  <div className="run-list-card__content">
                    <div className="run-list-card__meta">
                      <p className="run-list-card__surface">
                        {formatSurfaceLabel(run.surface)}
                      </p>
                      {run.run_label ? (
                        <p className="run-list-card__label">{run.run_label}</p>
                      ) : null}
                    </div>

                    <div className="run-list-card__detail">
                      <span>{run.distance_km} km</span>
                      <span>{run.duration_minutes} min</span>
                      <span>{run.elevation_m} m+</span>
                      <span>{run.avg_hr} bpm</span>
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
