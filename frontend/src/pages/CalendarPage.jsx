import { useMemo, useState } from 'react';
import { fetchRuns } from '../api/runsApi.js';
import { useEffect } from 'react';
import { buildRunsByDate } from '../features/calendar/buildRunsByDate.js';
import { buildMonthGrid } from '../features/calendar/buildMonthGrid.js';
import { buildCalendarCells } from '../features/calendar/buildCalendarCells.js';

const weekdayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatMonthTitle(currentMonthDate) {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(currentMonthDate);
}

function CalendarPage() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

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

  const runsByDate = useMemo(() => buildRunsByDate(runs), [runs]);
  const monthGrid = useMemo(() => buildMonthGrid(currentMonthDate), [currentMonthDate]);
  const calendarCells = useMemo(
    () => buildCalendarCells(monthGrid, runsByDate),
    [monthGrid, runsByDate]
  );
  const todayDateKey = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, []);

  function showPreviousMonth() {
    setCurrentMonthDate((currentDate) => (
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    ));
  }

  function showNextMonth() {
    setCurrentMonthDate((currentDate) => (
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    ));
  }

  function showCurrentMonth() {
    const today = new Date();
    setCurrentMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  return (
    <section className="page-card">
      <div className="calendar-page-card">
        <div className="calendar-page-header">
          <div>
            <h2>Calendar</h2>
          </div>

          <div className="calendar-toolbar">
            <button type="button" className="calendar-button" onClick={showCurrentMonth}>
              Today
            </button>
            <button type="button" className="calendar-button calendar-button--icon" onClick={showPreviousMonth}>
              ‹
            </button>
            <p className="calendar-toolbar__title">{formatMonthTitle(currentMonthDate)}</p>
            <button type="button" className="calendar-button calendar-button--icon" onClick={showNextMonth}>
              ›
            </button>
          </div>
        </div>

        {loading ? <p className="runs-page-feedback">Loading calendar...</p> : null}
        {!loading && error ? <p className="form-feedback form-feedback--error">{error}</p> : null}

        {!loading && !error ? (
          <div className="calendar-shell">
            <div className="calendar-weekdays">
              {weekdayLabels.map((weekday) => (
                <div key={weekday} className="calendar-weekday">
                  {weekday}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarCells.map((cell) => (
                <article
                  key={cell.dateKey}
                  className={cell.isCurrentMonth ? 'calendar-cell' : 'calendar-cell calendar-cell--outside'}
                >
                  <div className="calendar-cell__header">
                    <span
                      className={
                        cell.dateKey === todayDateKey
                          ? 'calendar-cell__day calendar-cell__day--today'
                          : 'calendar-cell__day'
                      }
                    >
                      {cell.dayNumber}
                    </span>
                  </div>

                  <div className="calendar-cell__content">
                    {cell.runs.map((run) => (
                      <div
                        key={run.id}
                        className={`calendar-run-card calendar-run-card--${run.runType}`}
                      >
                        <div className="calendar-run-card__top">
                          <span className={`run-list-card__badge run-list-card__badge--${run.runType}`}>
                            {run.runTypeLabel}
                          </span>
                        </div>
                        <div className="calendar-run-card__body">
                          <span className="calendar-run-card__surface">{run.surfaceLabel}</span>
                          <div className="calendar-run-card__metrics">
                            <span>{run.distance}</span>
                            <span>{run.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default CalendarPage;
