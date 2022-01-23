const { BN, time } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

//GOOD VARIABLES
const COMMITMENTS = ["read a book", "go to the gym", "eat some fruit"];

const TIME_NOW = dayjs().unix();
const DEADLINE_SEVEN_DAYS_AWAY = dayjs.unix(TIME_NOW).add(7, "day").unix();
const SIX_CHECKS =
  dayjs.unix(DEADLINE_SEVEN_DAYS_AWAY).diff(dayjs.unix(TIME_NOW), "days") - 1;

const DAY_IN_SECONDS = time.duration.days(1).toNumber();

let NOW_PLUS_15_MIN = dayjs.unix(TIME_NOW).add(50, "minutes").unix();
const DAILY_WAGER = new BN(1600000); //WEI, and is approx £5

// BAD VARIABLES
const TOO_SOON_DEADLINE = dayjs().add(1, "day").unix();
const TOO_FAR_DEADLINE = dayjs().add(30, "day").unix();
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
  DEADLINE_SEVEN_DAYS_AWAY,
  TIME_NOW,
  SIX_CHECKS,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
  TOO_FAR_DEADLINE,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
};
