-- ## Migration to:
-- * Rename all timestamps to a consistent [field]_at syntax
-- * Drop the users.last_validation_date field we no longer need 
--    (filter task_history instead)

-- Start a transaction
BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'created') THEN
        ALTER TABLE public.projects RENAME COLUMN created TO created_at;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'last_updated') THEN
        ALTER TABLE public.projects RENAME COLUMN last_updated TO updated_at;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'date_registered') THEN
        ALTER TABLE public.users RENAME COLUMN date_registered TO registered_at;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_migrations' AND column_name = 'date_executed') THEN
        ALTER TABLE public."_migrations" RENAME COLUMN date_executed TO executed_at;
    END IF;
END $$;

ALTER TABLE public.users DROP COLUMN IF EXISTS last_validation_date;

-- Commit the transaction
COMMIT;
