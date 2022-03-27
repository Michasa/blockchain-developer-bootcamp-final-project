import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";

import { Web3Interface } from "../contexts/web3";

function Cashout() {
  let {
    contractData: { isPromiseActive, contractAddress },
    contractFunctions: { cashoutPromise },
    isLoading,
  } = useContext(Web3Interface);

  const [isFunctionLoading, setIsFunctionLoading] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    setIsFunctionLoading(isLoading);
  }, [isLoading]);

  let handleSubmit = async () => {
    let data = await cashoutPromise();
    if (data && !isFunctionLoading) {
      setTransactionData(data);
    } else {
      console.error("I think something went wrong 3");
    }
  };

  return (
    <main>
      <RequirementsGate
        isValid={contractAddress}
        message="Please select a contract to begin or please create and then select one"
      >
        <RequirementsGate
          isValid={isPromiseActive}
          message="This contract doesn't have an active promise! Please create one first "
        >
          {isFunctionLoading && <Loader />}
          <TransactionResultScreen
            success={
              transactionData &&
              transactionData.events.cashOutSummary &&
              !isFunctionLoading
            }
            data={transactionData}
          >
            {isFunctionLoading && <Loader />}
            Click to cash out and close your promise
            <button onClick={handleSubmit}>Request</button>
          </TransactionResultScreen>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
}

export default Cashout;
