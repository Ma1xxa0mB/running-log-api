function EightyTwentyCard({ label, easyPercent, moderatePercent, hardPercent }) {
  return (
    <section className="dashboard-card">
      <div className="eighty-twenty-header">
        <h3 className="card-title">80/20</h3>
        <p className="eighty-twenty-period">{label}</p>
      </div>

      <div className="eighty-twenty-bar" aria-hidden="true">
        <div
          className="eighty-twenty-segment eighty-twenty-segment--easy"
          style={{ width: easyPercent }}
        />
        <div
          className="eighty-twenty-segment eighty-twenty-segment--moderate"
          style={{ width: moderatePercent }}
        />
        <div
          className="eighty-twenty-segment eighty-twenty-segment--hard"
          style={{ width: hardPercent }}
        />
      </div>

      <div className="eighty-twenty-legend">
        <span className="eighty-twenty-tag eighty-twenty-tag--easy">
          Easy {easyPercent}
        </span>
        <span className="eighty-twenty-tag eighty-twenty-tag--moderate">
          Moderate {moderatePercent}
        </span>
        <span className="eighty-twenty-tag eighty-twenty-tag--hard">
          Hard {hardPercent}
        </span>
      </div>
    </section>
  );
}

export default EightyTwentyCard;
