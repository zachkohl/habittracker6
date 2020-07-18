import React, { useState, useEffect } from "react";
import axios from "axios";
import write from "../lib/browser/write";
import read from "../lib/browser/read";
export default function HomePage(props) {
  const [data, setData] = useState("");
  const [habitList, setHabitList] = useState([]);
  useEffect(() => {
    getHabits();
  }, []);
  async function getHabits() {
    const response = await axios.post("/api/listHabits");
    console.log(response.data);
    setHabitList(response.data);
  }
  async function clickHandler() {
    const response = await axios.post("/api/addHabit", { habit: data });
    getHabits();
  }

  const habits = habitList.map((habit) => {
    return <div key={habit.id}>{habit.name}</div>;
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
      <button onClick={clickHandler}>Add Habit</button>
      {habits}
    </div>
  );
}
