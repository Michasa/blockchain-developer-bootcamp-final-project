import React, { createContext, useState, useEffect } from "react";
// var Web3 = require("web3");

export const MetaMaskInterface = createContext();

export const MetaMaskInterfaceProvider = ({ children }) => {
  const [activeUserAccount, setActiveUserAccount] = useState();

  //ethereum.stackexchange.com/questions/103355/how-to-keep-metamask-connection-to-the-ui-persistent-with-web3-react
  //usecookies and git rid of lalals
  //docs.metamask.io/guide/accessing-accounts.html

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
