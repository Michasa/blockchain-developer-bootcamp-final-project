import React, { useState } from "react";

function CheckIn() {
  const [userResponse, seuserResponse] = useState(new Array(3).fill(false));

  const handleUpdate = (value, index) => {
    let newData = userResponse;
    newData.splice(index, 1, value);
    seuserResponse(newData);
  };

  let handleSubmit = (event) => {
    event.preventDefault();
    let hasCompletedAll = userResponse.every((answer) => answer);
    console.log(userResponse, hasCompletedAll);
    // let newData = dayjs.unix(days).add(days, "day").unix();
  };

  return (
    <div>
      <h1> Submit Check</h1>
      <div>Dates + Other info</div>
      <form onSubmit={handleSubmit}>
        {["Promise1", "Promise2", "Promise3"].map((commitment, index) => (
          <span key={`commitment${index + 1}`}>
            <input
              type="checkbox"
              id={commitment}
              value={true}
              onChange={(event) => handleUpdate(event.target.checked, index)}
            />
            <label for={commitment}> {commitment}</label>
          </span>
        ))}
        <input type="submit" />
      </form>
      {/* <div> Checklist</div>
      Dates Infomation Checklist of todos
      <button>submit</button> */}
    </div>
  );
}

export default CheckIn;
