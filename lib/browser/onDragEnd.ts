import sortArray from "./sortArray";

export default function (e, state, dispatch) {
  switch (e.type) {
    case "ROLE":
      endDragRole(e, state, dispatch);
      return null;
    case "HABIT":
      endDragHabit(e, state, dispatch);
    default:
      console.log("UNKNOWN TYPE", e.type);
  }

  return null;
}
function endDragRole(e, state, dispatch) {
  console.log("ROLE HAS MOVED");
  console.log(e);
  if (e.destination?.index != null) {
    dispatch({
      type: "reorder_roles",
      payload: { sourceIndex: e.source.index, destIndex: e.destination.index },
    });
  }
  //console.log(newList.map((role) => role.name));
  console.log("moved from index", e.source.index);
}

function endDragHabit(e, state, dispatch) {
  dispatch({
    type: "move_habit",
    payload: { ...e },
  });
}
