import ExchangeRates from "./ExchangeRates";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import DateDropdown from "./DateDropdown";
dayjs.extend(localizedFormat);

const PromiseDefinitionForm = ({
  validateSubmission,
  handlePromiseUpdate,
  userPromiseData,
}) => {
  let { userCommitments, dailyWager, deadlineAsDaysAway } = userPromiseData;

  let dateNow = dayjs();
  let returnDeadlineDate = () => dateNow.add(deadlineAsDaysAway, "day");

  return (
    <form onSubmit={validateSubmission}>
      <label>
        Commitments (please enter at least one)
        {userCommitments.map((commitment, index) => (
          <input
            key={`commit${index}`}
            type="text"
            value={commitment}
            onChange={(event) => {
              let newData = userCommitments;
              newData.splice(index, 1, event.target.value);
              handlePromiseUpdate(newData, "userCommitments");
            }}
          />
        ))}
      </label>
      <label>
        Deadline
        <div> Today is: {dateNow.format("LL")}</div>
        <select
          id="selectNumber"
          value={deadlineAsDaysAway}
          onChange={(event) => {
            let newData = Number(event.target.value);
            if (!newData) return;
            handlePromiseUpdate(newData, "deadlineAsDaysAway");
          }}
        >
          <DateDropdown />
        </select>
        Your Deadline is:
        {returnDeadlineDate().format("LL")}
      </label>
      <label>
        <label>
          Wager(ETH): This is equivalent to
          <input
            type="number"
            value={dailyWager}
            min={0}
            step={0.0001}
            onChange={(event) =>
              handlePromiseUpdate(Number(event.target.value), "dailyWager")
            }
          />
          <ExchangeRates amount={dailyWager} />
        </label>
        <div>
          Total Pledge Pot:
          <div>
            {dailyWager ? `${dailyWager}ETH ` : <b>Please set an amounts </b>}x{" "}
            {deadlineAsDaysAway} day(s) =
            {Number(dailyWager * deadlineAsDaysAway) ? (
              ` ${(dailyWager * deadlineAsDaysAway).toFixed(4)} ETH`
            ) : (
              <p>Please fill out the missing info to get this total</p>
            )}
          </div>
          <ExchangeRates amount={dailyWager * deadlineAsDaysAway} />
        </div>
      </label>
      <input type="submit" />
    </form>
  );
};

export default PromiseDefinitionForm;
