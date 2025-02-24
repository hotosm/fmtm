-- ## Migration to:
-- * Replace projects.xform_category with projects.osm_category

-- Start a transaction
BEGIN;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'xform_category') THEN
        ALTER TABLE public.projects RENAME COLUMN xform_category TO osm_category;
    END IF;
END $$;

-- Commit the transaction
COMMIT;
