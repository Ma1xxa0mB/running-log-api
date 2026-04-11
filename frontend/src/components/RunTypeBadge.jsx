function RunTypeBadge({ type, tone = 'easy' }) {
  return <span className={`run-type-badge run-type-badge--${tone}`}>{type}</span>;
}

export default RunTypeBadge;
