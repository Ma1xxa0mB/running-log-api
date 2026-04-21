import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteRunById, fetchRunById } from '../api/runsApi.js';
import { formatDuration } from '../utils/time.js';

function formatRunTypeLabel(runType) {
  const labels = {
    easy: 'Easy',
    long: 'Long',
    tempo: 'Tempo',
    vo2max: 'VO2 Max',
    sprint: 'Sprint',
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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatHeartRate(value) {
  return value ? `${value} bpm` : '--';
}

function formatTemperature(value) {
  return value === null || value === undefined ? '--' : `${value}°C`;
}

function formatZoneTime(value) {
  const totalSeconds = Number(value);

  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '00:00';
  }

  return formatDuration(totalSeconds);
}

function formatZonePercent(zoneSeconds, totalDurationSeconds) {
  const zone = Number(zoneSeconds);
  const total = Number(totalDurationSeconds);

  if (!Number.isFinite(zone) || !Number.isFinite(total) || total <= 0 || zone <= 0) {
    return '0%';
  }

  return `${Math.round((zone / total) * 100)}%`;
}

function RunDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadRun() {
      try {
        const result = await fetchRunById(id);
        setRun(result);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadRun();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this run permanently?');

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteRunById(id);
      navigate('/runs');
    } catch (deleteRunError) {
      setDeleteError(deleteRunError.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <section className="page-card">
        <div className="run-detail-page-card">
          <p className="runs-page-feedback">Loading run...</p>
        </div>
      </section>
    );
  }

  if (error || !run) {
    return (
      <section className="page-card">
        <div className="run-detail-page-card">
          <p className="form-feedback form-feedback--error">{error || 'Run not found'}</p>
          <Link to="/runs" className="run-detail-back-button">
            Back to activities
          </Link>
        </div>
      </section>
    );
  }

  const zoneRows = [
    { label: 'Zone 1', seconds: run.zone_1_seconds || 0, tone: 'zone-1' },
    { label: 'Zone 2', seconds: run.zone_2_seconds || 0, tone: 'zone-2' },
    { label: 'Zone 3', seconds: run.zone_3_seconds || 0, tone: 'zone-3' },
    { label: 'Zone 4', seconds: run.zone_4_seconds || 0, tone: 'zone-4' },
    { label: 'Zone 5', seconds: run.zone_5_seconds || 0, tone: 'zone-5' },
  ];

  return (
    <section className="page-card">
      <div className="run-detail-page-card">
        <div className={`run-detail-hero run-detail-hero--${run.run_type}`}>
          <div className="run-detail-hero__top">
            <div className="run-detail-hero__title-row">
              <span className={`run-list-card__badge run-list-card__badge--${run.run_type}`}>
                {formatRunTypeLabel(run.run_type)}
              </span>
              {run.run_label ? (
                <p className="run-list-card__label">{run.run_label}</p>
              ) : null}
            </div>

            <div className="run-detail-hero__date-group">
              <span className="run-detail-hero__surface">{formatSurfaceLabel(run.surface)}</span>
              <span className="run-detail-hero__date">{formatRunDate(run.date)}</span>
            </div>
          </div>

          <div className="run-detail-hero__content">
            <div className="run-detail-main-panel">
              <div className="run-detail-panel-header">
                <h3 className="run-detail-panel-title">Main data</h3>
              </div>
              <div className="run-detail-metrics-grid">
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Distance</span>
                  <span className="run-detail-metric-card__value">
                    {Number(run.distance_km).toFixed(2)} km
                  </span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Time</span>
                  <span className="run-detail-metric-card__value">
                    {formatDuration(run.duration_seconds)}
                  </span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Elevation</span>
                  <span className="run-detail-metric-card__value">{run.elevation_m} m</span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Avg HR</span>
                  <span className="run-detail-metric-card__value">
                    {formatHeartRate(run.avg_hr)}
                  </span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Max HR</span>
                  <span className="run-detail-metric-card__value">
                    {formatHeartRate(run.max_hr)}
                  </span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Avg Pace</span>
                  <span className="run-detail-metric-card__value">{run.avg_pace_min_km || '--'}</span>
                </div>
                <div className="run-detail-metric-card">
                  <span className="run-detail-metric-card__label">Temperature</span>
                  <span className="run-detail-metric-card__value">
                    {formatTemperature(run.avg_temperature_c)}
                  </span>
                </div>
              </div>
            </div>

            <div className="run-detail-zones-panel">
              <div className="run-detail-panel-header">
                <h3 className="run-detail-zones-card__title">Time in zones</h3>
              </div>
              <div className="run-detail-zones-card">
              <div className="run-detail-zones-list">
                {zoneRows.map((zone) => {
                  const zonePercent = formatZonePercent(zone.seconds, run.duration_seconds);

                  return (
                    <div key={zone.label} className="run-detail-zone-row">
                      <div className="run-detail-zone-row__top">
                        <span className="run-detail-zone-row__label">{zone.label}</span>
                        <div className="run-detail-zone-row__stats">
                          <span className="run-detail-zone-row__value">
                            {formatZoneTime(zone.seconds)}
                          </span>
                          <span className="run-detail-zone-row__percent">{zonePercent}</span>
                        </div>
                      </div>

                      <div className="run-detail-zone-bar">
                        <div
                          className={`run-detail-zone-bar__fill run-detail-zone-bar__fill--${zone.tone}`}
                          style={{ width: zonePercent }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          </div>

          <div className="run-detail-actions">
            <div className="run-detail-actions__back">
              <Link to="/runs" className="run-detail-back-button">
                Back to activities
              </Link>
            </div>

            <div className="run-detail-actions__primary">
              <Link to={`/runs/${id}/edit`} className="run-detail-edit-button">
                Edit run
              </Link>
              <button
                type="button"
                className="run-detail-delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete run'}
              </button>
            </div>
          </div>

          {deleteError ? (
            <p className="form-feedback form-feedback--error run-detail-delete-feedback">
              {deleteError}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default RunDetailPage;
