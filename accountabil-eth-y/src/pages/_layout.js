import React from "react";

function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>Accountabil-ETH-y 🤞🏾</h1>
        <div>
          <div>user: user dervied from MM</div>
          <div>
            load contract:
            <select name="contracts" id="contracts">
              <option value="volvo">Account 1</option>
              <option value="saab">Account 2</option>
            </select>
          </div>
        </div>
      </header>
      <div>{children}</div>
    </div>
  );
}

export default Layout;
