import { useContext } from "react";
import { Web3Interface } from "../../contexts/web3";
import { Link } from "react-router-dom";
import SelectedPromiseContract from "./SelectedPromiseContract";
import WalletLogIn from "./WalletLogIn";
import ContractSelection from "./ContractSelection";

const InfoBar = () => {
  let {
    userData,
    contractData,
    userAccountFunctions: { getAccount, forgetAccount },
    contractFactoryFunctions: { getContracts },
    contractFunctions: { selectContract },
  } = useContext(Web3Interface);

  return (
    <>
      <h1>
        <Link to="/">
          Accountabil-<span className="eth">ETH</span>-y 🤞🏾
        </Link>
      </h1>
      <div className="account-data">
        <SelectedPromiseContract contractData={contractData} />
        <div className="contract-wallet-details">
          <WalletLogIn
            selectedAddress={userData.walletAddress}
            getAddress={getAccount}
            forgetAddress={forgetAccount}
          />
          <ContractSelection
            selectedContract={contractData.contractAddress}
            userAddress={userData.walletAddress}
            avaliableContracts={userData.contractAddresses}
            getContracts={getContracts}
            selectContract={selectContract}
          />
        </div>
      </div>
    </>
  );
};

export default InfoBar;
