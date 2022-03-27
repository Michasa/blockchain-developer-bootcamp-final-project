import dayjs from "dayjs";
import { isValidAddress } from "../../utils/functions";

const SelectedPromiseContract = ({ contractData }) => {
  let {
    contractAddress,
    nomineeAddress,
    isPromiseActive,
    promiseDeadline,
    promiseCheckOpen,
    promiseCheckClosed,
  } = contractData;

  const displayReadableDate = (date) => {
    return dayjs.unix(date).format("MMM D, YYYY h:mm A");
  };

  return (
    <div className="selected-contract-details">
      {contractAddress ? (
        <>
          <b>Active Contract Details ({contractAddress})</b>{" "}
          <ul className="promise-timings">
            <li>
              Nominee:
              {isValidAddress(nomineeAddress) ? nomineeAddress : "None Set"}
            </li>
            <li>Promise Active: {isPromiseActive.toString()}</li>
            {isPromiseActive && (
              <>
                <li>
                  Promise Deadline: {displayReadableDate(promiseDeadline)}
                </li>
                <li>
                  Daily Check In Open :
                  {promiseCheckOpen
                    ? displayReadableDate(promiseCheckOpen)
                    : "not applicable"}
                </li>
                <li>
                  Daily Check In Close :
                  {promiseCheckClosed
                    ? displayReadableDate(promiseCheckClosed)
                    : "not applicable"}
                </li>
              </>
            )}
          </ul>{" "}
        </>
      ) : (
        <p>Please select a contract</p>
      )}
    </div>
  );
};
export default SelectedPromiseContract;
