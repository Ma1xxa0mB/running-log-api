ALTER TABLE runs
DROP CONSTRAINT IF EXISTS runs_run_type_check;

ALTER TABLE runs
ADD CONSTRAINT runs_run_type_check CHECK (
  run_type = ANY (ARRAY['easy'::text, 'tempo'::text, 'vo2max'::text, 'long'::text, 'sprint'::text])
);
