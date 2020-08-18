import React, { useState, useEffect } from "react";
import read from "../lib/browser/read";
import write from "../lib/browser/write";
export default function SampleNotes(props) {
  const [sample, setSample] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    readSample();
  }, [props.dateObject, props.habitId, status]);

  useEffect(() => {
    readSample();
  }, []);

  async function save(newStatus) {
    let holding = status;
    if (typeof newStatus === "string") {
      holding = newStatus;
      setStatus(newStatus);
    }

    await write(
      "REPLACE INTO samples(date,notes,habit_id,status) VALUES(?,?,?,?)",
      [props.dateObject.format("YYYY-MM-DD"), sample, props.habitId, holding]
    );
    props.refreshCal();
  }

  async function readSample() {
    const x = await read(
      "SELECT * FROM samples WHERE habit_id=? AND date=date(?)",
      [props.habitId, props.dateObject.format("YYYY-MM-DD")]
    );
    console.log(x);
    const text = typeof x[0]?.notes === "string" ? x[0]?.notes : "";

    const readStatus = typeof x[0]?.status === "string" ? x[0]?.status : "";
    console.log(readStatus);
    setSample(text);
    setStatus(readStatus);
  }

  const styleObject = {
    success: { backgroundColor: "green" },
  };

  return (
    <div>
      <button
        onClick={async (e) => {
          await save("success");
        }}
        style={status === "success" ? { backgroundColor: "green" } : {}}
      >
        Success
      </button>
      <button
        onClick={async (e) => {
          await save("failure");
        }}
        style={status === "failure" ? { backgroundColor: "red" } : {}}
      >
        Failure
      </button>
      <button
        onClick={async (e) => {
          await save("");
        }}
      >
        Clear
      </button>
      <textarea
        value={sample}
        onChange={(e) => setSample(e.target.value)}
        onBlur={save}
      />
    </div>
  );
}
