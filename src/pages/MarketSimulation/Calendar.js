import { useState } from "react";
import "./Calendar.css"
const Calendar = () => {
  const [selectedWeek, setselectedWeek] = useState([null, null]);

  const onDateClickHandle = (week) => {
    if(selectedWeek[0] === null && selectedWeek[1] === null){
      setselectedWeek(weeks =>(
        {...weeks,
          [0]: week,
        }
        ));
    }
    else if(selectedWeek[0] !== null && selectedWeek[1] === null){
      setselectedWeek(weeks =>(
        {...weeks,
          [1]: week > weeks[0] ? week : weeks[0],
          [0]: week > weeks[0] ? weeks[0] : week
        }
        ));
    }
    else{
      setselectedWeek(weeks =>(
        {...weeks,
          [0]: week,
          [1]: null
        }
        ));
    }
      
  };

  const renderCells = () => {
    const endDate1 = 13;
    const rows1 = [];
    let weeks1 = [<div className="col cell2"><span className="season">Winter</span></div>];
    let week1 = 1;
    let formattedDate1 = "";
    while (week1 <= endDate1) {
      for (let i = week1; i < endDate1 + 1; i++) {
        formattedDate1 = i;
        const cloneweek = week1;
        weeks1.push(
          
          <div
            className={`col cell${selectedWeek[0] === week1 || (week1 >= selectedWeek[0] &&  week1 <= selectedWeek[1]) ? " selected" : ""}`}
            onClick={() => {
              const weekStr = cloneweek;
              onDateClickHandle(cloneweek, weekStr);
            }}
          >
            <span className="number">{formattedDate1}</span>
          </div>
          
        );
        week1 = week1 + 1;
      }

      rows1.push(
        <div className="row" key={week1}>
          {weeks1}
        </div>
      );
      weeks1 = [];
    }
    const endDate2 = 26;
    const rows2 = [];
    let weeks2 = [<div className="col cell2"><span className="season">Spring</span></div>];
    let week2 = 14;
    let formattedDate2 = "";
    while (week2 <= endDate2) {
      for (let i = week2; i < endDate2 + 1; i++) {
        formattedDate2 = i;
        const cloneweek = week2;
        weeks2.push(
          <div
            className={`col cell ${selectedWeek[0] === week2 || (week2 >= selectedWeek[0] &&  week2 <= selectedWeek[1]) ? "selected" : ""}`}
            onClick={() => {
              const weekStr = cloneweek;
              onDateClickHandle(cloneweek, weekStr);
            }}
          >
            <span className="number">{formattedDate2}</span>
          </div>
        );
        week2 = week2 + 1;
      }

      rows2.push(
        <div className="row" key={week2}>
          {weeks2}
        </div>
      );
    }
    const endDate3 = 39;
    const rows3 = [];
    let weeks3 = [<div className="col cell2"><span className="season">Summer</span></div>];
    let week3 = 27;
    let formattedDate3 = "";
    while (week3 <= endDate3) {
      for (let i = week3; i < endDate3 + 1; i++) {
        formattedDate3 = i;
        const cloneweek = week3;
        weeks3.push(
          <div
            className={`col cell ${selectedWeek[0] === week3 || (week3 >= selectedWeek[0] &&  week3 <= selectedWeek[1]) ? "selected" : ""}`}
            onClick={() => {
              const weekStr = cloneweek;
              onDateClickHandle(cloneweek, weekStr);
            }}
          >
            <span className="number">{formattedDate3}</span>
          </div>
        );
        week3 = week3 + 1;
      }

      rows3.push(
        <div className="row" key={week3}>
          {weeks3}
        </div>
      );
    }
    const endDate4 = 52;
    const rows4 = [];
    let weeks4 = [<div className="col cell2"><span className="season">Fall</span></div>];
    let week4 = 40;
    let formattedDate4 = "";
    while (week4 <= endDate4) {
      for (let i = week4; i < endDate4 + 1; i++) {
        formattedDate4 = i;
        const cloneweek = week4;
        weeks4.push(
          <div
            className={`col cell ${selectedWeek[0] === week4 || (week4 >= selectedWeek[0] &&  week4 <= selectedWeek[1]) ? "selected" : ""}`}
            onClick={() => {
              const weekStr = cloneweek;
              onDateClickHandle(cloneweek, weekStr);
            }}
          >
            <span className="number">{formattedDate4}</span>
          </div>
        );
        week4 = week4 + 1;
      }

      rows4.push(
        <div className="row2" key={week3}>
          {weeks4}
        </div>
      );
    }

    
    return (
      <div>
        <div id="calendar">
          <div className="body">{rows1}</div>
          <div className="body">{rows2}</div>
          <div className="body">{rows3}</div>
          <div className="body">{rows4}</div>
        </div>
      </div>
      
    );
  };

  return (
    <div>
        <div className="calendar">{renderCells()}</div>
        <div className="label">
          {selectedWeek[0] === null && <label>Select starting week</label>}
          {selectedWeek[0] !== null && selectedWeek[1] === null && <label>Select ending week</label>}
        </div>
    </div>
  
  );
};

export default Calendar;
