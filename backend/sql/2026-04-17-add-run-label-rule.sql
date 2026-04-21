ALTER TABLE runs
DROP CONSTRAINT IF EXISTS runs_run_label_required_for_qualitative_check;

ALTER TABLE runs
ADD CONSTRAINT runs_run_label_required_for_qualitative_check CHECK (
  run_type NOT IN ('tempo', 'vo2max', 'sprint')
  OR NULLIF(BTRIM(run_label), '') IS NOT NULL
);
