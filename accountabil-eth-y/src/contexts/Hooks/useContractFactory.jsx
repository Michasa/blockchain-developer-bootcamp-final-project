import { AccountabilityContractFactory } from "../../smart-contract/contracts";

const useContractFactory = (userData, setUserData) => {
  const createNewContract = () => {
    return AccountabilityContractFactory.methods
      .createContract()
      .send({
        from: userData.walletAddress,
      })
      .then((results) => {
        return { txnReceipt: results };
      })
      .catch((error) => {
        return { err: error.message };
      });
  };

  const getUserContracts = async () => {
    return AccountabilityContractFactory.methods
      .findMyContracts()
      .call({
        from: userData.walletAddress,
      })
      .then((results) => {
        let newState = {
          ...userData,
          contractAddresses: [...results],
        };
        setUserData(newState);
        localStorage.removeItem("Acc_UserDetails");
        localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
      })
      .catch((error) => {
        return { err: error.message };
      });
  };

  return [createNewContract, getUserContracts];
};

export default useContractFactory;
