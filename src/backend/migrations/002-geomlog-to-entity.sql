-- ## Migration to:
-- * Add geometry string field to odk_entities for storing javarosa geom of
--   NEW features.
-- * Add is_new bool field to odk_entities to mark entity as new feature.
-- * The remainder is done in geomlog_to_entities.

-- Start a transaction
BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'odk_entities' AND column_name = 'geometry'
    ) THEN
        ALTER TABLE public.odk_entities ADD COLUMN geometry character varying;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'odk_entities' AND column_name = 'is_new'
    ) THEN
        ALTER TABLE public.odk_entities ADD COLUMN is_new boolean DEFAULT false;
    END IF;
END $$;

-- Commit the transaction
COMMIT;
