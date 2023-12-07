-- ## Migration to:
-- * Drop tables associated with FMTM Splitter.
-- Required to prevent conflicts, but could be removed in future

-- Start a transaction
BEGIN;
-- Drop cascade tables if they exist
DROP TABLE IF EXISTS public.project_aoi CASCADE;
DROP TABLE IF EXISTS public.ways_poly CASCADE;
DROP TABLE IF EXISTS public.ways_line CASCADE;
-- Commit the transaction
COMMIT;
