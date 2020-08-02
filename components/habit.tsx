import React, { useState, useEffect } from "react";
import read from "../lib/browser/read";
import write from "../lib/browser/write";
import { Draggable } from "react-beautiful-dnd";

export default function Habit(props) {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description || "");

  function save() {
    console.log(props.id);
    write("UPDATE habits SET name=?, description=? WHERE id=?", [
      name,
      description,
      props.id,
    ]);
  }

  async function deleteHandler() {
    const x = await write("DELETE FROM habits WHERE id=?", [props.id]);
    props.dispatch({
      type: "delete_habit",
      payload: { habitIndex: props.index, roleIndex: props.roleIndex },
    });
  }

  return (
    <Draggable
      draggableId={`habitId${props.id}`}
      index={props.index}
      roleIndex={props.roleIndex}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div style={{ backgroundColor: "green", margin: "10px" }}>
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
          </div>
        </div>
      )}
    </Draggable>
  );
}
