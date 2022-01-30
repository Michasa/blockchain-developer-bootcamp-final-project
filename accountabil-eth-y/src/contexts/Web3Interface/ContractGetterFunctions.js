export const getNominee = async (AccountabilityCheckerContractInstance) => {
  return await AccountabilityCheckerContractInstance.methods
    .nominee_account()
    .call();
};
export const getIsPromiseActive = async (
  AccountabilityCheckerContractInstance
) => {
  return await AccountabilityCheckerContractInstance.methods
    .isPromiseActive()
    .call();
};
export const getContractOwner = async (
  AccountabilityCheckerContractInstance
) => {
  return await AccountabilityCheckerContractInstance.methods.owner().call();
};
export const getPromiseDeadline = async (
  AccountabilityCheckerContractInstance
) => {
  return await AccountabilityCheckerContractInstance.methods
    .promise_deadline()
    .call();
};
export const getCheckOpen = async (AccountabilityCheckerContractInstance) => {
  return await AccountabilityCheckerContractInstance.methods
    .check_open()
    .call();
};
export const getCheckClose = async (AccountabilityCheckerContractInstance) => {
  return await AccountabilityCheckerContractInstance.methods
    .check_closed()
    .call();
};
