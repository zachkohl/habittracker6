import React, { useState, useEffect, useReducer, useMemo } from "react";
import axios from "axios";
import write from "../lib/browser/write";
import read from "../lib/browser/read";
import parallel from "../lib/browser/parallel";
import Role from "./role";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import onDragEnd from "../lib/browser/onDragEnd";
import SortArray from "../lib/browser/sortArray";
import _ from "lodash";
export default function MainPage(props) {
  const [data, setData] = useState("");
  // const [roles, setRoles] = useState([]);

  const initialState = { roles: [] };

  function reducer(state, action) {
    switch (action.type) {
      case "move_habit":
        const moveState = { ...state };
        console.log(action.payload);
        const roleId = action.payload.destination.droppableId.slice(6);
        console.log(roleId);
        if (action.payload.destination.dropabbleId === null) {
          return moveState;
        } else if (
          action.payload.destination.dropabbleId ===
          action.payload.source.dropabbleId
        ) {
          const habitArray = Array.from(moveState.roles[roleId].habits);
          const [removedHabit] = habitArray.splice(
            action.payload.source.index,
            1
          );
          console.log(action.payload);
          habitArray.splice(action.payload.destination.index, 0, removedHabit);
          moveState.roles[roleId].habits = habitArray;
          //   const params = newArray.map((role: any, i) => {
          //     return {
          //       sql: `UPDATE ROLES SET reactOrder=? where id=?`,
          //       params: [i, role.id],
          //     };
          //   });
          //   parallel(params);
          // }
          return state;
        }
        return state;

      case "delete_habit":
        const deleteHabit = { ...state };

        deleteHabit.roles[action.payload.roleIndex].habits.splice(
          action.payload.habitIndex,
          1
        );

        return deleteHabit;

      case "add_habit":
        const habitState = { ...state };
        habitState.roles[action.payload.index].habits = action.payload.habit;

        return habitState;

      case "add_roles":
        return { ...state, roles: action.payload };
      case "reorder_roles":
        console.log(state);
        let newState = _.cloneDeep(state);

        const newArray = Array.from(newState.roles);
        const [removed] = newArray.splice(action.payload.sourceIndex, 1);
        console.log(removed);

        newArray.splice(action.payload.destIndex, 0, removed);
        console.log(newArray);
        newState.roles = newArray;
        const params = newArray.map((role: any, i) => {
          return {
            sql: `UPDATE ROLES SET reactOrder=? where id=?`,
            params: [i, role.id],
          };
        });
        parallel(params);
        return newState;
      default:
        throw new Error("Do not have a case for that action in the reducer");
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getRoles();
  }, []);
  async function getRoles() {
    const x = await read("select * from roles", []);
    console.log(x);
    let y = SortArray(x);
    console.log(y);
    dispatch({ type: "add_roles", payload: y });
  }

  const nextOrder = useMemo(() => {
    let x = 0;
    for (let i = 0; i < state.roles.length; i++) {
      if (state.roles[i].reactOrder >= x) {
        x = state.roles[i].reactOrder;
      }
    }
    x = x + 1;
    return x;
  }, [state.roles]);

  async function clickHandler() {
    const x = await write("INSERT INTO ROLES (name,reactOrder) VALUES (?,?)", [
      data,
      nextOrder,
    ]);
    getRoles();
  }
  const roles = useMemo(() => state.roles, [state.roles]);
  const rolesList = roles.map((role, i) => {
    return (
      <Role
        state={state}
        dispatch={dispatch}
        key={role.reactOrder}
        name={role.name}
        description={role.description}
        index={i}
        id={role.id}
        reRender={getRoles}
      />
    );
  });

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
      <DragDropContext
        onDragEnd={(e) => {
          onDragEnd(e, state, dispatch);
        }}
      >
        <div>
          <Droppable droppableId={`roleArea`} type="ROLE">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? "blue" : "red",
                }}
                {...provided.droppableProps}
              >
                {rolesList}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      {JSON.stringify(state, null, 2)}
    </div>
  );
}
function Wrapper(props) {
  return (
    <div>
      <Droppable droppableId={`roleArea`} type="ROLE">
        {props.rolesList}
      </Droppable>
    </div>
  );
}
