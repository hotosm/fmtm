-- Start a transaction
BEGIN;

-- Drop the foreign key constraint
ALTER TABLE organisations
DROP CONSTRAINT IF EXISTS fk_organisations_user_id;

-- Drop the column user_id
ALTER TABLE organisations
DROP COLUMN IF EXISTS user_id;

-- Commit the transaction
COMMIT;
