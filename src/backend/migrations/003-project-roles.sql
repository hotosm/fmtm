-- ## Migration to:
-- * Add public.projectrol enum.
-- * Update the user_roles table to use the enum

-- Start a transaction
BEGIN;

CREATE TYPE public.projectrole as ENUM (
    'MAPPER',
    'VALIDATOR',
    'FIELD_MANAGER',
    'ASSOCIATE_PROJECT_MANAGER',
    'PROJECT_MANAGER',
    'ORGANIZATION_ADMIN'
);
ALTER TYPE public.projectrole OWNER TO fmtm;
ALTER TABLE public.user_roles ALTER COLUMN "role" TYPE public.projectrole;

-- Commit the transaction
COMMIT;