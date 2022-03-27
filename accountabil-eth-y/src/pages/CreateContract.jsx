import { useContext, useState } from "react";
import Loader from "../components/Loader";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/web3";

const CreateContract = () => {
  let {
    userData,
    contractFactoryFunctions: { createContract, getContracts },
  } = useContext(Web3Interface);

  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState();
  const [transactionError, setTransactionError] = useState();

  let handleCreationRequest = async () => {
    setIsLoading(true);
    let { err, txnReceipt } = await createContract();
    setIsLoading(false);

    if (err) {
      setTransactionError({
        errorMessage: err,
      });
    } else {
      getContracts();
      const { blockHash, blockNumber, transactionHash, events } = txnReceipt;

      const {
        newContractCreated: {
          returnValues: { contract_address },
        },
      } = events;

      setTransactionData({
        blockHash,
        blockNumber,
        transactionHash,
        returnedData: {
          newContractCreated: {
            label: "New Contract Address",
            data: contract_address,
          },
        },
      });
    }
  };

  return (
    <main>
      <RequirementsGate
        isValid={!!userData.walletAddress}
        message="Please connect your wallet to begin!"
      >
        {isLoading && <Loader />}
        <TransactionResultScreen
          success={transactionData && !isLoading}
          transactionData={transactionData}
        >
          Click to create your and deploy your Accountabil-ETH-y Smart Contract
          <button onClick={handleCreationRequest}>Request</button>
          {transactionError && <p>{transactionError.errorMessage}</p>}
        </TransactionResultScreen>{" "}
      </RequirementsGate>
    </main>
  );
};

export default CreateContract;
