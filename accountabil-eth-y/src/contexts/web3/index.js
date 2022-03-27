import { createContext, useEffect, useState } from "react";
import { useContractFactory, useUserData, useContract } from '../Hooks'
let { ethereum } = window;

let DEFAULT_USER_DATA = {
  walletAddress: null,
  contractAddresses: [],
};

let DEFAULT_CONTRACT_DATA = {
  contractAddress: null,
  ownerAddress: null,
  nomineeAddress: null,
  isPromiseActive: null,
  promiseDeadline: null,
  promiseCheckOpen: null,
  promiseCheckClosed: null,
};

export const Web3Interface = createContext();

export const Web3InterfaceProvider = ({ children }) => {
  const [userData, setUserData] = useState(DEFAULT_USER_DATA);
  const [contractData, setContractData] = useState(DEFAULT_CONTRACT_DATA);

  let [getUserAddress, retrivedUserAddress, forgetAddress] = useUserData(setUserData,
    setContractData,
    DEFAULT_USER_DATA,
    DEFAULT_CONTRACT_DATA)
  let [createNewContract, getUserContracts] = useContractFactory(userData, setUserData)
  let [selectActiveContract, setNominatedAccount, createPromise] = useContract(userData, contractData, setContractData)

  useEffect(() => {
    if (ethereum) {
      retrivedUserAddress();
      ethereum.on("accountsChanged", function (accounts) {
        if (accounts[0]) forgetAddress();
      });
    }

  }, []);


  return (
    <Web3Interface.Provider
      value={{
        userData: userData,
        contractData: contractData,
        userAccountFunctions: {
          getAccount: getUserAddress,
          forgetAccount: forgetAddress,
        },
        contractFactoryFunctions: {
          getContracts: getUserContracts,
          createContract: createNewContract,
        },
        contractFunctions: {
          selectContract: selectActiveContract,
          setNominee: setNominatedAccount,
          createPromise,
          // submitCheckIn: submitPromiseCheckIn,
          // cashoutPromise,
          // getPromisePrivateData,
        },
      }}
    >
      {children}
    </Web3Interface.Provider>
  );
};
