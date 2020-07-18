-- SQLite
-- select *
-- from habits where id=6;

--DROP TABLE roles;

-- CREATE TABLE roles (
-- id INTEGER PRIMARY KEY,
-- name TEXT,
-- description TEXT,
-- reactOrder INTEGER,
-- open REAL
-- );

 -- SELECT * FROM roles;


 -- DROP TABLE habits;


--  CREATE TABLE habits(
--  id INTEGER PRIMARY KEY,
--  name TEXT,
--  description TEXT,
--  notes TEXT,
--  reactOrder INTEGER,
--  roleId INTEGER NOT NULL,
--  open REAL,
--  FOREIGN KEY (roleId)
--     REFERENCES roles(id)
--         ON DELETE CASCADE
-- );

select * from habits;