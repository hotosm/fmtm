DO $$
BEGIN
    -- Change data type of id to NUMERIC if not already
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
            AND column_name = 'id'
            AND data_type = 'integer'
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
        ADD COLUMN auth_provider character varying;

        -- Update all existing users to have auth_provider as 'osm'
        UPDATE public.users SET auth_provider = 'osm' WHERE auth_provider IS NULL;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'users_username_key'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE ONLY public.users
        DROP CONSTRAINT users_username_key;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'users_id_username_key'
        AND table_name = 'users'
    ) THEN
        ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_id_username_key UNIQUE (auth_provider, username);
    END IF;
END
$$;
