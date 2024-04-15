-- ## Migration to:
-- * Add field projects.tms_url (str).

-- Start a transaction
BEGIN;

ALTER TABLE IF EXISTS public.projects
    ADD COLUMN IF NOT EXISTS tms_url VARCHAR;
-- Commit the transaction
COMMIT;