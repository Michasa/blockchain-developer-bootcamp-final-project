import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import Web3 from "web3";
import Loader from "../components/Loader";
import PromiseDefinitionForm from "../components/PromiseDefinitionForm";
import RequirementsGate from "../components/RequirementsGate";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/Web3Interface";
import { returnHexArray } from "../utils/functions";
import { userResponseSchema } from "../utils/Validation/PromiseDefintion";

let web3 = new Web3(Web3.givenProvider);
let { toWei } = web3.utils;

let CreatePromise = () => {
  let {
    contractData: { address, isPromiseActive },
    contractFunctions: { createPromise },
    isLoading,
  } = useContext(Web3Interface);

  const [userPromise, setUserPromise] = useState({
    userCommitments: new Array(3).fill(""),
    deadlineAsDaysAway: 1,
    dailyWager: 0,
  });
  const [error, setError] = useState(false);
  const [isFunctionLoading, setIsFunctionLoading] = useState();
  const [transactionData, setTransactionData] = useState();

  useEffect(() => {
    setIsFunctionLoading(isLoading);
  }, [isPromiseActive, isLoading]);

  let handleUpdate = (data, property) => {
    setUserPromise({
      ...userPromise,
      [property]: data,
    });
  };

  let handleSubmit = async (event) => {
    event.preventDefault();

    let { error, value } = userResponseSchema.validate({
      ...userPromise,
      userCommitments: userPromise.userCommitments.filter(
        (word) => word.length
      ),
    });

    if (error) {
      setError(true);
      return;
    } else {
      setError(false);
      let { userCommitments, dailyWager, deadlineAsDaysAway } = value;

      let transactionArguments = {
        commitments: returnHexArray(userCommitments),
        dailyWager: toWei(dailyWager.toString()),
        deadline: dayjs().add(deadlineAsDaysAway, "day").unix(),
        totalPledgeAmount: toWei((dailyWager * deadlineAsDaysAway).toString()),
      };

      let data = await createPromise(transactionArguments);

      if (data && !isFunctionLoading) {
        setTransactionData(data);
      } else {
        console.error("I think something went wrong 4");
      }
    }
    // let newData = dayjs.unix(days).add(days, "day").unix();
  };
  return (
    <main>
      <RequirementsGate
        isValid={address}
        message="Please select a contract to begin or please create and then select one"
      >
        <RequirementsGate
          isValid={!isPromiseActive}
          message="This contract has an active promise! Please let it reach its deadline and cashout to define a new one"
        >
          <TransactionResultScreen
            success={transactionData && !isFunctionLoading}
            data={transactionData}
          >
            {isFunctionLoading && <Loader />}
            <PromiseDefinitionForm
              userPromiseData={userPromise}
              handleSubmitForm={handleSubmit}
              handleUpdateData={handleUpdate}
              error={error}
            />
          </TransactionResultScreen>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
};

export default CreatePromise;
