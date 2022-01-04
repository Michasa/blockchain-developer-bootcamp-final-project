const { DAY_IN_SECONDS, TIME_NOW, DAILY_WAGER } = require("./variables");
const { BN } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var duration = require("dayjs/plugin/duration");
dayjs.extend(duration);

const returnPledgeAmount = (deadline) => {
  return new BN(
    100 +
      DAILY_WAGER * dayjs.duration({ seconds: deadline - TIME_NOW }).asDays()
  );
};

module.exports = { returnPledgeAmount };
