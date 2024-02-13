-- ## Migration to:
-- * Add public.organisation.email field.
-- * Add public.organisation.community_type field.

-- Start a transaction
BEGIN;

-- Add the email column to organisations table
DO $$
BEGIN
    ALTER TABLE IF EXISTS public.organisations
        ADD COLUMN IF NOT EXISTS email VARCHAR;
END $$;

-- Create the communitytype enum
CREATE TYPE public.communitytype AS ENUM (
    'OSM_COMMUNITY',
    'COMPANY',
    'NON_PROFIT',
    'UNIVERSITY',
    'OTHER'
);

-- Add the community_type column to organisations table
DO $$ 
BEGIN
    ALTER TABLE IF EXISTS public.organisations
        ADD COLUMN IF NOT EXISTS community_type public.communitytype;
END $$;

-- Set default value for community_type column
ALTER TABLE public.organisations
    ALTER COLUMN community_type SET DEFAULT 'OSM_COMMUNITY';

-- Commit the transaction
COMMIT;

