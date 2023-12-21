-- ## Migration to:
-- * Add field user.profile_img (str).

-- Start a transaction
BEGIN;

ALTER TABLE IF EXISTS public.users
    ADD COLUMN IF NOT EXISTS profile_img VARCHAR;
-- Commit the transaction
COMMIT;

-- -- Revert migration for removing the profile_img field

-- -- Start a transaction
-- BEGIN;

-- -- Remove the profile_img column from the public.users table
-- ALTER TABLE IF EXISTS public.users
--     DROP COLUMN IF EXISTS profile_img;

-- -- Commit the transaction
-- COMMIT;
