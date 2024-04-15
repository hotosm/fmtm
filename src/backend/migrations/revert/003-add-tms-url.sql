-- Start a transaction
BEGIN;

ALTER TABLE IF EXISTS public.projects
    DROP COLUMN IF EXISTS tms_url;
-- Commit the transaction
COMMIT;