import React, { useState, useContext, useEffect } from "react";
import Web3 from "web3";
import RequirementsGate from "../components/RequirementsGate";
import Loader from "../components/Loader";
import TransactionResultScreen from "../components/TransactionResultScreen";
import { Web3Interface } from "../contexts/Web3Interface";
let web3 = new Web3(Web3.givenProvider);

let { isAddress, toBN } = web3.utils;

function Nominate() {
  const [newNominee, setNewNominee] = useState();
  const [isFunctionLoading, setIsFunctionLoading] = useState();
  const [transactionData, setTransactionData] = useState();
  let {
    selectedContract: { address, nominatedAddress, isPromiseActive },
    contractFunctions: { setNominee },
    isLoading,
  } = useContext(Web3Interface);

  useEffect(() => {
    setNewNominee(null);
    setIsFunctionLoading(null);

    setIsFunctionLoading(isLoading);
  }, [address, isLoading]);

  let handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAddress(newNominee) && toBN(nominatedAddress).isZero())
      console.error("This isnt a valid address");

    let data = await setNominee(newNominee);
    if (data && !isFunctionLoading) {
      setTransactionData(data);
    } else {
      console.error("I think something went wrong");
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
            success={!!transactionData}
            data={transactionData}
          >
            {isFunctionLoading && <Loader />}
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

              <form onSubmit={handleSubmit}>
                <p>
                  Your current nominated address is:
                  <b>
                    {isAddress(nominatedAddress) &&
                    !toBN(nominatedAddress).isZero() ? (
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
                    disabled={isFunctionLoading}
                  />
                </label>
                <input type="submit" disabled={isFunctionLoading} />
              </form>
            </div>
          </TransactionResultScreen>
        </RequirementsGate>
      </RequirementsGate>
    </main>
  );
}

export default Nominate;
