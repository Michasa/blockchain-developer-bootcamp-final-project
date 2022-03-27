import React from "react";
import { Link } from "react-router-dom";

const TransactionResultScreen = ({ transactionData, success, children }) => {
  return (
    <>
      {/* TODO make component agnostic to success */}
      {success ? (
        <div>
          <h2>Success!</h2>
          <p>Your request has gone through, please see the changes below</p>
          <div>
            <p>Block Hash = {transactionData.blockHash}</p>
            <p>Block Number = {transactionData.blockNumber}</p>
            <p>Transaction Hash = {transactionData.transactionHash}</p>
            {/* See me on etherscan */}
            <div>
              {" "}
              Transaction Data
              <div>
                {Object.keys(transactionData.returnedData).map((key) => (
                  <p key={transactionData.returnedData[key].label}>
                    {transactionData.returnedData[key].label} ={" "}
                    {transactionData.returnedData[key].data}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <Link to="/" aria-disabled>
            Return to Start Page
          </Link>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default TransactionResultScreen;
