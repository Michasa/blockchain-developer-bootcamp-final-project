import React, { useContext } from "react";
import { Outlet } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRetweet,
  faFileDownload,
  faFile,
} from "@fortawesome/free-solid-svg-icons";

import { Web3Interface } from "../contexts/Web3Interface";
import { Link } from "react-router-dom";

function Layout() {
  let {
    userData: { walletAddress, contractAddresses },
    selectedContract: { address },
    dAPPFunctions: { getAccount, forgetAccount },
    contractFactoryFunctions: { getContracts },
    contractFunctions: { selectContract },
  } = useContext(Web3Interface);

  return (
    <div>
      <header>
        <h1>
          <Link to="/">Accountabil-ETH-y 🤞🏾</Link>
        </h1>
        <div className="account-data">
          <div className="user-wallet">
            Selected Wallet:
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
      </header>
      <>
        <Outlet />
      </>
    </div>
  );
}

export default Layout;
