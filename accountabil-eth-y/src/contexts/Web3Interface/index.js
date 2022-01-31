import dayjs from "dayjs";
import React, { createContext, useState, useEffect } from "react";
import Web3 from "web3";
import { AccountabilityCheckerABI } from "../../smart-contract/abi/AccountabilityChecker";
import { AccountabilityContractFactory } from "../../smart-contract/contracts";
import { returnUTF8Array } from "../../utils/functions";
import {
  getCheckClose,
  getCheckOpen,
  getContractOwner,
  getPromiseDeadline,
  getIsPromiseActive,
  getNominee,
} from "./ContractGetterFunctions";

let web3 = new Web3(Web3.givenProvider);
let { ethereum } = window;
export const Web3Interface = createContext();

let defaultActiveUserData = {
  walletAddress: null,
  contractAddresses: [],
};

let defaultActiveContractData = {
  address: null,
  owner: null,
  nominatedAddress: null,
  isPromiseActive: null,
  promiseDeadline: null,
  checkOpen: null,
  checkClose: null,
};

export const Web3InterfaceProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeUserData, setActiveUserData] = useState(defaultActiveUserData);
  const [selectedContract, setSelectedContract] = useState(
    defaultActiveContractData
  );

  ethereum &&
    ethereum.on("accountsChanged", function (accounts) {
      if (accounts[0]) forgetUserAccount();
    });

  useEffect(() => {
    retrivedUser();
  }, []);

  const getUserAccount = async () => {
    let accounts = await ethereum.request({ method: "eth_requestAccounts" });
    if (accounts) {
      let newState = { walletAddress: accounts[0], contractAddresses: [] };
      setActiveUserData(newState);
      localStorage.removeItem("Acc_UserDetails");
      localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
    }
  };

  const retrivedUser = async () => {
    let retrivedUserData = localStorage.getItem("Acc_UserDetails");
    if (!retrivedUserData) return;
    let { walletAddress, contractAddresses } = JSON.parse(retrivedUserData);
    ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      if (walletAddress === accounts[0]) {
        setActiveUserData({ walletAddress, contractAddresses });
      } else {
        forgetUserAccount();
      }
    });
  };

  const forgetUserAccount = async () => {
    setActiveUserData(defaultActiveUserData);
    setSelectedContract(defaultActiveContractData);
    localStorage.removeItem("Acc_UserDetails");
  };

  const createACContract = async () => {
    setIsLoading(true);

    let data = await AccountabilityContractFactory.methods
      .createContract()
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("error receipt", receipt);
      })
      .then((results) => {
        setIsLoading(false);
        setSelectedContract(defaultActiveContractData);
        let newAddress =
          results.events.newContractCreated.returnValues.contract_address;
        if (newAddress) {
          setActiveACContractData(newAddress);
        }

        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };

  const getUserACContracts = async () => {
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
      setActiveUserData(newState);
      localStorage.removeItem("Acc_UserDetails");
      localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
    }
  };

  const setActiveACContractData = async (contractAddress) => {
    if (!web3.utils.isAddress(contractAddress)) return;
    let AccountabilityCheckerContract = new web3.eth.Contract(
      AccountabilityCheckerABI,
      contractAddress
    );
    if (!AccountabilityCheckerContract)
      console.error("couldnt create contract instance");
    setSelectedContract({
      ...selectedContract,
      address: AccountabilityCheckerContract._address,
      owner: await getContractOwner(AccountabilityCheckerContract),
      nominatedAddress: await getNominee(AccountabilityCheckerContract),
      isPromiseActive: await getIsPromiseActive(AccountabilityCheckerContract),
      promiseDeadline: await getPromiseDeadline(AccountabilityCheckerContract),
      checkOpen: await getCheckOpen(AccountabilityCheckerContract),
      checkClose: await getCheckClose(AccountabilityCheckerContract),
      instance: AccountabilityCheckerContract,
    });
  };

  const setNominatedAccount = async (address) => {
    setIsLoading(true);
    const { instance: AccountabilityCheckerContract } = selectedContract;

    let data = await AccountabilityCheckerContract.methods
      .setNominee(address)
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("error receipt", receipt);
      })
      .then((results) => {
        setIsLoading(false);
        updatePromiseData();
        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };

  const createPromise = async (transactionData) => {
    const { instance: AccountabilityCheckerContract } = selectedContract;

    setIsLoading(true);
    const { commitments, dailyWager, deadline, totalPledgeAmount } =
      transactionData;

    let data = await AccountabilityCheckerContract.methods
      .activatePromise(commitments, dailyWager, deadline)
      .send({
        from: activeUserData.walletAddress,
        value: totalPledgeAmount,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("error receipt", receipt);
      })
      .then(async (results) => {
        setIsLoading(false);
        updatePromiseData();

        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      console.log(events);
      return { transactionHash, events };
    }
  };

  const updatePromiseData = async () => {
    const { instance: AccountabilityCheckerContract } = selectedContract;

    setSelectedContract({
      ...selectedContract,
      nominatedAddress: await getNominee(AccountabilityCheckerContract),
      isPromiseActive: await getIsPromiseActive(AccountabilityCheckerContract),
      promiseDeadline: await getPromiseDeadline(AccountabilityCheckerContract),
      checkOpen: await getCheckOpen(AccountabilityCheckerContract),
      checkClose: await getCheckClose(AccountabilityCheckerContract),
    });
  };

  const getPromisePrivateData = async () => {
    const { instance: AccountabilityCheckerContract, isPromiseActive } =
      selectedContract;

    if (isPromiseActive) {
      let response1 = await AccountabilityCheckerContract.methods
        .getPromiseDetails()
        .call({
          from: activeUserData.walletAddress,
        });

      let response2 = await AccountabilityCheckerContract.methods
        .getPotsDetails()
        .call({
          from: activeUserData.walletAddress,
        });
      if (response1 && response2) {
        const { 2: checks_left, 5: commitmentsAsHex } = response1;
        const { 0: pledgePot, 1: rewardPot, 2: penaltyPot } = response2;
        let commitments = returnUTF8Array(commitmentsAsHex);

        //this is because I didnt stop calculating check in time once there were zero checks left ffs
        if (checks_left == 0) {
          removeFinalCheckinTimes();
        }

        return { commitments, checks_left, pledgePot, rewardPot, penaltyPot };
      } else {
        console.error("there was a problem with this request");
      }
    }
  };

  const submitPromiseCheckIn = async (checkInResult) => {
    setIsLoading(true);
    const { instance: AccountabilityCheckerContract } = selectedContract;

    let timeNow = dayjs().unix();

    let data = await AccountabilityCheckerContract.methods
      .checkCommitments(checkInResult, timeNow)
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("error receipt", receipt);
      })
      .then(async (results) => {
        setIsLoading(false);
        updatePromiseData();
        getPromisePrivateData();
        console.log(results);
        return results;
      });

    if (data) {
      console.log(data);
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };

  const cashoutPromise = async () => {
    setIsLoading(true);
    const { instance: AccountabilityCheckerContract } = selectedContract;

    let data = await AccountabilityCheckerContract.methods
      .cashOut()
      .send({
        from: activeUserData.walletAddress,
      })
      .on("error", function (error, receipt) {
        setIsLoading(false);
        console.error("error receipt", receipt);
      })
      .then(async (results) => {
        setIsLoading(false);
        updatePromiseData();
        console.log(results);
        return results;
      });

    if (data) {
      const { transactionHash, events } = data;
      return { transactionHash, events };
    }
  };
  const removeFinalCheckinTimes = () => {
    setSelectedContract({
      ...selectedContract,
      checkOpen: null,
      checkClose: null,
    });
  };

  return (
    <Web3Interface.Provider
      value={{
        userData: activeUserData,
        contractData: selectedContract,
        dAPPFunctions: {
          getAccount: getUserAccount,
          forgetAccount: forgetUserAccount,
        },
        contractFactoryFunctions: {
          getContracts: getUserACContracts,
          createContract: createACContract,
        },
        contractFunctions: {
          selectContract: setActiveACContractData,
          setNominee: setNominatedAccount,
          createPromise,
          submitCheckIn: submitPromiseCheckIn,
          cashoutPromise,
          getPromisePrivateData,
        },
        isLoading,
      }}
    >
      {children}
    </Web3Interface.Provider>
  );
};
