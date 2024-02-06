
## Revert Migration (comment above, uncomment below)
-- Start a transaction
BEGIN;

-- Drop the 'task_comment' table if it exists
DROP TABLE IF EXISTS public.task_comment;

-- Commit the transaction
COMMIT;