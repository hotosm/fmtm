-- ## Migration to:
-- * Convert task_history.id from SERIAL to manual UUID field

-- Start a transaction
BEGIN;

-- Add new UUID field with values
ALTER TABLE public.task_history ADD COLUMN IF NOT EXISTS uuid UUID;
UPDATE public.task_history SET uuid = gen_random_uuid() WHERE uuid IS NULL;
ALTER TABLE public.task_history ALTER COLUMN uuid SET NOT NULL;

-- Drop the old integer column
ALTER TABLE public.task_history DROP CONSTRAINT IF EXISTS task_history_pkey;
ALTER TABLE public.task_history DROP COLUMN IF EXISTS id;
DROP SEQUENCE IF EXISTS public.task_history_id_seq;

-- Check and update primary key
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'task_history_pkey' 
          AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN
        -- Add primary key constraint on uuid column
        ALTER TABLE public.task_history ADD CONSTRAINT task_history_pkey PRIMARY KEY (uuid);
    END IF;
END $$;

-- Rename the UUID column to event_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'task_history' AND column_name = 'uuid') THEN
        ALTER TABLE public.task_history RENAME COLUMN uuid TO event_id;
    END IF;
END $$;

-- Commit the transaction
COMMIT;
