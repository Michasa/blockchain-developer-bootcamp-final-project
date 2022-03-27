let { ethereum } = window;

const useUserData = (
  setUserData,
  setContractData,
  DEFAULT_USER_DATA,
  DEFAULT_CONTRACT_DATA
) => {
  const getUserAddress = async () => {
    ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      if (accounts) {
        let newState = {
          walletAddress: accounts[0],
          contractAddresses: [],
        };

        setUserData(newState);
        localStorage.removeItem("Acc_UserDetails");
        localStorage.setItem("Acc_UserDetails", JSON.stringify(newState));
      }
    });
  };

  const retrivedUserAddress = async () => {
    let retrivedUserData = localStorage.getItem("Acc_UserDetails");
    if (!retrivedUserData) return;

    let { walletAddress, contractAddresses } = JSON.parse(retrivedUserData);

    ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
      if (walletAddress === accounts[0]) {
        setUserData({ walletAddress, contractAddresses });
      } else {
        forgetAddress();
      }
    });
  };

  const forgetAddress = () => {
    localStorage.removeItem("Acc_UserDetails");
    setUserData(DEFAULT_USER_DATA);
    setContractData(DEFAULT_CONTRACT_DATA);
  };

  return [getUserAddress, retrivedUserAddress, forgetAddress];
};

export default useUserData;
