-- ## Migration to:
-- * Change project.task_split_type str --> int.
-- * Add field project.task_split_dimension (int).
-- * Add field project.task_num_buildings (int).


-- ## Apply Migration
-- Start a transaction
BEGIN;
-- task_split_type enum
CREATE TYPE public.tasksplittype AS ENUM (
    'DIVIDE_ON_SQUARE',
    'CHOOSE_AREA_AS_TASK',
    'TASK_SPLITTING_ALGORITHM'
);
ALTER TYPE public.mappinglevel OWNER TO fmtm;
-- Update project table
ALTER TABLE IF EXISTS public.projects
    ALTER COLUMN IF EXISTS task_split_type TYPE public.tasksplittype,
    ADD COLUMN IF NOT EXISTS task_split_dimension SMALLINT,
    ADD COLUMN IF NOT EXISTS task_num_buildings SMALLINT;
-- Commit the transaction
COMMIT;


-- -- ## Revert Migration (comment above, uncomment below)
-- -- Start a transaction
-- BEGIN;
-- -- Revert task_split_type type, drop additional columns
-- ALTER TABLE IF EXISTS public.projects
--     ALTER COLUMN IF EXISTS task_split_type TYPE VARCHAR,
--     DROP COLUMN IF EXISTS task_split_dimension,
--     DROP COLUMN IF EXISTS task_num_buildings;
-- DROP TYPE IF EXISTS public.tasksplittype;
-- -- Commit the transaction
-- COMMIT;
