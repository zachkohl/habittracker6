import React, { Component, useState, useEffect } from "react";
import read from "../lib/browser/read";
import write from "../lib/browser/write";
import moment from "moment";
import SampleNotes from "./SampleNotes";
function getById(state, habitId, roleId) {
  const role = state.roles.find((role) => role.id === roleId);
  const habit = role.habits.find((habit2) => habit2.id === habitId);
  return habit;
}

function findSample(samples, date) {
  let find = samples.find((habit2) => habit2.date === date);

  if (typeof find === "undefined") {
    return {
      id: null,
      date: date,
      success: 0,
      notes: "",
      changeFlag: "f",
    };
  } else return find;
}

function Review(props) {
  const [showDateTable, setShowDateTable] = useState(true);
  const [showMonthTable, setShowMonthTable] = useState(false);
  const [showYearTable, setShowYearTable] = useState(false);
  const [dateObject, setDateObject] = useState(moment());
  const [trigger, setTrigger] = useState(false);
  const [allMonths, setAllMonths] = useState(moment.months());
  const [samples, setSamples] = useState([]);
  useEffect(() => {
    readSample();
  }, [dateObject]);

  async function readSample() {
    const newDateObject = moment(Object.assign({}, dateObject));

    const x = await read(
      "SELECT * FROM samples WHERE habit_id=? AND (date BETWEEN ? AND ?)",
      [
        props.habitId,
        newDateObject.startOf("month").format("YYYY-MM-DD"),
        newDateObject.endOf("month").format("YYYY-MM-DD"),
      ]
    );
    setSamples(x);
  }

  const weekdayshort = moment.weekdaysShort();

  const firstDayOfMonth = () => {
    let dateObject = dateObject;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  const daysInMonth = (parameter) => {
    return moment(parameter).daysInMonth();
  };

  const month = () => {
    return dateObject.format("MMMM");
  };

  const MonthList = (props) => {
    let months = [];
    props.data.map((data) => {
      months.push(
        <td
          key={data}
          onClick={(e) => {
            setMonth(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });

    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);

    let monthlist = rows.map((d, i) => {
      let key = i + "_quarter";
      return <tr key={key}>{d}</tr>;
    });
    return monthlist;
  };

  const setMonth = (month) => {
    let monthNumber = allMonths.indexOf(month);
    let localDateObject = Object.assign({}, dateObject);
    localDateObject = moment(localDateObject).set("month", monthNumber);
    setDateObject(localDateObject);
    setShowDateTable(true);
    setShowMonthTable(false);
  };

  const showMonth = (e, month) => {
    setShowMonthTable(!showMonthTable);
    setShowDateTable(!showDateTable);
  };
  const year = () => {
    return dateObject.format("Y");
  };

  const showYear = (e, month) => {
    setShowYearTable(true);
    setShowMonthTable(false);
    setShowDateTable(false);
  };

  function getDates(startDate, stopDate) {
    var dateArray = [];
    var currentDate = moment(startDate);
    var stopDate = moment(stopDate);

    while (currentDate >= stopDate) {
      dateArray.push(moment(currentDate).format("YYYY"));
      currentDate = moment(currentDate).subtract(1, "year");
    }

    return dateArray;
  }

  const yearTable = (props) => {
    let months = [];
    let nextTen = moment()
      .set("year", props)
      .subtract(12, "year")
      .format("YYYY-MM-DD");

    let twelveYears = this.getDates(props, nextTen);

    twelveYears.map((data) => {
      months.push(
        <td
          key={data}
          onClick={(e) => {
            this.setYear(data);
          }}
        >
          <span>{data}</span>
        </td>
      );
    });
    let rows = [];
    let cells = [];

    months.forEach((row, i) => {
      if (i % 3 !== 0 || i == 0) {
        cells.push(row);
      } else {
        rows.push(cells);
        cells = [];
        cells.push(row);
      }
    });
    rows.push(cells);
    let yearList = rows.map((d, i) => {
      const key = i + 300;
      return <tr key={key}>{d}</tr>;
    });

    return (
      <table>
        <thead>
          <tr>
            <th>Select year</th>
          </tr>
        </thead>
        <tbody>{yearList}</tbody>
      </table>
    );
  };

  const setYear = (year) => {
    let localDateObject = Object.assign({}, dateObject);
    localDateObject = moment(localDateObject).set("year", year);
    setDateObject(localDateObject);
    setShowMonthTable(false);
    setShowYearTable(false);
    setShowDateTable(true);
  };

  const setDay = (d) => {
    let x = Object.assign({}, dateObject);
    setTrigger(!trigger);
    const y = moment(x).set("date", d);
    setDateObject(y);
    const date = y.format("YYYY-MM-DD");
    console.log(date);
    // const payload = {
    //   roleId: this.props.roleId,
    //   habitId: this.props.habitId,
    //   date: date,
    // };
    // this.props.changeDate(payload);
  };

  //https://programmingwithmosh.com/react/build-a-react-calendar-component-from-scratch/

  const checkDay = (d) => {
    let x = Object.assign({}, dateObject);
    const newDateObject = moment(x).set("date", d);
    const date = newDateObject.format("YYYY-MM-DD");
    //find match
    const match = samples.find((sample) => sample.date === date);
    if (typeof match === "undefined") {
      return "";
    } else if (match.status === "success") {
      return "green";
    } else if (match.status === "failure" && match.notes === "") {
      return "red";
    } else if (match.status === "failure") {
      return "yellow";
    }
  };

  let weekdayShortName = weekdayshort.map((day) => {
    return (
      <th key={day} className="week-day">
        {day}
      </th>
    );
  });

  let blanks = [];

  for (let i = 0; i < firstDayOfMonth(); i++) {
    let y = i + 50;
    blanks.push(
      <td key={y} className="calendar-day-empty">
        {""}
      </td>
    );
  }

  let daysInMonthLeft = [];
  for (let d = 1; d <= daysInMonth(dateObject); d++) {
    let color = checkDay(d);
    daysInMonthLeft.push(
      <td
        key={d}
        className="calendar-day"
        onClick={(e) => {
          setDay(d);
        }}
        style={{ backgroundColor: color }}
      >
        {d}
      </td>
    );
  }

  let totalSlots = [...blanks, ...daysInMonthLeft];

  let rows = [];
  let cells = [];

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row);
    } else {
      rows.push(cells);
      cells = [];
      cells.push(row);
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells);
    }
  });

  let daysInMonthRows = rows.map((d, i) => {
    let x = i + 100;
    return <tr key={x}>{d}</tr>;
  });

  return (
    <div>
      <div>
        <span
          onClick={(e) => {
            showMonth();
          }}
        >
          {month()}
        </span>
        <span
          onClick={(e) => {
            showYear();
          }}
        >
          {" "}
          {year()}
        </span>
        <span>, {dateObject.format("DD")}</span>
      </div>

      <div>
        <span>{showYearTable && <yearTable props={year()} />}</span>
      </div>

      <div>
        <table>
          <tbody>
            {showMonthTable && <MonthList data={moment.months()} />}
          </tbody>
        </table>
      </div>
      {showDateTable && (
        <table>
          <thead>
            <tr>{weekdayShortName}</tr>
          </thead>
          <tbody>{daysInMonthRows}</tbody>
        </table>
      )}
      <SampleNotes
        habitId={props.habitId}
        dateObject={dateObject}
        refreshCal={readSample}
      />
    </div>
  );
}

export default Review;
