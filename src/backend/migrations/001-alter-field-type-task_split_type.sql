-- ## Migration to alter the field type of task_split_type.


-- ## Apply Migration
-- Start a transaction
BEGIN;

ALTER TABLE projects ALTER COLUMN task_split_type TYPE integer USING task_split_type::integer;
-- Commit the transaction
COMMIT;


