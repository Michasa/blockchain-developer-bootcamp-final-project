import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import {
  AccountabilityContractFactory,
  createUserAccountabilityContract,
} from "../../smart-contract/contracts";
import {
  getCheckClose,
  getCheckOpen,
  getContractOwner,
  getIsPromiseActive,
  getNominee,
} from "./ContractFunctions";

let web3 = new Web3(Web3.givenProvider);
let { ethereum } = window;

export const Web3Interface = createContext();

let defaultActiveUserData = {
  walletAddress: null,
  contractAddresses: [],
};

let defaultSelectedContract = {
  address: null,
  owner: null,
  nominatedAddress: null,
  isPromiseActive: null,
  promiseDeadline: null,
  checkOpen: null,
  checkClose: null,
  instance: null,
};

export const Web3InterfaceProvider = ({ children }) => {
  const [activeUserData, setActiveUserAccount] = useState(
    defaultActiveUserData
  );
  const [selectedContract, setSelectedContract] = useState(
    defaultSelectedContract
  );

  const [isLoading, setIsLoading] = useState(false);

  ethereum.on("accountsChanged", function (accounts) {
    if (accounts[0]) forgetUserAccount();
  });

  useEffect(() => {
    retrivedUser();
  }, [isLoading, selectedContract]);

  const retrivedUser = async () => {
    let retrivedUserData = localStorage.getItem("Acc_UserDetails");
    if (!retrivedUserData) return;
    let { walletAddress, contractAddresses } = JSON.parse(retrivedUserData);
    ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      if (walletAddress === accounts[0]) {
        setActiveUserAccount({ walletAddress, contractAddresses });
      } else {
        forgetUserAccount();
      }
    });
  };

  const getUserAccount = async () => {
    let accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts) {
      let newState = { walletAddress: accounts[0], contractAddresses: [] };
      setActiveUserAccount(newState);
      localStorage.removeItem("Acc_UserDetails");
      localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
    }
  };

  const getNewContract = async () => {
    setIsLoading(true);

    let data = await AccountabilityContractFactory.methods
      .createContract()
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("fromError Bit", error);
        console.error("fromError Bit2", receipt);
      })
      .then((results) => {
        setIsLoading(false);
        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };

  const setNominatedAccount = async (address) => {
    setIsLoading(true);
    const { instance: AccountabilityContract } = selectedContract;

    let data = await AccountabilityContract.methods
      .setNominee(address)
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        setIsLoading(false);
        console.error("fromError Bit", error);
        console.error("fromError Bit2", receipt);
      })
      .then((results) => {
        setIsLoading(false);
        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };

  const getUserContracts = async () => {
    let foundContracts = await AccountabilityContractFactory.methods
      .findMyContracts()
      .call({
        from: activeUserData.walletAddress,
      });
    if (foundContracts.length) {
      let newState = {
        ...activeUserData,
        contractAddresses: [...foundContracts],
      };
      setActiveUserAccount(newState);
      localStorage.removeItem("Acc_UserDetails");
      localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
    }
  };

  const forgetUserAccount = async () => {
    setActiveUserAccount(defaultActiveUserData);
    setSelectedContract(defaultSelectedContract);
    localStorage.removeItem("Acc_UserDetails");
  };

  const createPromise = async () => {};

  const cashoutPromise = async () => {};

  const setActiveContract = async (contractAddress) => {
    if (!web3.utils.isAddress(contractAddress)) return;
    let AccountabilityContract =
      createUserAccountabilityContract(contractAddress);
    if (!AccountabilityContract) return;

    setSelectedContract({
      address: AccountabilityContract._address,
      owner: await getContractOwner(AccountabilityContract),
      nominatedAddress: await getNominee(AccountabilityContract),
      isPromiseActive: await getIsPromiseActive(AccountabilityContract),
      promiseDeadline: await getContractOwner(AccountabilityContract),
      checkOpen: await getCheckOpen(AccountabilityContract),
      checkClose: await getCheckClose(AccountabilityContract),
      instance: AccountabilityContract,
    });
  };

  return (
    <Web3Interface.Provider
      value={{
        userData: activeUserData,
        selectedContract,
        dAPPFunctions: {
          getAccount: getUserAccount,
          forgetAccount: forgetUserAccount,
        },
        contractFactoryFunctions: {
          getContracts: getUserContracts,
          createContract: getNewContract,
        },
        contractFunctions: {
          selectContract: setActiveContract,
          getContratDetails: setActiveContract,
          setNominee: setNominatedAccount,
          createPromise,
          cashoutPromise,
        },
        isLoading,
      }}
    >
      {children}
    </Web3Interface.Provider>
  );
};
