import React from "react";
import ExchangeRates from "./ExchangeRates";

function PromiseDefinitionForm({
  handleSubmitForm,
  handleUpdateData,
  userPromiseData,
}) {
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
          <input
            type="date"
            onChange={(event) => console.log(event.target.value)}
          />
        </label>
        <input type="submit" required />
        <label>
          <label>
            Wager(ETH): This is equivalent to{" "}
            <input
              type="number"
              value={userPromiseData.dailyWager}
              required
              min={0}
              step={0.001}
              onChange={(event) =>
                handleUpdateData(event.target.value, "dailyWager")
              }
            />{" "}
            <ExchangeRates amount={userPromiseData.dailyWager} />
          </label>
          <div>
            Total Pledge Pot:
            {userPromiseData.dailyWager || "amount per day"} for{" "}
            {7 || "days of check in"} =
            {Number(userPromiseData.dailyWager * 7) ? (
              `${userPromiseData.dailyWager * 7} ETH`
            ) : (
              <p>Please fill out the missing info to get this total</p>
            )}
            <ExchangeRates amount={userPromiseData.dailyWager * 7} />
          </div>
        </label>
      </form>
    </div>
  );
}

export default PromiseDefinitionForm;
