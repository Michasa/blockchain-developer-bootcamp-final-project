import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArchive } from "@fortawesome/free-solid-svg-icons";
import { fromWei } from 'web3-utils';

const DISPLAY_NAME = {
  pledgePot: 'Pledge Pot',
  rewardPot: 'Reward Pot',
  penaltyPot: 'Penalty Pot'
}

const DisplayPotTotals = ({ pots }) => {
  console.log(pots)
  return (<div>
    <h2>Current Pot Totals</h2>
    <div className="promisePots">
      {pots &&
        pots.map((pot) => {
          return (
            <span key={Object.keys(pot)}>
              <div>{fromWei(Object.values(pot)[0])} ETH</div>
              <FontAwesomeIcon icon={faArchive} size="4x" color="#a6c3dd9e" />
              <div>{DISPLAY_NAME[Object.keys(pot)]}</div>
            </span>
          );
        })}
    </div>
  </div>)
}

export default DisplayPotTotals;
