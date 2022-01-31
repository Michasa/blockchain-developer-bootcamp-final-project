import React, { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRetweet,
  faFileDownload,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

import { Web3Interface } from "../contexts/Web3Interface";
import { Link } from "react-router-dom";
import { isValidNonEmptyAddress } from "../utils/functions";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import RequirementsGate from "../components/RequirementsGate";
import detectEthereumProvider from "@metamask/detect-provider";
dayjs.extend(localizedFormat);

function Layout() {
  let {
    userData: { walletAddress, contractAddresses },
    contractData,
    dAPPFunctions: { getAccount, forgetAccount },
    contractFactoryFunctions: { getContracts },
    contractFunctions: { selectContract },
  } = useContext(Web3Interface);
  const [activeContractData, setActiveContractData] = useState({
    address: null,
    nominatedAddress: null,
    isPromiseActive: null,
    promiseDeadline: null,
    checkOpen: null,
    checkClose: null,
  });
  const [hasProvider, sethasProvider] = useState(true);

  useEffect(() => {
    checkForProvider();
    setActiveContractData({
      address: contractData.address,
      nominatedAddress: contractData.nominatedAddress,
      isPromiseActive: contractData.isPromiseActive,
      promiseDeadline: contractData.promiseDeadline,
      checkOpen: contractData.checkOpen,
      checkClose: contractData.checkClose,
    });
  }, [contractData, contractData.address]);

  let checkForProvider = async (params) => {
    let provider = await detectEthereumProvider();
    if (!provider) sethasProvider(false);
  };
  const {
    address,
    nominatedAddress,
    isPromiseActive,
    promiseDeadline,
    checkOpen,
    checkClose,
  } = activeContractData;

  return (
    <RequirementsGate
      nohomepage={true}
      isValid={hasProvider}
      message="No provider detected! Download like MetaMask one to get started"
    >
      <div>
        <header>
          <h1>
            <Link to="/">
              Accountabil-<span className="eth">ETH</span>-y 🤞🏾
            </Link>
          </h1>
          <div className="account-data">
            <div className="selected-contract-details">
              Active Contract Details
              {!address ? (
                <p>Please select a contract</p>
              ) : (
                <ul className="promise-timings">
                  <li>
                    Nominee:{" "}
                    {isValidNonEmptyAddress(nominatedAddress)
                      ? nominatedAddress
                      : "None"}
                  </li>
                  <li>Promise Active: {isPromiseActive ? "true" : "false"}</li>
                  {isPromiseActive && (
                    <>
                      <li>
                        Promise Deadline:{" "}
                        {dayjs
                          .unix(promiseDeadline)
                          .format("MMM D, YYYY h:mm A")}
                      </li>
                      <li>
                        Daily Check In Open :
                        {checkOpen
                          ? dayjs.unix(checkOpen).format("MMM D, YYYY h:mm A")
                          : "not applicable"}
                      </li>
                      <li>
                        Daily Check In Close :
                        {checkClose
                          ? dayjs.unix(checkClose).format("MMM D, YYYY h:mm A")
                          : "not applicable"}
                      </li>
                    </>
                  )}
                </ul>
              )}
            </div>
            <div className="contract-wallet-details">
              <div className="user-wallet">
                Selected Account:
                {walletAddress ? (
                  <div>
                    {walletAddress}
                    <button onClick={forgetAccount}>Forget Me</button>
                  </div>
                ) : (
                  <button onClick={getAccount}>Connect your account!</button>
                )}
              </div>
              <div className="user-contractAddresses">
                <div>
                  <FontAwesomeIcon icon={faFile} size="lg" />
                  Selected Contract: {address}
                </div>
                <label>
                  Choose a contract (oldest to newest created)
                  <select
                    name="contractAddresses"
                    id="contractAddresses"
                    value={address || ""}
                    disabled={!contractAddresses.length}
                    onChange={(event) => selectContract(event.target.value)}
                  >
                    <option value="" defaultValue hidden>
                      {contractAddresses.length
                        ? "Please choose a contract"
                        : "Retrive your contractAddresses to begin"}
                    </option>
                    ) (
                    {contractAddresses.map((contract, index) => (
                      <option key={contract} value={contract}>
                        [{index + 1}] {contract}
                      </option>
                    ))}
                    )
                  </select>
                  <button onClick={getContracts} disabled={!walletAddress}>
                    {contractAddresses.length ? (
                      <FontAwesomeIcon icon={faRetweet} size="lg" />
                    ) : (
                      <FontAwesomeIcon icon={faFileDownload} size="lg" />
                    )}
                  </button>
                </label>
              </div>
            </div>
          </div>
        </header>
        <>
          <Outlet />
        </>
      </div>
    </RequirementsGate>
  );
}

export default Layout;
