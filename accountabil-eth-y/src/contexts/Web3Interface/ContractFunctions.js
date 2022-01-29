export const getNominee = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.nominee_account().call();
};
export const getIsPromiseActive = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.isPromiseActive().call();
};
export const getContractOwner = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.owner().call();
};
export const getContractDeadline = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.promise_deadline().call();
};
export const getCheckOpen = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.check_open().call();
};
export const getCheckClose = async (AccountabilityContractInstance) => {
  return await AccountabilityContractInstance.methods.check_closed().call();
};
