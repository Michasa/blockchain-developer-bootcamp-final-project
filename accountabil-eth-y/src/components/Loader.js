import React from "react";
import { Bars } from "react-loader-spinner";

function Loader() {
  return (
    <div className="loader-container">
      <Bars color="#ee811b" height={100} width={100} />
      <h2>Waiting Transaction Approval and Submission</h2>
      <i>
        (Don't forget to approve or reject the transaction on your provider
        interface!)
      </i>
    </div>
  );
}

export default Loader;
