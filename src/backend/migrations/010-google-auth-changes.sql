DO $$
BEGIN
    -- Change data type of id to NUMERIC if not already
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'integer'
    ) THEN
        ALTER TABLE public.users
        ALTER COLUMN id TYPE NUMERIC;
    END IF;

    -- Add provider column if not exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'auth_provider'
    ) THEN
        ALTER TABLE public.users
        ADD COLUMN provider character varying;
    END IF;
END
$$;
