-- ## Migration add some extra fields.
-- * Add last_active_at to users.

-- Related issues:
-- https://github.com/hotosm/fmtm/issues/1999

-- Start a transaction

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'last_active_at'
    ) THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- Commit the transaction
COMMIT;
