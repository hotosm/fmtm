-- Start a transaction
BEGIN;

-- Revert changes to the 'organisation' table
ALTER TABLE IF EXISTS organisation 
    DROP COLUMN IF EXISTS approved;

-- Commit the transaction
COMMIT;
