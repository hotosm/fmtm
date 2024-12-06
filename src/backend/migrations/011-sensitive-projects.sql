-- ## Migration to:
-- * Add SENSITIVE project option to projectvisibility enum.

-- Start a transaction
BEGIN;

ALTER TYPE public.projectvisibility
ADD VALUE IF NOT EXISTS 'SENSITIVE' AFTER 'INVITE_ONLY';

-- Commit the transaction
COMMIT;
