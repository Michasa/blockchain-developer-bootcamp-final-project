const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
const { time, snapshot, BN } = require("@openzeppelin/test-helpers");

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  CHECKS,
  DAY_IN_SECONDS,
} = require("./utils/variables");

const { returnPledgeAmount, returnHexArray } = require("./utils/functions");
const { expect } = require("chai");
const Contract = artifacts.require("AccountabilityChecker");

const CORRECT_PLEDGE_AMOUNT = returnPledgeAmount(CHECKS, DAILY_WAGER);
let NOW_PLUS_15_MIN = dayjs.unix(TIME_NOW).add(15, "minutes").unix();

contract("🎟️ Checking Commitments", function async(accounts) {
  const [owner, notOwner] = accounts;
  let AccountabilityChecker;

  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();

    await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      CHECKS,
      DEADLINE,
      {
        value: CORRECT_PLEDGE_AMOUNT,
      }
    );
  });

  it("should REVERT submission if promise TIMESTAMP is MISSING", async function () {
    await truffleAssert.fails(
      AccountabilityChecker.checkCommitments(undefined, true)
    );
  });

  it("should REVERT submission if promise PROMISE RESULT is MISSING", async function () {
    await truffleAssert.fails(
      AccountabilityChecker.checkCommitments(NOW_PLUS_15_MIN, undefined)
    );
  });

  it("should ACCEPT correct promise submission (FULFILMENT)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      true,
      NOW_PLUS_15_MIN
    );

    truffleAssert.eventEmitted(
      result,
      "moneyPotUpdated",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          penalty_pot.toNumber() === 0 &&
          reward_pot.toNumber() === DAILY_WAGER.toNumber() &&
          pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "checkIntervalUpdated");
  });

  it("should ACCEPT correct promise submission (FAILURE)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      false,
      NOW_PLUS_15_MIN
    );
    truffleAssert.eventEmitted(
      result,
      "moneyPotUpdated",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          reward_pot.toNumber() === 0 &&
          penalty_pot.toNumber() === DAILY_WAGER.toNumber() &&
          pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "checkIntervalUpdated");
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

  it("should REVERT CASHOUT if PROMISE NOT EXPIRED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.cashOut(),
      "promise not expired"
    );
  });
});

contract("🎟️🕥 Checking Commitments - Time Simulations", function async() {
  let AccountabilityChecker;

  let TIME_SUBMITTED;
  let PROMISE_DURATION_IN_DAYS;
  let BLOCKCHAIN_SNAPSHOT;

  let simulatePassTime;

  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();

    await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      CHECKS,
      DEADLINE,
      {
        value: CORRECT_PLEDGE_AMOUNT,
      }
    );

    TIME_SUBMITTED = NOW_PLUS_15_MIN;
    PROMISE_DURATION_IN_DAYS = dayjs
      .unix(DEADLINE)
      .diff(dayjs.unix(TIME_NOW), "days");
    BLOCKCHAIN_SNAPSHOT = await snapshot();

    simulatePassTime = async (days) => {
      return (
        (TIME_SUBMITTED += DAY_IN_SECONDS),
        await time.increase(time.duration.days(days))
      );
    };
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("should ACCEPT SUBMISSIONS submitted at 24HR INTERVALS for FULL PROMISE DURATION (ALL FULFILLED)", async function () {
    for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
      let result = await AccountabilityChecker.checkCommitments(
        true,
        TIME_SUBMITTED
      );

      if (!result) return done(new Error("No result returned"));

      truffleAssert.eventEmitted(
        result,
        "moneyPotUpdated",
        ({ penalty_pot, pledge_pot, reward_pot }) => {
          let multiplied_wager = DAILY_WAGER.toNumber() * day;
          return (
            (reward_pot.toNumber() === multiplied_wager &&
              penalty_pot.toNumber() === 0 &&
              pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT) -
            multiplied_wager
          );
        }
      );

      truffleAssert.eventEmitted(result, "checkIntervalUpdated");

      let { 3: checks_left } =
        await AccountabilityChecker.getPromiseDetails.call();
      expect(checks_left.toNumber()).to.equal(CHECKS - day);

      await simulatePassTime(1);
    }
  });

  it("should ACCEPT SUBMISSIONS submitted at 24HR INTERVALS for FULL PROMISE DURATION (ALL FAILED)", async function () {
    for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
      let result = await AccountabilityChecker.checkCommitments(
        false,
        TIME_SUBMITTED
      );

      if (!result) return done(new Error("No result returned"));

      await truffleAssert.eventEmitted(
        result,
        "moneyPotUpdated",
        ({ penalty_pot, pledge_pot, reward_pot }) => {
          let multiplied_wager = DAILY_WAGER.toNumber() * day;
          return (
            reward_pot.toNumber() === 0 &&
            penalty_pot.toNumber() === multiplied_wager &&
            pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT - multiplied_wager
          );
        }
      );

      await truffleAssert.eventEmitted(result, "checkIntervalUpdated");

      let { 3: checks_left } =
        await AccountabilityChecker.getPromiseDetails.call();
      expect(checks_left.toNumber()).to.equal(CHECKS - day);

      await simulatePassTime(1);
    }
  });

  it("should APPLY PENALTY for MISSED CHECKS(4) on NEXT SUBMISSION", async function () {
    for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
      await simulatePassTime(1);

      if (day == 5) {
        let result = await AccountabilityChecker.checkCommitments(
          true,
          TIME_SUBMITTED
        );

        await truffleAssert.eventEmitted(
          result,
          "penaltyApplied",
          ({ days_missed, penalty_pot }) => {
            return (
              days_missed.toNumber() === 4 &&
              penalty_pot.toNumber() === DAILY_WAGER * 4
            );
          }
        );
      }
    }
  });

  it("should REVERT SUBMISSION if DEADLINE HAS PASSED", async function () {
    await simulatePassTime(PROMISE_DURATION_IN_DAYS);

    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, TIME_SUBMITTED),
      "promise expired; cashout now"
    );
  });
});
