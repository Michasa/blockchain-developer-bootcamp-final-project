import React, { useContext, useState } from "react";
import PromiseDefinitionForm from "../components/PromiseDefinitionForm";
import RequirementsGate from "../components/RequirementsGate";
import { Web3Interface } from "../contexts/Web3Interface";

let DefinePromise = () => {
  let {
    selectedContract: { isPromiseActive, address },
    contractFunctions: {},
    isLoading,
  } = useContext(Web3Interface);

  const [userPromise, setUserPromise] = useState({
    userCommitments: new Array(3).fill(""),
    deadlineAsDaysAway: 1,
    dailyWager: 0,
  });

  let handleUpdate = (data, property) => {
    setUserPromise({
      ...userPromise,
      [property]: data,
    });
  };

  let handleSubmit = (event) => {
    event.preventDefault();
    console.log(userPromise);
    // let newData = dayjs.unix(days).add(days, "day").unix();
  };

  return (
    <RequirementsGate
      isValid={address}
      message="Please select a contract to begin or please create and then select one"
    >
      <RequirementsGate
        isValid={!isPromiseActive}
        message="This contract has an active promise! Please let it reach its deadline and cashout to define a new one"
      >
        <PromiseDefinitionForm
          userPromiseData={userPromise}
          handleSubmitForm={handleSubmit}
          handleUpdateData={handleUpdate}
        />
      </RequirementsGate>
    </RequirementsGate>
  );
};

export default DefinePromise;
