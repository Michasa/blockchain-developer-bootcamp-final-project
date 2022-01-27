const { BN, time } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

//GOOD VARIABLES
const COMMITMENTS = ["read a book", "go to the gym", "eat some fruit"];

const TIME_NOW = dayjs().unix();

//7 day promise duration
const SEVEN_DAYS_AWAY_TIMESTAMP = dayjs.unix(TIME_NOW).add(7, "day").unix();
const NUMBER_OF_CHECKS_FOR_7_DAYS = dayjs
  .unix(SEVEN_DAYS_AWAY_TIMESTAMP)
  .diff(dayjs.unix(TIME_NOW), "days");

//1 day promise duration

const ONE_DAY_AWAY_TIMESTAMP = dayjs.unix(TIME_NOW).add(1, "day").unix();
const NUMBER_OF_CHECKS_FOR_1_DAYS = dayjs
  .unix(ONE_DAY_AWAY_TIMESTAMP)
  .diff(dayjs.unix(TIME_NOW), "days");

//30 day promise duration

const THIRTY_DAY_AWAY_TIMESTAMP = dayjs.unix(TIME_NOW).add(30, "day").unix();
const NUMBER_OF_CHECKS_FOR_30_DAYS = dayjs
  .unix(THIRTY_DAY_AWAY_TIMESTAMP)
  .diff(dayjs.unix(TIME_NOW), "days");

const DAY_IN_SECONDS = time.duration.days(1).toNumber();
let NOW_PLUS_15_MIN = dayjs.unix(TIME_NOW).add(50, "minutes").unix();
const DAILY_WAGER = new BN(1600000); //WEI, and is approx £5

// BAD VARIABLES
const TOO_SOON_DEADLINE = dayjs().add(23, "hour").unix();
const TOO_FAR_DEADLINE = dayjs().add(31, "day").unix();
const PASSED_DEADLINE = dayjs().subtract(7, "day").unix();
const TOO_MANY_COMMITMENTS = [
  "read a book",
  "go to the gym",
  "eat some fruit",
  "walk the dog",
  "play pranks on neighbours",
];

module.exports = {
  COMMITMENTS,
  DAILY_WAGER,
  TIME_NOW,
  SEVEN_DAYS_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_7_DAYS,
  ONE_DAY_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_1_DAYS,
  THIRTY_DAY_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_30_DAYS,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
  TOO_FAR_DEADLINE,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
};
