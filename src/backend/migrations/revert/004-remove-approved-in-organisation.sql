-- Start a transaction
BEGIN;

-- Revert changes to the 'organisation' table
ALTER TABLE IF EXISTS organisations
    DROP COLUMN IF EXISTS approved;

-- Commit the transaction
COMMIT;
