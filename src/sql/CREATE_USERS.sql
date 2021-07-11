CREATE TABLE public.users
(
    uid uuid NOT NULL,
    email character varying(500) COLLATE pg_catalog."default" NOT NULL,
    password character varying(500) COLLATE pg_catalog."default" NOT NULL,
    username character varying(100) COLLATE pg_catalog."default" NOT NULL,
    display_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    admin boolean NOT NULL,
    verified boolean NOT NULL,
    favorites text COLLATE pg_catalog."default",
    played text COLLATE pg_catalog."default",
    rated text COLLATE pg_catalog."default",
    settings text COLLATE pg_catalog."default",
    dob timestamp without time zone NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    CONSTRAINT "Users_pkey" PRIMARY KEY (uid)
)