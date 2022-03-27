import { useState, useContext } from "react";
import RequirementsGate from "../components/RequirementsGate";
import Loader from "../components/Loader";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/web3";
import { isValidAddress } from "../utils/functions";

const Nominate = () => {
  const [newNominee, setNewNominee] = useState("");
  const [userSubmissionError, setUserSubmissionError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState();
  const [transactionError, setTransactionError] = useState();

  let {
    contractData: { contractAddress, nomineeAddress, isPromiseActive },
    contractFunctions: { setNominee },
  } = useContext(Web3Interface);

  let handleNomineeSubmission = async (event) => {
    event.preventDefault();
    if (!isValidAddress(newNominee)) {
      setUserSubmissionError("This is not a valid eth address");
      return;
    }

    setIsLoading(true);
    let { err, txnReceipt } = await setNominee(newNominee);
    setIsLoading(false);

    if (err) {
      setTransactionError({
        errorMessage: err,
      });
    } else {
      const { blockHash, blockNumber, transactionHash, events } = txnReceipt;

      const {
        nomineeSet: {
          returnValues: { nominee_address },
        },
      } = events;

      setTransactionData({
        blockHash,
        blockNumber,
        transactionHash,
        returnedData: {
          label: "New Nominee Set!",
          data: nominee_address,
        },
      });
    }
  };

  return (
    <main>
      {/* FIXME fix requirement gates */}
      <RequirementsGate
        isValid={contractAddress}
        message="Please select a contract to begin or please create and then select one"
      >
        <RequirementsGate
          isValid={!isPromiseActive}
          message="This contract has an active promise! Please let it expire and cashout to nominate a new address"
        >
          <TransactionResultScreen
            success={transactionData && !isLoading}
            data={transactionData}
          >
            {isLoading && <Loader />}
            <div>
              <h1> Set your Nominee!</h1>
              <p>
                Please provide a ETH account that will recieve the amount in
                your penalty pot.
                <br />
                You cannot nominate:
              </p>
              <ul>
                <li> Your currently connected wallet</li>
                <li> This promise contract</li>
              </ul>

              <form onSubmit={handleNomineeSubmission}>
                <p>
                  Your current nominated address is:
                  <b>
                    {isValidAddress(nomineeAddress) ? (
                      <span>{nomineeAddress}</span>
                    ) : (
                      <span>
                        NONE! Please set one before you set up your promise
                      </span>
                    )}
                  </b>
                </p>
                <label>
                  Set your new nominee to recieve your penalty pot
                  <input
                    type="text"
                    name="newNominee"
                    required
                    value={newNominee}
                    onChange={(event) => setNewNominee(event.target.value)}
                    disabled={isLoading}
                  />
                </label>
                <input type="submit" disabled={isLoading} />
                {transactionError && <p>{transactionError.errorMessage}</p>}
                {userSubmissionError && <b>{userSubmissionError}</b>}
              </form>
            </div>
          </TransactionResultScreen>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
};

export default Nominate;
