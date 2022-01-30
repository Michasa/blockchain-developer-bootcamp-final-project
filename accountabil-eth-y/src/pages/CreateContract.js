import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/Web3Interface";

function CreateContract() {
  let {
    userData,
    contractFactoryFunctions: { createContract, getContracts },
    isLoading,
  } = useContext(Web3Interface);

  const [isFunctionLoading, setIsFunctionLoading] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    setIsFunctionLoading(isLoading);
  }, [isLoading]);

  let handleSubmit = async () => {
    let data = await createContract();
    if (data && !isFunctionLoading) {
      setTransactionData(data);
      console.log(data);
      getContracts();
    } else {
      console.error("I think something went wrong 3");
    }
  };

  return (
    <main>
      <RequirementsGate
        isValid={!!userData.walletAddress}
        message="Please connect your wallet to begin!"
      >
        {isFunctionLoading && <Loader />}
        <TransactionResultScreen
          success={transactionData && !isFunctionLoading}
          data={transactionData}
        >
          Click to create your and deploy your Accountabil-ETH-y Smart Contract
          <button onClick={handleSubmit}>Request</button>
        </TransactionResultScreen>{" "}
      </RequirementsGate>
    </main>
  );
}

export default CreateContract;
