import React, { useContext } from "react";
import { Outlet } from "react-router";

import { MetaMaskInterface } from "../contexts/MetaMaskInterface";
// import ProviderRequiredRestriction from "../components/ProviderRestricted";

function Layout() {
  let { user, getAccount, forgetAccount } = useContext(MetaMaskInterface);

  return (
    // <ProviderRequiredRestriction>
    <div>
      <header>
        <h1>Accountabil-ETH-y 🤞🏾</h1>
        <div className="account-data">
          <div>
            user:
            {user ? (
              <div>
                {user} <button onClick={forgetAccount}>Log Out</button>
              </div>
            ) : (
              <button onClick={getAccount}>Connect your account!</button>
            )}
          </div>
          <div>
            load contract:
            <select name="contracts" id="contracts">
              <option value="volvo">Account 1</option>
              <option value="saab">Account 2</option>
            </select>
          </div>
        </div>
      </header>
      <div>
        <Outlet />
      </div>
    </div>
    // </ProviderRequiredRestriction>
  );
}

export default Layout;
