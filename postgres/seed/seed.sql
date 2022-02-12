BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Marco', 'marco@gmail.com', 0, '2022-02-11');
INSERT into logins (hash, email) values ('$2a$10$e7RLCtiMjwi4RAlzrOrJLeiHpvShr7btSE2FysWHy6F2ll2O3p0Hm', 'marco@gmail.com');

COMMIT;