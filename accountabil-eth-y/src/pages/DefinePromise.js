import React, { useState } from "react";
import PromiseDefinitionForm from "../components/PromiseDefinitionForm";

let DefinePromise = () => {
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
    <PromiseDefinitionForm
      userPromiseData={userPromise}
      handleSubmitForm={handleSubmit}
      handleUpdateData={handleUpdate}
    />
  );
};

export default DefinePromise;
