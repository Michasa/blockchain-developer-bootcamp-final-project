import Web3 from "web3";

import { AccountabilityCheckerABI } from "./abi/AccountabilityChecker";
import { AccountabilityCheckerFactoryABI } from "./abi/AccountabilityCheckerFactory";

let web3 = new Web3(Web3.givenProvider);

export const AccountabilityContractFactory = new web3.eth.Contract(
  AccountabilityCheckerFactoryABI,
  process.env.ACCOUNTABILITY_CHECKER_FACTORY_ADDRESS
);

export const createUserAccountabilityContract = (userAddress) => {
  return new web3.eth.Contract(AccountabilityCheckerABI, userAddress);
};