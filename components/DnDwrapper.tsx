import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

export default function Wrapper(props) {
  function onDragEnd() {
    console.log("onDragEnd");
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>{props.children}</DragDropContext>
  );
}
