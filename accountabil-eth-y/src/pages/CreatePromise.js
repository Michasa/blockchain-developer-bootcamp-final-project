import dayjs from "dayjs";
import { useContext, useState, useEffect } from "react";
import Loader from "../components/Loader";
import PromiseDefinitionForm from "../components/PromiseDefinitionForm";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";

import { Web3Interface } from "../contexts/web3";
import { isValidAddress, returnHexArray } from "../utils/functions";

import { userResponseSchema } from "../utils/Validation/PromiseDefintion";

const { toWei } = require("web3-utils");

const DEFAULT_USER_PROMISE = {
  userCommitments: new Array(3).fill(""),
  deadlineAsDaysAway: 1,
  dailyWager: 0,
};

const CreatePromise = () => {
  let {
    contractData: { contractAddress, isPromiseActive, nomineeAddress },
    contractFunctions: { createPromise },
  } = useContext(Web3Interface);

  const [userPromise, setUserPromise] = useState(DEFAULT_USER_PROMISE);
  const [userSubmissionError, setUserSubmissionError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [transactionData, setTransactionData] = useState();
  const [transactionError, setTransactionError] = useState();

  let handlePromiseUpdate = (data, property) => {
    setUserPromise({
      //FIXME I think this is a security issue....?
      ...userPromise,
      [property]: data,
    });
  };

  const validateSubmission = (event) => {
    event.preventDefault()
    let removeEmptyCommitments = userPromise.userCommitments.filter(
      (commitment) => commitment.length
    );

    let userSubmission = {
      ...userPromise,
      userCommitments: removeEmptyCommitments,
    };
    let { value, error } = userResponseSchema.validate(userSubmission);

    if (error) {
      setUserSubmissionError("there is an issue with your submission!");
      return;
    } else {
      setUserSubmissionError(false);
      handlePromiseSubmit(value)
    }
  };

  let handlePromiseSubmit = async (validatedPromise) => {

    let { userCommitments, dailyWager, deadlineAsDaysAway } = validatedPromise;

    let transactionArguments = {
      commitments: returnHexArray(userCommitments),
      dailyWager: toWei(dailyWager.toString()),
      deadline: dayjs().add(deadlineAsDaysAway, "day").unix(),
      totalPledgeAmount: toWei(((dailyWager * deadlineAsDaysAway).toFixed(4)).toString()),
    };

    setIsLoading(true);
    let { err, txnReceipt } = await createPromise(transactionArguments);
    setIsLoading(false);

    if (err) {
      setTransactionError({
        errorMessage: err,
      });
    } else {
      console.log(txnReceipt)
      // const { blockHash, blockNumber, transactionHash, events } = txnReceipt;
      // console.log(events)

      // const {
      //   nomineeSet: {
      //     returnValues: { nominee_address },
      //   },
      // } = events;

      // setTransactionData({
      //   blockHash,
      //   blockNumber,
      //   transactionHash,
      //   // returnedData: {
      //   //   label: "New Nominee Set!",
      //   //   data: nominee_address,
      //   // },
      // });
    }
  }
    ;

  return (
    <main>
      <RequirementsGate
        isValid={contractAddress}
        message="Please select a contract to begin or please create and then select one"
      >
        <RequirementsGate
          isValid={!isPromiseActive}
          message="This contract has an active promise! Please let it reach its deadline and cashout to define a new one"
        >
          <RequirementsGate
            isValid={isValidAddress(nomineeAddress)}
            message="Please set a nominee before you define a promise!"
          >
            <TransactionResultScreen
              success={transactionData && !isLoading}
              data={transactionData}
            >
              {isLoading && <Loader />}
              <PromiseDefinitionForm
                userPromiseData={userPromise}
                validateSubmission={validateSubmission}
                handlePromiseUpdate={handlePromiseUpdate}
              />
              {/* {userSubmissionError && (<b>{userSubmissionError} </b>)}
              {transactionError && (<b>{transactionError} </b>)} */}
            </TransactionResultScreen>
          </RequirementsGate>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
};

export default CreatePromise;
