import React, { useState, useEffect } from "react";
import read from "../lib/browser/read";
import write from "../lib/browser/write";
import Habit from "./habit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
export default function Role(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description || "");
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState([]);

  function save() {
    console.log(props.id);
    write("UPDATE ROLES SET name=?, description=? WHERE id=?", [
      name,
      description,
      props.id,
    ]);
  }

  useEffect(() => {
    renderHabits();
  }, []);

  async function renderHabits() {
    console.log("in render Habits");
    const x = await read("SELECT * from habits where roleId=?", [props.id]);
    console.log(x);
    setHabits(x);
  }
  const habitList = habits.map((habit) => {
    return (
      <Habit
        key={habit.id}
        name={habit.name}
        description={habit.description}
        id={habit.id}
        reRender={renderHabits}
      />
    );
  });

  async function deleteHandler() {
    const x = await write("DELETE FROM roles WHERE id=?", [props.id]);
    props.reRender();
  }

  function createHabit() {
    write("INSERT INTO habits(name,roleId) VALUES(?,?)", [habit, props.id]);
    renderHabits();
  }

  return (
    <div style={{ backgroundColor: "blue", margin: "10px" }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={save}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onBlur={save}
      />
      <button onClick={deleteHandler}>delete</button>
      <input value={habit} onChange={(e) => setHabit(e.target.value)} />
      <button onClick={createHabit}>Add Habit</button>
      <Droppable droppableId={`roleId${props.id}`} type="HABIT">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={{
              backgroundColor: snapshot.isDraggingOver ? "blue" : "green",
            }}
            {...provided.droppableProps}
          >
            {habitList}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      ;
    </div>
  );
}
