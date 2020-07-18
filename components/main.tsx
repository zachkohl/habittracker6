import React, { useState, useEffect } from "react";
import axios from "axios";
import write from "../lib/browser/write";
import read from "../lib/browser/read";
import Role from "./role";
import { DragDropContext } from "react-beautiful-dnd";

export default function MainPage(props) {
  const [data, setData] = useState("");
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    getRoles();
  }, []);
  async function getRoles() {
    const x = await read("select * from roles", []);
    setRoles(x);
  }
  async function clickHandler() {
    const x = await write("INSERT INTO ROLES (name) VALUES (?)", [data]);
    getRoles();
  }

  const rolesList = roles.map((role) => {
    console.log(role);
    return (
      <Role
        key={role.id}
        name={role.name}
        description={role.description}
        id={role.id}
        reRender={getRoles}
      />
    );
  });

  function onDragEnd(e) {
    console.log(e);
    console.log("onDragEnd");
  }

  return (
    <div>
      <h5>Habit Tracker 6</h5>
      <input
        onChange={(e) => {
          setData(e.target.value);
        }}
        value={data}
      />
      <button onClick={clickHandler}>Add Role</button>
      <DragDropContext onDragEnd={onDragEnd}>{rolesList}</DragDropContext>
    </div>
  );
}
