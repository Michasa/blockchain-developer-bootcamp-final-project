import React, { useEffect, useState } from "react";
import ExchangeRates from "./ExchangeRates";
import dayjs from "dayjs";
let localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

let DateDropdown = () => {
  let rows = [];
  for (let index = 0; index < 30; index++) {
    rows.push(
      <option value={index + 1} key={"day" + index}>
        {index + 1}
      </option>
    );
  }
  return rows;
};

function PromiseDefinitionForm({
  handleSubmitForm,
  handleUpdateData,
  userPromiseData,
}) {
  const [promiseTimingsFormatted, setPromiseTimingsFormatted] = useState({
    timeNow: dayjs().format("LL"),
    calculatedDeadline: undefined,
  });

  useEffect(() => {
    if (userPromiseData && userPromiseData.deadlineAsDaysAway) {
      setPromiseTimingsFormatted({
        ...promiseTimingsFormatted,
        calculatedDeadline: dayjs()
          .add(userPromiseData.deadlineAsDaysAway, "day")
          .format("LL"),
      });
    }
  }, [userPromiseData]);

  return (
    <div>
      <form onSubmit={handleSubmitForm}>
        <label>
          Commitments
          {userPromiseData.userCommitments.map((commitment, index) => (
            <input
              key={`commit${index}`}
              type="text"
              value={commitment}
              onChange={(event) => {
                let newData = userPromiseData.userCommitments;
                newData.splice(index, 1, event.target.value);
                handleUpdateData(newData, "userCommitments");
              }}
            />
          ))}
        </label>
        <label>
          Deadline
          <div> Today is: {promiseTimingsFormatted.timeNow}</div>
          <select
            id="selectNumber"
            value={userPromiseData.deadlineAsDaysAway}
            onChange={(event) => {
              let newData = Number(event.target.value);
              if (!newData) return;
              handleUpdateData(newData, "deadlineAsDaysAway");
            }}
          >
            {DateDropdown()}
          </select>
          Your Deadline is:
          {promiseTimingsFormatted.calculatedDeadline}
        </label>
        <label>
          <label>
            Wager(ETH): This is equivalent to{" "}
            <input
              type="number"
              value={userPromiseData.dailyWager}
              min={0}
              step={0.0001}
              onChange={(event) =>
                handleUpdateData(event.target.value, "dailyWager")
              }
            />{" "}
            <ExchangeRates amount={userPromiseData.dailyWager} />
          </label>
          <div>
            Total Pledge Pot:
            <div>
              {userPromiseData.dailyWager
                ? `${userPromiseData.dailyWager}ETH `
                : "please set an amount "}
              x {userPromiseData.deadlineAsDaysAway} day(s) =
              {Number(
                userPromiseData.dailyWager * userPromiseData.deadlineAsDaysAway
              ) ? (
                ` ${
                  userPromiseData.dailyWager *
                  userPromiseData.deadlineAsDaysAway
                } ETH`
              ) : (
                <p>Please fill out the missing info to get this total</p>
              )}
            </div>
            <ExchangeRates
              amount={
                userPromiseData.dailyWager * userPromiseData.deadlineAsDaysAway
              }
            />
          </div>
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}

export default PromiseDefinitionForm;
