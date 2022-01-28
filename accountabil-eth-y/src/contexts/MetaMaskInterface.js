import React, { createContext, useState, useEffect } from "react";
import {
  AccountabilityContractFactory,
  createUserAccountabilityContract,
} from "../smart-contract/contracts";

export const MetaMaskInterface = createContext();

export const MetaMaskInterfaceProvider = ({ children }) => {
  const [activeUserAccount, setActiveUserAccount] = useState();

  useEffect(() => {
    let retrivedUser = localStorage.getItem("currentUser");
    if (retrivedUser) {
      setActiveUserAccount(retrivedUser);
    } else {
      setActiveUserAccount(null);
    }
  }, []);

  let getUserAccount = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (accounts) {
      setActiveUserAccount(accounts[0]);
      localStorage.setItem("currentUser", accounts[0]);
    }
  };

  let logoutAccount = async () => {
    setActiveUserAccount(null);
  };

  return (
    <MetaMaskInterface.Provider
      value={{
        user: activeUserAccount,
        getAccount: getUserAccount,
        forgetAccount: logoutAccount,
      }}
    >
      {children}
    </MetaMaskInterface.Provider>
  );
};
