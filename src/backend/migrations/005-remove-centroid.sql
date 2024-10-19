-- ## Migration to:
-- * Remove the redundant project_id_str from project_info table.
-- * Remove the projects.centroid field, as we can generate this dynamically.
-- * Remove long overdue unused fields from public.projects.

-- Start a transaction
BEGIN;

ALTER TABLE ONLY public.project_info DROP COLUMN IF EXISTS project_id_str;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS centroid;

ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS osmcha_filter_id;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS imagery;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS osm_preset;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS odk_preset;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS josm_preset;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS id_presets;
ALTER TABLE ONLY public.projects DROP COLUMN IF EXISTS extra_id_params;

-- Commit the transaction
COMMIT;
