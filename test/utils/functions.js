const { BN } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const { DAY_IN_SECONDS } = require("./variables");

const { asciiToHex, hexToUtf8 } = require("web3-utils");

const returnPledgeAmount = (checks, wager) => {
  return new BN(wager * checks);
};

const returnHexArray = (array) => {
  return array.map((commitment) => {
    let hex = asciiToHex(commitment);
    return hex.padEnd(66, "0");
  });
};

const returnUTF8Array = (array) => {
  return array.map((commitment) => {
    return (hex = hexToUtf8(commitment));
  });
};

let simulateTimePass = async function (blocktime, usertime) {
  return async function (days_passed) {
    return (
      (z = 2),
      (usertime += DAY_IN_SECONDS * days_passed),
      await blocktime.increase(blocktime.duration.days(days_passed))
    );
  };
};

module.exports = {
  returnPledgeAmount,
  returnHexArray,
  returnUTF8Array,
  simulateTimePass,
};
