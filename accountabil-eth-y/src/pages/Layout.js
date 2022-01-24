import React from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header>
        <h1>Accountabil-ETH-y :🤞</h1>
        <div>
          <div>user:</div>
          <div>contracts:</div>
        </div>
      </header>

      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
