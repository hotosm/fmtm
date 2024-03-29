-- ## Migration to:
-- * Add xforms table to link projects with multiple forms

-- Start a transaction
BEGIN;

CREATE TABLE IF NOT EXISTS public.xforms (
    id integer NOT NULL,
    project_id integer,
    odk_form_id character varying,
    category character varying
);
ALTER TABLE public.xforms OWNER TO fmtm;
CREATE SEQUENCE IF NOT EXISTS public.xforms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.xforms_id_seq OWNER TO fmtm;
ALTER SEQUENCE public.xforms_id_seq OWNED BY public.xforms.id;
ALTER TABLE ONLY public.xforms ALTER COLUMN id SET DEFAULT nextval('public.xforms_id_seq'::regclass);
ALTER TABLE ONLY public.xforms
    ADD CONSTRAINT xforms_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.xforms
    ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES public.projects(id);

-- Commit the transaction
COMMIT;