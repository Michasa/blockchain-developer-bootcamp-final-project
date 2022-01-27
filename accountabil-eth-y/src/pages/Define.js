import React, { useState } from "react";

function Define() {
  //TODO make redux?
  const [userInputs, setuserInputs] = useState("second");

  return (
    <div>
      <h1> Define</h1>
      <div>Todos</div>
      <div>Daily Wager</div>
      <div>Duration</div>
      <div>Total Amount Needed</div>
      <button>Activate Promise</button>
    </div>
  );
}

export default Define;
