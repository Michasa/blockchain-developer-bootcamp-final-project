import React, { useEffect, useState } from "react";
import PromiseDefinitionForm from "../components/PromiseDefinitionForm";

let Define = () => {
  const [userPromise, setUserPromise] = useState({
    userCommitments: ["", "", ""],
    deadline: undefined,
    dailyWager: undefined,
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
  };
  useEffect(() => {});

  return (
    <PromiseDefinitionForm
      userPromiseData={userPromise}
      handleSubmitForm={handleSubmit}
      handleSubmitData={handleUpdate}
    />
  );
};

/* <label>
          Commitments
          {userCommitments.forEach((commitment, index) => {
            return (
              <input
                type="text"
                name={`commitments[${index}]}`}
                value={commitment}
                onChange={(event) =>
                  setUserCommitments(
                    (userCommitments[index] = event.target.value)
                  )
                }
              />
            );
          })}
        </label> */

export default Define;
