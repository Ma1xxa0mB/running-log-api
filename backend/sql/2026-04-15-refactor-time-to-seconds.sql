ALTER TABLE runs
ADD COLUMN duration_seconds integer,
ADD COLUMN zone_1_seconds integer NOT NULL DEFAULT 0,
ADD COLUMN zone_2_seconds integer NOT NULL DEFAULT 0,
ADD COLUMN zone_3_seconds integer NOT NULL DEFAULT 0,
ADD COLUMN zone_4_seconds integer NOT NULL DEFAULT 0,
ADD COLUMN zone_5_seconds integer NOT NULL DEFAULT 0;

UPDATE runs
SET
  duration_seconds = duration_minutes * 60,
  zone_1_seconds = zone_1_minutes * 60,
  zone_2_seconds = zone_2_minutes * 60,
  zone_3_seconds = zone_3_minutes * 60,
  zone_4_seconds = zone_4_minutes * 60,
  zone_5_seconds = zone_5_minutes * 60;

ALTER TABLE runs
ALTER COLUMN duration_seconds SET NOT NULL;

ALTER TABLE runs
ADD CONSTRAINT runs_duration_seconds_check CHECK (duration_seconds > 0),
ADD CONSTRAINT runs_zone_1_seconds_check CHECK (zone_1_seconds >= 0),
ADD CONSTRAINT runs_zone_2_seconds_check CHECK (zone_2_seconds >= 0),
ADD CONSTRAINT runs_zone_3_seconds_check CHECK (zone_3_seconds >= 0),
ADD CONSTRAINT runs_zone_4_seconds_check CHECK (zone_4_seconds >= 0),
ADD CONSTRAINT runs_zone_5_seconds_check CHECK (zone_5_seconds >= 0);

ALTER TABLE runs
DROP CONSTRAINT IF EXISTS runs_duration_minutes_check,
DROP CONSTRAINT IF EXISTS runs_zone_1_minutes_check,
DROP CONSTRAINT IF EXISTS runs_zone_2_minutes_check,
DROP CONSTRAINT IF EXISTS runs_zone_3_minutes_check,
DROP CONSTRAINT IF EXISTS runs_zone_4_minutes_check,
DROP CONSTRAINT IF EXISTS runs_zone_5_minutes_check;

ALTER TABLE runs
DROP COLUMN duration_minutes,
DROP COLUMN zone_1_minutes,
DROP COLUMN zone_2_minutes,
DROP COLUMN zone_3_minutes,
DROP COLUMN zone_4_minutes,
DROP COLUMN zone_5_minutes;
