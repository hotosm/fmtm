-- ## Migration to:
-- * Add xforms table to link projects with multiple forms

-- Start a transaction
BEGIN;

CREATE TABLE public.xforms (
    id integer NOT NULL,
    project_id integer,
    form_id character varying,
    category character varying
);
ALTER TABLE public.xforms OWNER TO fmtm;
CREATE SEQUENCE public.xforms_id_seq
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

ALTER TABLE public.xforms
ADD CONSTRAINT fk_projects
FOREIGN KEY (project_id)
REFERENCES projects(id);

-- Commit the transaction
COMMIT;