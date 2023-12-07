-- Start a transaction
BEGIN;

CREATE TABLE IF NOT EXISTS public.project_aoi (
    id integer NOT NULL,
    project_id character varying,
    geom public.geometry(Geometry,4326),
    tags jsonb
);
ALTER TABLE public.project_aoi OWNER TO fmtm;
CREATE SEQUENCE IF NOT EXISTS public.project_aoi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.project_aoi_id_seq OWNER TO fmtm;
ALTER SEQUENCE public.project_aoi_id_seq OWNED BY public.project_aoi.id;


CREATE TABLE IF NOT EXISTS public.ways_line (
    id integer NOT NULL,
    project_id character varying,
    osm_id character varying,
    geom public.geometry(Geometry,4326),
    tags jsonb
);
ALTER TABLE public.ways_line OWNER TO fmtm;
CREATE SEQUENCE IF NOT EXISTS public.ways_line_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.ways_line_id_seq OWNER TO fmtm;
ALTER SEQUENCE public.ways_line_id_seq OWNED BY public.ways_line.id;


CREATE TABLE IF NOT EXISTS public.ways_poly (
    id integer NOT NULL,
    project_id character varying,
    osm_id character varying,
    geom public.geometry(Geometry,4326),
    tags jsonb
);
ALTER TABLE public.ways_poly OWNER TO fmtm;
CREATE SEQUENCE IF NOT EXISTS public.ways_poly_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE public.ways_poly_id_seq OWNER TO fmtm;
ALTER SEQUENCE public.ways_poly_id_seq OWNED BY public.ways_poly.id;


-- Constraints and indexes
ALTER TABLE ONLY public.project_aoi
    DROP CONSTRAINT IF EXISTS project_aoi_pkey; 
ALTER TABLE ONLY public.project_aoi
    ADD CONSTRAINT project_aoi_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.project_aoi
    DROP CONSTRAINT IF EXISTS ways_line_pkey; 
ALTER TABLE ONLY public.ways_line
    ADD CONSTRAINT ways_line_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.project_aoi
    DROP CONSTRAINT IF EXISTS ways_poly_pkey; 
ALTER TABLE ONLY public.ways_poly
    ADD CONSTRAINT ways_poly_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.project_aoi ALTER COLUMN id SET DEFAULT nextval('public.project_aoi_id_seq'::regclass);
ALTER TABLE ONLY public.ways_line ALTER COLUMN id SET DEFAULT nextval('public.ways_line_id_seq'::regclass);
ALTER TABLE ONLY public.ways_poly ALTER COLUMN id SET DEFAULT nextval('public.ways_poly_id_seq'::regclass);

CREATE INDEX IF NOT EXISTS idx_project_aoi_geom ON public.project_aoi USING gist (geom);
CREATE INDEX IF NOT EXISTS idx_ways_line_geom ON public.ways_line USING gist (geom);
CREATE INDEX IF NOT EXISTS idx_ways_poly_geom ON public.ways_poly USING gist (geom);
-- Commit the transaction
COMMIT;
