const web3Utils = require("web3-utils");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const COMMITMENTS = ["read a book", "go to the gym", "eat some fruit"].map(
  (commitment) => {
    let hex = web3Utils.asciiToHex(commitment);
    return hex.padEnd(66, "0");
  }
);
const DEADLINE = dayjs().add(7, "day").unix();
const TIME_NOW = dayjs().unix();
const DAILY_WAGER = web3Utils.toBN(1600000); //in wei and is approx £5
const SUFFICIENT_PLEDGE_AMOUNT = web3Utils.toBN(
  100 + DAILY_WAGER * dayjs.duration({ seconds: DEADLINE - TIME_NOW }).asDays()
);

const TOO_SOON_DEADLINE = dayjs().add(2, "hours").unix();
const PASSED_DEADLINE = dayjs().subtract(7, "day").unix();
const TOO_MANY_COMMITMENTS = [
  "read a book",
  "go to the gym",
  "eat some fruit",
  "walk the dog",
  "play pranks on neighbours",
].map((commitment) => {
  let hex = web3Utils.asciiToHex(commitment);
  return hex.padEnd(66, "0");
});

module.exports = {
  COMMITMENTS,
  SUFFICIENT_PLEDGE_AMOUNT,
  DAILY_WAGER,
  DEADLINE,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
};
