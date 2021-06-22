CREATE TABLE IF NOT EXISTS public."Users"
(
    uid uuid NOT NULL,
    email character varying(500) COLLATE pg_catalog."default" NOT NULL,
    password character varying(500) COLLATE pg_catalog."default" NOT NULL,
    username character varying(100) COLLATE pg_catalog."default" NOT NULL,
    dob integer NOT NULL,
    creation_date integer NOT NULL,
    display_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    admin boolean NOT NULL,
    verified boolean NOT NULL,
    favorites text COLLATE pg_catalog."default",
    played text COLLATE pg_catalog."default",
    rated text COLLATE pg_catalog."default",
    settings text COLLATE pg_catalog."default",
    CONSTRAINT "Users_pkey" PRIMARY KEY (uid)
);