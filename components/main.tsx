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

const initialState = { roles: [] };

function reducer(state, action) {
  switch (action.type) {
    case "move_habit":
      const moveState = { ...state };
      const sourceId = action.payload.source.droppableId.slice(6);
      if (action.payload.destination === null) {
        return moveState;
      } else if (
        action.payload.destination.droppableId ===
        action.payload.source.droppableId
      ) {
        const habitArray = Array.from(moveState.roles[sourceId].habits);
        const [removedHabit] = habitArray.splice(
          action.payload.source.index,
          1
        );

        habitArray.splice(action.payload.destination.index, 0, removedHabit);
        moveState.roles[sourceId].habits = habitArray;

        const params = habitArray.map((habit: any, i) => {
          return {
            sql: `UPDATE HABITS SET reactOrder=? where id=?`,
            params: [i, habit.id],
          };
        });
        parallel(params);

        return moveState;
      } else {
        const originId = action.payload.source.droppableId.slice(6);
        const destinationId = action.payload.destination.droppableId.slice(6);
        const oldArray = Array.from(moveState.roles[originId].habits);
        const newArray = Array.from(moveState.roles[destinationId].habits);
        const [removedOldHabit] = oldArray.splice(
          action.payload.source.index,
          1
        );
        newArray.splice(action.payload.destination.index, 0, removedOldHabit);
        moveState.roles[originId].habits = oldArray;
        moveState.roles[destinationId].habits = newArray;

        //get role ids
        const slqRoleIdOrigin = moveState.roles[destinationId].id;
        const slqRoleIdDestination = moveState.roles[originId].id;
        const OldArrayParams = oldArray.map((habit: any, i) => {
          return {
            sql: `UPDATE HABITS SET reactOrder=?, roleId=? where id=?`,
            params: [i, slqRoleIdOrigin, habit.id],
          };
        });
        const newArrayParams = newArray.map((habit: any, i) => {
          return {
            sql: `UPDATE HABITS SET reactOrder=?, roleId=? where id=?`,
            params: [i, slqRoleIdDestination, habit.id],
          };
        });

        const params = OldArrayParams.concat(newArrayParams);

        parallel(params);

        return moveState;
      }

    case "delete_habit":
      const deleteHabit = { ...state };
      const roleIndex = action.payload.roleIndex;
      deleteHabit.roles[roleIndex].habits.splice(action.payload.habitIndex, 1);

      return deleteHabit;

    case "add_habits":
      const habitsState = { ...state };

      const Rindex = action.payload.index;
      habitsState.roles[Rindex].habits = action.payload.habits;

      return habitsState;

    case "add_roles":
      return { ...state, roles: action.payload };
    case "reorder_roles":
      let newState = _.cloneDeep(state);

      const newArray = Array.from(newState.roles);
      const [removed] = newArray.splice(action.payload.sourceIndex, 1);

      newArray.splice(action.payload.destIndex, 0, removed);

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

export default function MainPage(props) {
  const [data, setData] = useState("");
  // const [roles, setRoles] = useState([]);

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getRoles();
  }, []);
  async function getRoles() {
    const x = await read("select * from roles", []);

    let y = SortArray(x);

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
            {function mainInner(provided, snapshot) {
              return (
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
              );
            }}
          </Droppable>
        </div>
      </DragDropContext>
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
