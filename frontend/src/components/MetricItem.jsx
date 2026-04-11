function MetricItem({ label, value, prefix, suffix }) {
  return (
    <div className="metric-item">
      <p className="metric-label">{label}</p>
      <div className="metric-value-group">
        {prefix ? <span className="metric-prefix">{prefix}</span> : null}
        <p className="metric-value">{value}</p>
        {suffix ? <span className="metric-suffix">{suffix}</span> : null}
      </div>
    </div>
  );
}

export default MetricItem;
