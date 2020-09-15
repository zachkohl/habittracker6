import sortArray from "./sortArray";

export default function selectDropAction(e, state, dispatch) {
  console.log("are we here");
  console.log(e.type);
  switch (e.type) {
    case "ROLE":
      endDragRole(e, state, dispatch);
      return null;
    case "HABIT":
      endDragHabit(e, state, dispatch);

      return null;
    default:
  }

  return null;
}
function endDragRole(e, state, dispatch) {
  console.log("re order roles");
  if (e.destination?.index != null) {
    dispatch({
      type: "reorder_roles",
      payload: { sourceIndex: e.source.index, destIndex: e.destination.index },
    });
  }
}

function endDragHabit(e, state, dispatch) {
  dispatch({
    type: "move_habit",
    payload: { ...e },
  });
}
