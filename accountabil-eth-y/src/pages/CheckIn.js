import React, { useState, useContext } from "react";
import RequirementsGate from "../components/RequirementsGate";
import { Web3Interface } from "../contexts/Web3Interface";

function CheckIn() {
  const [userResponse, seuserResponse] = useState(new Array(3).fill(false));

  let {
    selectedContract: { address, isPromiseActive },
    contractFunctions: { setNominee },
    isLoading,
  } = useContext(Web3Interface);

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
    <RequirementsGate
      isValid={address}
      message="Please select a contract to begin or please create and then select one"
    >
      <RequirementsGate
        isValid={isPromiseActive}
        message="This contract doesn't have an active promise! Please create one first "
      >
        <main>
          <h1> Submit Check</h1>
          <div>Dates + Other info</div>
          <form onSubmit={handleSubmit}>
            {["Promise1", "Promise2", "Promise3"].map((commitment, index) => (
              <span key={`commitment${index + 1}`}>
                <input
                  type="checkbox"
                  id={commitment}
                  value={true}
                  onChange={(event) =>
                    handleUpdate(event.target.checked, index)
                  }
                />
                <label htmlFor={commitment}> {commitment}</label>
              </span>
            ))}
            <input type="submit" />
          </form>
          {/* <div> Checklist</div>
      Dates Infomation Checklist of todos
      <button>submit</button> */}
        </main>
      </RequirementsGate>
    </RequirementsGate>
  );
}

export default CheckIn;
