import React, { useState, useEffect, useCallback } from "react";
import read from "../lib/browser/read";
import write from "../lib/browser/write";
import Habit from "./habit";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";

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
  // const dnd = useSelector((state) => {
  //   state.completed.result.draggableId;
  // });

  async function renderHabits() {
    const x = await read("SELECT * from habits where roleId=?", [props.id]);
    props.dispatch({
      type: "add_habits",
      payload: { habits: x, index: props.index },
    });

    setHabits(x);
  }
  const habitList = useCallback(
    () =>
      props.state.roles[props.index]?.habits?.map((habit, i) => {
        return (
          <Habit
            key={habit.id}
            name={habit.name}
            description={habit.description}
            id={habit.id}
            state={props.state}
            dispatch={props.dispatch}
            index={i}
            roleIndex={props.index}
            reRender={renderHabits}
          />
        );
      }),
    [props.state.roles[props.index]?.habits]
  );

  async function deleteHandler() {
    const x = await write("DELETE FROM roles WHERE id=?", [props.id]);
    props.reRender();
  }

  async function createHabit() {
    const habitObject = await write(
      "INSERT INTO habits(name,roleId) VALUES(?,?)",
      [habit, props.id]
    );
    console.log(habitObject);
    renderHabits();
  }

  return (
    <Draggable draggableId={`roleId${props.id}`} index={props.index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
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
            <Droppable droppableId={`roleId${props.index}`} type="HABIT">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={{
                    backgroundColor: snapshot.isDraggingOver ? "blue" : "green",
                  }}
                  {...provided.droppableProps}
                >
                  {habitList()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            ;
          </div>
        </div>
      )}
    </Draggable>
  );
}
