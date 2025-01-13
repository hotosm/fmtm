-- Start a transaction

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'last_active_at'
    ) THEN
        ALTER TABLE users DROP COLUMN last_active_at;
    END IF;
END $$;

-- Commit the transaction
COMMIT;
