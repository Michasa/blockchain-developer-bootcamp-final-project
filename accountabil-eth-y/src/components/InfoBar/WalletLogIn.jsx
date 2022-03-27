import React from "react";

const WalletLogIn = ({ selectedAddress, getAddress, forgetAddress }) => (
  <div className="user-wallet">
    <b>Connected Account:</b>
    {selectedAddress ? (
      <div>
        {selectedAddress}
        <button onClick={forgetAddress}>Forget Me</button>
      </div>
    ) : (
      <button onClick={getAddress}>Connect your account!</button>
    )}
  </div>
);

export default WalletLogIn;
