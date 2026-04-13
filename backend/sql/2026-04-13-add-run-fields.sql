ALTER TABLE runs
  ADD COLUMN IF NOT EXISTS elevation_m integer,
  ADD COLUMN IF NOT EXISTS run_label text,
  ADD COLUMN IF NOT EXISTS avg_pace_min_km text,
  ADD COLUMN IF NOT EXISTS avg_hr integer,
  ADD COLUMN IF NOT EXISTS max_hr integer,
  ADD COLUMN IF NOT EXISTS avg_temperature_c numeric,
  ADD COLUMN IF NOT EXISTS surface text;
