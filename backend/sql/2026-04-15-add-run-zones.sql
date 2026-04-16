ALTER TABLE runs
ADD COLUMN zone_1_minutes integer NOT NULL DEFAULT 0,
ADD COLUMN zone_2_minutes integer NOT NULL DEFAULT 0,
ADD COLUMN zone_3_minutes integer NOT NULL DEFAULT 0,
ADD COLUMN zone_4_minutes integer NOT NULL DEFAULT 0,
ADD COLUMN zone_5_minutes integer NOT NULL DEFAULT 0;

ALTER TABLE runs
ADD CONSTRAINT runs_zone_1_minutes_check CHECK (zone_1_minutes >= 0),
ADD CONSTRAINT runs_zone_2_minutes_check CHECK (zone_2_minutes >= 0),
ADD CONSTRAINT runs_zone_3_minutes_check CHECK (zone_3_minutes >= 0),
ADD CONSTRAINT runs_zone_4_minutes_check CHECK (zone_4_minutes >= 0),
ADD CONSTRAINT runs_zone_5_minutes_check CHECK (zone_5_minutes >= 0);
