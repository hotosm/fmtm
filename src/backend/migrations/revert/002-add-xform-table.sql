-- Start a transaction
BEGIN;

DROP TABLE public.xforms;
DROP SEQUENCE public.xforms_id_seq;

-- Commit the transaction
COMMIT;
