ALTER TABLE users
ADD COLUMN hr_rest integer,
ADD COLUMN hr_max integer;

ALTER TABLE users
ADD CONSTRAINT users_hr_rest_check CHECK (hr_rest IS NULL OR hr_rest > 0),
ADD CONSTRAINT users_hr_max_check CHECK (hr_max IS NULL OR hr_max > 0),
ADD CONSTRAINT users_hr_rest_hr_max_check CHECK (
  hr_rest IS NULL OR hr_max IS NULL OR hr_rest < hr_max
);
