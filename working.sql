-- select *
-- from habits;


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
