-- ## Migration to:
-- Add the user_id column to the organisations table
-- Start a transaction

BEGIN;

-- Add the user_id column and define the foreign key constraint
ALTER TABLE organisations
ADD COLUMN user_id INTEGER REFERENCES users(id);

-- Commit the transaction
COMMIT;

