-- select *
-- from habits;



CREATE TABLE roles (
id INTEGER PRIMARY KEY,
name TEXT,
description TEXT,
reactOrder INTEGER,
open REAL
)


CREATE TABLE habits(
 id INTEGER PRIMARY KEY,
 name TEXT,
 description TEXT,
 notes TEXT,
 reactOrder INTEGER,
 roleId INTEGER NOT NULL,
 open REAL,
 FOREIGN KEY (roleId)
    REFERENCES roles(id)
        ON DELETE CASCADE
)


CREATE TABLE samples (
id INTEGER PRIMARY KEY,
notes TEXT,
status TEXT,
habit_id INTEGER,
date TEXT,
UNIQUE(habit_id,date),
FOREIGN KEY (habit_id)
    REFERENCES habits(id)
    ON DELETE CASCADE
)

