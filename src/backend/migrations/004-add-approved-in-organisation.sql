-- Start a transaction
BEGIN;

-- Add the 'approved' column with default value false to the 'organisation' table
ALTER TABLE organisations
    ADD COLUMN approved BOOLEAN DEFAULT false;

-- Commit the transaction
COMMIT;
