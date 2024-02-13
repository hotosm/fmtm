-- Start a transaction
BEGIN;

-- Delete record in org managers
WITH org_cte AS (
    SELECT id FROM public.organisations
    WHERE name = 'FMTM Public Beta'
), user_cte AS (
    SELECT id FROM public.users
    WHERE username = 'svcfmtm'
)
DELETE FROM public.organisation_managers 
WHERE organisation_id = (SELECT id FROM org_cte) 
  AND user_id = (SELECT id FROM user_cte);

-- Delete svcfmtm admin user
DELETE FROM public.users
WHERE username = 'svcfmtm';

-- Delete FMTM Public Beta organisation
DELETE FROM public.organisations
WHERE name = 'FMTM Public Beta';

-- Commit the transaction
COMMIT;
