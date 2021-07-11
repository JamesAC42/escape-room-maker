CREATE TABLE IF NOT EXISTS public."maps"
(
    uid uuid NOT NULL,
    creator uuid NOT NULL,
    created_on timestamp without time zone NOT NULL,
    last_modified timestamp without time zone NOT NULL,
    ratings text COLLATE pg_catalog."default" NOT NULL,
    time_limit integer NOT NULL DEFAULT 0,
    tags text COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    title character varying(256) COLLATE pg_catalog."default" NOT NULL,
    explicit boolean NOT NULL,
    times_completed integer NOT NULL DEFAULT 0,
    graph text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "maps_pkey" PRIMARY KEY (uid)
)
WITH (
    OIDS = FALSE
)
