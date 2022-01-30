import React, { useState, useContext, useEffect } from "react";
import RequirementsGate from "../components/RequirementsGate";
import Loader from "../components/Loader";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/Web3Interface";
import { isValidNonEmptyAddress } from "../utils/functions";

function Nominate() {
  const [newNominee, setNewNominee] = useState("");
  const [isTxnLoading, setIsTxnLoading] = useState();
  const [transactionData, setTransactionData] = useState();
  let {
    contractData: { address, nominatedAddress, isPromiseActive },
    contractFunctions: { setNominee },
    isLoading,
  } = useContext(Web3Interface);

  useEffect(() => {
    setNewNominee(null);
    setIsTxnLoading(isLoading);
  }, [address, isLoading]);

  let handleTxnSubmit = async (event) => {
    event.preventDefault();
    if (isValidNonEmptyAddress(newNominee))
      console.error("This isnt a valid address");

    let data = await setNominee(newNominee);
    if (data && !isTxnLoading) {
      setTransactionData(data);
    } else {
      console.error("I think something went wrong 5");
    }
  };

  return (
    <main>
      <RequirementsGate
        isValid={address}
        message="Please select a contract to begin or please create and then select one"
      >
        <RequirementsGate
          isValid={!isPromiseActive}
          message="This contract has an active promise! Please let it expire and cashout to nominate a new address"
        >
          <TransactionResultScreen
            success={transactionData && !isTxnLoading}
            data={transactionData}
          >
            {isTxnLoading && <Loader />}
            <div className="">
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

              <form onSubmit={handleTxnSubmit}>
                <p>
                  Your current nominated address is:
                  <b>
                    {isValidNonEmptyAddress(nominatedAddress) ? (
                      <span>{nominatedAddress}</span>
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
                    disabled={isTxnLoading}
                  />
                </label>
                <input type="submit" disabled={isTxnLoading} />
              </form>
            </div>
          </TransactionResultScreen>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
}

export default Nominate;
