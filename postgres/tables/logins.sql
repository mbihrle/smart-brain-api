BEGIN TRANSACTION;

CREATE TABLE logins (
	id serial PRIMARY KEY,
	hash varchar(100) NOT NULL,
	email text UNIQUE NOT NULL
);

COMMIT;