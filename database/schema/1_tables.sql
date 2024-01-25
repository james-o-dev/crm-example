-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	user_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	email varchar NOT NULL,
	username varchar NULL,
	hashed_password varchar NOT NULL,
	date_created bigint NOT NULL DEFAULT now_unix_timestamp(),
	date_modified bigint NOT NULL DEFAULT now_unix_timestamp(),
	CONSTRAINT users_pk PRIMARY KEY (user_id),
	CONSTRAINT users_unique UNIQUE (email),
	CONSTRAINT users_unique_1 UNIQUE (username)
);


-- public.contacts definition

-- Drop table

-- DROP TABLE public.contacts;

CREATE TABLE public.contacts (
	contact_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	"name" varchar NOT NULL,
	email varchar NOT NULL,
	phone varchar NULL,
	notes varchar NULL,
	user_id uuid NOT NULL,
	archived bool NULL DEFAULT false,
	date_created bigint NOT NULL DEFAULT now_unix_timestamp(),
	date_modified bigint NOT NULL DEFAULT now_unix_timestamp(),
	CONSTRAINT contacts_pk PRIMARY KEY (contact_id),
	CONSTRAINT contacts_unique UNIQUE (email),
	CONSTRAINT contacts_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX contacts_user_id_idx ON public.contacts USING btree (user_id);


-- public.tasks definition

-- Drop table

-- DROP TABLE public.tasks;

CREATE TABLE public.tasks (
	task_id uuid NOT NULL DEFAULT uuid_generate_v4(),
	title varchar NOT NULL,
	notes varchar NULL,
	due_date bigint NULL,
	contact_id uuid NULL,
	user_id uuid NOT NULL,
	date_created bigint NOT NULL DEFAULT now_unix_timestamp(),
	date_modified bigint NOT NULL DEFAULT now_unix_timestamp(),
	CONSTRAINT tasks_pk PRIMARY KEY (task_id),
	CONSTRAINT tasks_contacts_fk FOREIGN KEY (contact_id) REFERENCES public.contacts(contact_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT tasks_users_fk FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX tasks_contact_id_idx ON public.tasks USING btree (contact_id);
CREATE INDEX tasks_user_id_idx ON public.tasks USING btree (user_id);