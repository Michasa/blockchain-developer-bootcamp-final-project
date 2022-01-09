const { BN } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

// const { DAY_IN_SECONDS } = require("./variables");
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

// TODO would be cool if I could curry this
// const passTime = async (blockchain_time, user_time) => async (days) => {
//   (user_time += DAY_IN_SECONDS * days),
//     await blockchain_time.increase(blockchain_time.duration.days(days));
// };

module.exports = {
  returnPledgeAmount,
  returnHexArray,
  returnUTF8Array,
  // passTime,
};
