-- Add trigger function to update the date_modified column of each table, when a row is updated.
-- Assumes each table has a column `date_modified` of a varchar type.
CREATE OR REPLACE FUNCTION update_date_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_modified = now_unix_timestamp(); -- or use your preferred timestamp function
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the triggers to each table.
CREATE TRIGGER users_update_date_modified_trigger
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_date_modified();
CREATE TRIGGER contacts_update_date_modified_trigger
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_date_modified();
CREATE TRIGGER tasks_update_date_modified_trigger
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_date_modified();