-- ## Migration to:
-- * Add FMTM Public Beta org by default.
-- * Add svcfmtm admin user.

-- Start a transaction
BEGIN;

-- Insert FMTM Public Beta organisation
INSERT INTO public.organisations (
    name,
    slug,
    logo,
    description,
    url,
    type,
    approved,
    odk_central_url,
    odk_central_user,
    odk_central_password
)
VALUES (
    'FMTM Public Beta',
    'fmtm-public-beta',
    'https://avatars.githubusercontent.com/u/458752?s=280&v=4',
    'HOTOSM Public Beta for FMTM.',
    'https://hotosm.org',
    'FREE',
    true,
    '${ODK_CENTRAL_URL}',
    '${ODK_CENTRAL_USER}',
    '${ODK_CENTRAL_PASSWD}'
)
ON CONFLICT ("name") DO NOTHING;

-- Insert svcfmtm admin user
INSERT INTO public.users (
    username,
    role,
    name,
    email_address,
    is_email_verified,
    mapping_level,
    tasks_mapped,
    tasks_validated,
    tasks_invalidated
)
VALUES (
    'svcfmtm',
    'ADMIN',
    'Admin',
    'admin@hotosm.org',
    true,
    'ADVANCED',
    0,
    0,
    0
)
ON CONFLICT ("username") DO NOTHING;

-- Set svcfmtm user as org admin
WITH org_cte AS (
    SELECT id FROM public.organisations
    WHERE name = 'FMTM Public Beta'
), user_cte AS (
    SELECT id FROM public.users
    WHERE username = 'svcfmtm'
)
INSERT INTO public.organisation_managers (organisation_id, user_id)
SELECT (SELECT id FROM org_cte), (SELECT id FROM user_cte)
ON CONFLICT DO NOTHING;

-- Commit the transaction
COMMIT;
