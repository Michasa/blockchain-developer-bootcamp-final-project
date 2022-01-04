const { asciiToHex } = require("web3-utils");
const { BN, time } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

//GOOD VARIABLES
const COMMITMENTS = ["read a book", "go to the gym", "eat some fruit"].map(
  (commitment) => {
    let hex = asciiToHex(commitment);
    return hex.padEnd(66, "0");
  }
);
const DEADLINE = dayjs().add(7, "day").unix();
const TIME_NOW = dayjs().unix();
const DAY_IN_SECONDS = time.duration.days(1).toNumber();
const DAILY_WAGER = new BN(1600000); //WEI, and is approx £5
const returnPledgeAmount = (deadline) => {
  return new BN(
    100 +
      DAILY_WAGER * dayjs.duration({ seconds: deadline - TIME_NOW }).asDays()
  );
};

// BAD VARIABLES
const TOO_SOON_DEADLINE = dayjs().add(2, "hours").unix();
const PASSED_DEADLINE = dayjs().subtract(7, "day").unix();
const TOO_MANY_COMMITMENTS = [
  "read a book",
  "go to the gym",
  "eat some fruit",
  "walk the dog",
  "play pranks on neighbours",
].map((commitment) => {
  let hex = asciiToHex(commitment);
  return hex.padEnd(66, "0");
});

module.exports = {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
  DAY_IN_SECONDS,
  returnPledgeAmount,
};
