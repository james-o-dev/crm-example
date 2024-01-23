-- Returns the current unix timestamp, in milliseconds.
-- Compatible with the javascript version e.g. `Date.now()`
CREATE OR REPLACE FUNCTION now_unix_timestamp()
  RETURNS BIGINT
  LANGUAGE SQL
  IMMUTABLE
AS $$
  SELECT CAST(EXTRACT(epoch FROM CURRENT_TIMESTAMP) * 1000 AS BIGINT);
$$;