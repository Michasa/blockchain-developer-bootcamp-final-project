import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/Web3Interface";

function CreateContract() {
  let {
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
      getContracts();
    } else {
      console.error("I think something went wrong");
    }
  };

  return (
    <main>
      {isFunctionLoading && <Loader />}
      <TransactionResultScreen
        success={!!transactionData}
        data={transactionData}
      >
        Click to create your and deploy your Accountabil-ETH-y Smart Contract
        <button onClick={handleSubmit}>Request</button>
      </TransactionResultScreen>
    </main>
  );
}

export default CreateContract;
