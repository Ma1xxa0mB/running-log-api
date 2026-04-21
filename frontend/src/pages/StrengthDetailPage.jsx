import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  deleteStrengthSessionById,
  fetchStrengthSessionById,
} from '../api/strengthApi.js';
import { formatDuration } from '../utils/time.js';

function formatStrengthDate(dateValue) {
  const date = new Date(dateValue);

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function StrengthDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [strengthSession, setStrengthSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadStrengthSession() {
      try {
        const result = await fetchStrengthSessionById(id);
        setStrengthSession(result);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    loadStrengthSession();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm('Delete this strength session permanently?');

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setDeleteError('');

    try {
      await deleteStrengthSessionById(id);
      navigate('/runs');
    } catch (deleteStrengthError) {
      setDeleteError(deleteStrengthError.message);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <section className="page-card">
        <div className="strength-detail-card">
          <p className="runs-page-feedback">Loading strength session...</p>
        </div>
      </section>
    );
  }

  if (error || !strengthSession) {
    return (
      <section className="page-card">
        <div className="strength-detail-card">
          <p className="form-feedback form-feedback--error">
            {error || 'Strength session not found'}
          </p>
          <Link to="/runs" className="form-button form-button--secondary">
            Back to activities
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-card">
      <div className="strength-detail-card">
        <div className="strength-detail-hero">
          <div className="strength-detail-hero__top">
            <div className="strength-detail-hero__title-row">
              <span className="run-list-card__badge run-list-card__badge--strength">
                Strength
              </span>
            </div>

            <div className="strength-detail-hero__date-group">
              <span className="strength-detail-hero__date">
                {formatStrengthDate(strengthSession.date)}
              </span>
            </div>
          </div>

          <div className="strength-detail-panel">
            <div className="run-detail-panel-header">
              <h3 className="run-detail-panel-title">Main data</h3>
            </div>

            <div className="strength-detail-metrics-grid">
              <div className="strength-detail-metric-card">
                <span className="run-detail-metric-card__label">Duration</span>
                <span className="run-detail-metric-card__value">
                  {formatDuration(strengthSession.duration_seconds)}
                </span>
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
              <Link
                to={`/strength-sessions/${id}/edit`}
                className="run-detail-edit-button"
              >
                Edit strength
              </Link>
              <button
                type="button"
                className="run-detail-delete-button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete strength'}
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

export default StrengthDetailPage;
