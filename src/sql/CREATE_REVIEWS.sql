CREATE TABLE public.reviews
(
    uid uuid NOT NULL,
    map_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating smallint NOT NULL,
    title character varying(500) COLLATE pg_catalog."default" NOT NULL,
    body text COLLATE pg_catalog."default" NOT NULL,
    "timestamp" timestamp without time zone,
    CONSTRAINT reviews_pkey PRIMARY KEY (uid)
)