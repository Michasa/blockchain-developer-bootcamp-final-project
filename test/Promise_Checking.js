const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
const { time, snapshot } = require("@openzeppelin/test-helpers");

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  DAY_IN_SECONDS,
} = require("./utils/variables");

const { returnPledgeAmount } = require("./utils/functions");

let NOW_PLUS_15_MIN = dayjs.unix(TIME_NOW).add(15, "minutes").unix();

const Contract = artifacts.require("AccountabilityChecker");

contract("🎟️ Checking Commitments", function async(accounts) {
  const [owner, notOwner] = accounts;
  let AccountabilityChecker;

  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();
    await AccountabilityChecker.activatePromise(
      COMMITMENTS,
      DAILY_WAGER,
      DEADLINE,
      {
        value: returnPledgeAmount(DEADLINE),
      }
    );
  });

  it("should REVERT submission if promise TIMESTAMP is MISSING", async function () {
    await truffleAssert.fails(AccountabilityChecker.checkCommitments(true));
  });

  it("should REVERT submission if promise PROMISE RESULT is MISSING", async function () {
    await truffleAssert.fails(
      AccountabilityChecker.checkCommitments(NOW_PLUS_15_MIN)
    );
  });

  it("should ACCEPT correct promise submission (FULFILMENT)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      true,
      NOW_PLUS_15_MIN
    );

    truffleAssert.eventEmitted(
      result,
      "commitmentsChecked",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          reward_pot.toNumber() === DAILY_WAGER.toNumber() &&
          penalty_pot.toNumber() === 0 &&
          pledge_pot.toNumber() === returnPledgeAmount(DEADLINE) - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "commitmentTimesUpdated");
  });

  it("should ACCEPT correct promise submission (FAILURE)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      false,
      NOW_PLUS_15_MIN
    );
    truffleAssert.eventEmitted(
      result,
      "commitmentsChecked",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          reward_pot.toNumber() === 0 &&
          penalty_pot.toNumber() === DAILY_WAGER.toNumber() &&
          pledge_pot.toNumber() === returnPledgeAmount(DEADLINE) - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "commitmentTimesUpdated");
  });

  it("should REVERT SUBSQUENT promise submission if ALREADY SUBMITTED FOR THE DAY", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      true,
      NOW_PLUS_15_MIN
    );
    if (!result) return done(new Error("No result returned"));

    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, NOW_PLUS_15_MIN),
      "already submitted"
    );
  });

  it("should REVERT promise submission NOT FROM OWNER...", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, NOW_PLUS_15_MIN, {
        from: notOwner,
      }),
      "owner only"
    );
  });
});

contract("🎟️🕥 Checking Commitments - Time Simulations", function async() {
  let blockchainSnapshot;
  let TIME_SUBMITTED;
  let PROMISE_DURATION;

  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();
    await AccountabilityChecker.activatePromise(
      COMMITMENTS,
      DAILY_WAGER,
      DEADLINE,
      {
        value: returnPledgeAmount(DEADLINE),
      }
    );

    TIME_SUBMITTED = NOW_PLUS_15_MIN;
    PROMISE_DURATION = dayjs
      .unix(DEADLINE)
      .diff(dayjs.unix(TIME_SUBMITTED), "days");

    blockchainSnapshot = await snapshot();
  });

  afterEach(async function () {
    await blockchainSnapshot.restore();
  });

  it("should ACCEPT SUBMISSIONS submitted at 24HR INTERVALS (7 DAYS, ALL FULFILLED)", async function () {
    for (let day = 0; day < PROMISE_DURATION; day++) {
      let result = await AccountabilityChecker.checkCommitments(
        true,
        TIME_SUBMITTED
      );

      if (!result) return done(new Error("No result returned"));

      truffleAssert.eventEmitted(
        result,
        "commitmentsChecked",
        ({ penalty_pot, pledge_pot, reward_pot }) => {
          let multiplied_wager = DAILY_WAGER.toNumber() * (day + 1);
          return (
            reward_pot.toNumber() === multiplied_wager &&
            penalty_pot.toNumber() === 0 &&
            pledge_pot.toNumber() ===
              returnPledgeAmount(DEADLINE) - multiplied_wager
          );
        }
      );

      truffleAssert.eventEmitted(result, "commitmentTimesUpdated");
      TIME_SUBMITTED += DAY_IN_SECONDS;

      await time.increase(time.duration.days(1));
    }
  });

  it("should ACCEPT SUBMISSIONS submitted at 24HR INTERVALS (7 DAYS, ALL FAILED)", async function () {
    for (let day = 0; day < PROMISE_DURATION; day++) {
      let result = await AccountabilityChecker.checkCommitments(
        false,
        TIME_SUBMITTED
      );

      if (!result) return done(new Error("No result returned"));

      truffleAssert.eventEmitted(
        result,
        "commitmentsChecked",
        ({ penalty_pot, pledge_pot, reward_pot }) => {
          let multiplied_wager = DAILY_WAGER.toNumber() * (day + 1);
          return (
            reward_pot.toNumber() === 0 &&
            penalty_pot.toNumber() === multiplied_wager &&
            pledge_pot.toNumber() ===
              returnPledgeAmount(DEADLINE) - multiplied_wager
          );
        }
      );

      truffleAssert.eventEmitted(result, "commitmentTimesUpdated");
      TIME_SUBMITTED += DAY_IN_SECONDS;
      await time.increase(time.duration.days(1));
    }
  });

  it("should REVERT SUBMISSION if DEADLINE HAS PASSED", async function () {
    for (let day = 0; day <= PROMISE_DURATION; day++) {
      if (day === PROMISE_DURATION) {
        await truffleAssert.reverts(
          AccountabilityChecker.checkCommitments(true, TIME_SUBMITTED),
          "promise expired; cashout now"
        );
        return;
      }
      let result = await AccountabilityChecker.checkCommitments(
        true,
        TIME_SUBMITTED
      );
      if (!result) return done(new Error("No result returned"));

      TIME_SUBMITTED += DAY_IN_SECONDS;
      await time.increase(time.duration.days(1));
    }
  });
});
