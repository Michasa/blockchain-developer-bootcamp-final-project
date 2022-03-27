import { useState, useContext, useEffect } from "react";
import Loader from "../components/Loader";
import DisplayPotTotals from "../components/DisplayPotTotals";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/web3";

const defaultPromiseData = {
  commitments: [],
  pledgePot: null,
  rewardPot: null,
  penaltyPot: null,
};

function CheckIn() {
  const [userResponse, setUserResponse] = useState(new Array(3).fill(false));
  const [promisePrivateData, setPromisePrivateData] =
    useState(defaultPromiseData);
  const [isTxnLoading, setIsTxnLoading] = useState();
  const [transactionData, setTransactionData] = useState();

  let {
    contractData: { contractAddress, isPromiseActive },
    contractFunctions: {
      getPromisePrivateData: _getPromisePrivateData,
      submitCheckIn,
    },
    isLoading,
  } = useContext(Web3Interface);

  // useEffect(() => {
  //   getPrivatePromiseData();
  //   setIsTxnLoading(isLoading);
  // }, [contractAddress, isLoading]);

  const getPrivatePromiseData = async () => {
    let data = await _getPromisePrivateData();
    if (data) {
      let { commitments, checks_left, ...rest } = data;
      let pots = Object.entries(rest).map((e) => ({ [e[0]]: e[1] }));
      setPromisePrivateData({
        ...promisePrivateData,
        commitments,
        checksLeft: checks_left,
        pots,
      });
    } else {
      console.error("I think something went wrong 1");
    }
  };

  const handleUpdate = (value, index) => {
    let newData = userResponse;
    newData.splice(index, 1, value);
    setUserResponse(newData);
  };

  let handleTxnSubmit = async (event) => {
    event.preventDefault();
    let hasCompletedAll = userResponse.every((answer) => answer);
    let data = await submitCheckIn(hasCompletedAll);

    if (data && !isTxnLoading) {
      setTransactionData(data);
    } else {
      console.error("I think something went wrong 2");
    }
  };

  return (
    <RequirementsGate
      isValid={!!contractAddress}
      message="Please select a contract to begin or please create and then select one"
    >
      <RequirementsGate
        isValid={isPromiseActive}
        message="This contract doesn't have an active promise! Please create one first "
      >
        <TransactionResultScreen
          success={transactionData && !isTxnLoading}
          data={transactionData}
        >
          {isTxnLoading && <Loader />}
          <main>
            <h1> Submit Check</h1>

            <DisplayPotTotals pots={promisePrivateData.pots} />
            <form onSubmit={handleTxnSubmit}>
              <h2>
                Have you done what you promised? 👇 (
                {promisePrivateData.checksLeft} Checks Left)
              </h2>
              <div className="commitment-container">
                {promisePrivateData.commitments.map((commitment, index) => (
                  <span className="commitment" key={`commitment${index + 1}`}>
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
              </div>
              <input type="submit" disabled={isTxnLoading} />
            </form>
          </main>
        </TransactionResultScreen>
      </RequirementsGate>
    </RequirementsGate>
  );
}

export default CheckIn;
