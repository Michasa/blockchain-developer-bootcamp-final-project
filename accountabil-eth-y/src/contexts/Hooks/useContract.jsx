import { useEffect, useState } from "react";
import { isValidAddress } from "../../utils/functions";
import { createAccountabilityContractInstance } from "../../smart-contract/contracts";

const useContract = (userData, contractData, setContractData) => {
  let [AccountabilityCheckerContract, setAccountabilityCheckerContract] =
    useState();

  const selectActiveContract = async (contractAddress) => {
    if (!isValidAddress(contractAddress)) return;

    let newContract = createAccountabilityContractInstance(contractAddress);

    //REVIEW is this the correct way to store an instance?
    setAccountabilityCheckerContract(newContract);
  };

  useEffect(() => {
    if (AccountabilityCheckerContract) {
      getContractData();
    }
  }, [AccountabilityCheckerContract]);

  const setNominatedAccount = (address) => {
    return AccountabilityCheckerContract.methods
      .setNominee(address)
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

  const createPromise = async (submittedPromiseData) => {
    const { commitments, dailyWager, deadline, totalPledgeAmount } =
      submittedPromiseData;

    return AccountabilityCheckerContract.methods
      .activatePromise(commitments, dailyWager, deadline)
      .send({
        from: userData.walletAddress,
        value: totalPledgeAmount,
      })
      .then((results) => {
        getContractData();
        return { txnReceipt: results };
      })
      .catch((error) => {
        return { err: error.message };
      });
  };

  const getContractData = async () => {
    Promise.all([
      AccountabilityCheckerContract._address,
      AccountabilityCheckerContract.methods.owner().call(),
      AccountabilityCheckerContract.methods.nominee_account().call(),
      AccountabilityCheckerContract.methods.isPromiseActive().call(),
      AccountabilityCheckerContract.methods.promise_deadline().call(),
      AccountabilityCheckerContract.methods.check_open().call(),
      AccountabilityCheckerContract.methods.check_closed().call(),
    ])
      .catch((error) => {
        return { err: error };
      })
      .then(
        ([
          contractAddress,
          ownerAddress,
          nomineeAddress,
          isPromiseActive,
          promiseDeadline,
          promiseCheckOpen,
          promiseCheckClosed,
        ]) => {
          setContractData({
            ...contractData,
            contractAddress,
            ownerAddress,
            nomineeAddress,
            isPromiseActive,
            promiseDeadline,
            promiseCheckOpen,
            promiseCheckClosed,
          });
        }
      );
  };

  // const getPromisePrivateData = async () => {
  //   const { contractInstance: AccountabilityCheckerContract, isPromiseActive } =
  //     selectedContract;

  //   if (isPromiseActive) {
  //     let response1 = await AccountabilityCheckerContract.methods
  //       .getPromiseDetails()
  //       .call({
  //         from: userData.walletAddress,
  //       });

  //     let response2 = await AccountabilityCheckerContract.methods
  //       .getPotsDetails()
  //       .call({
  //         from: userData.walletAddress,
  //       });
  //     if (response1 && response2) {
  //       const { 2: checks_left, 5: commitmentsAsHex } = response1;
  //       const { 0: pledgePot, 1: rewardPot, 2: penaltyPot } = response2;
  //       let commitments = returnUTF8Array(commitmentsAsHex);

  //       //this is because I didnt stop calculating check in time once there were zero checks left ffs
  //       if (checks_left == 0) {
  //         removeFinalCheckinTimes();
  //       }

  //       return { commitments, checks_left, pledgePot, rewardPot, penaltyPot };
  //     } else {
  //       console.error("there was a problem with this request");
  //     }
  //   }
  // };

  // const submitPromiseCheckIn = async (checkInResult) => {
  //   // setIsLoading(true);
  //   const { contractInstance: AccountabilityCheckerContract } =
  //     selectedContract;

  //   let timeNow = dayjs().unix();

  //   let data = await AccountabilityCheckerContract.methods
  //     .checkCommitments(checkInResult, timeNow)
  //     .send({
  //       from: userData.walletAddress,
  //     })
  //     .on("error", function (error, receipt) {
  //       // setIsLoading(false);
  //       console.error("error receipt", receipt);
  //     })
  //     .then(async (results) => {
  //       // setIsLoading(false);
  //       getContractData();
  //       getPromisePrivateData();
  //       console.log(results);
  //       return results;
  //     });

  //   if (data) {
  //     console.log(data);
  //     const { transactionHash, events } = data;
  //     return { transactionHash, events };
  //   }
  // };

  // const cashoutPromise = async () => {
  //   // setIsLoading(true);
  //   const { contractInstance: AccountabilityCheckerContract } =
  //     selectedContract;

  //   let data = await AccountabilityCheckerContract.methods
  //     .cashOut()
  //     .send({
  //       from: userData.walletAddress,
  //     })
  //     .on("error", function (error, receipt) {
  //       // setIsLoading(false);
  //       console.error("error receipt", receipt);
  //     })
  //     .then(async (results) => {
  //       // setIsLoading(false);
  //       getContractData();
  //       console.log(results);
  //       return results;
  //     });

  //   if (data) {
  //     const { transactionHash, events } = data;
  //     return { transactionHash, events };
  //   }
  // };

  // const removeFinalCheckinTimes = () => {
  //   setSelectedContract({
  //     ...selectedContract,
  //     checkOpen: null,
  //     checkClose: null,
  //   });
  // };

  return [selectActiveContract, setNominatedAccount, createPromise];
};

export default useContract;
