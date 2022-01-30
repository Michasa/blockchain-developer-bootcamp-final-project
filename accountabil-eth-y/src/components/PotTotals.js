import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import Web3 from "web3";

let web3 = new Web3(Web3.givenProvider);
let { fromWei } = web3.utils;

function PotTotals({ pots }) {
  return (
    <div>
      <h2>Current Pot Totals</h2>
      <div className="promisePots">
        {pots &&
          pots.map((pot) => {
            return (
              <span key={Object.keys(pot)}>
                <div>{fromWei(Object.values(pot)[0])} ETH</div>
                <FontAwesomeIcon icon={faArchive} size="4x" color="#a6c3dd9e" />
                <div>{Object.keys(pot)}</div>
              </span>
            );
          })}
      </div>
    </div>
  );
}

export default PotTotals;
