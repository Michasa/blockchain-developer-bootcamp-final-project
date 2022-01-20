const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
const { time, snapshot, BN } = require("@openzeppelin/test-helpers");

const AccountabilityContract = artifacts.require("AccountabilityChecker");
const PenaltyContract = artifacts.require("PenaltyBank");

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  CHECKS,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
} = require("./utils/variables");
const { returnPledgeAmount, returnHexArray } = require("./utils/functions");

const CORRECT_PLEDGE_AMOUNT = returnPledgeAmount(CHECKS, DAILY_WAGER);

let AccountabilityChecker, PenaltyBank;
let TIME_SUBMITTED, PROMISE_DURATION_IN_DAYS, BLOCKCHAIN_SNAPSHOT;
let simulatePassTime;

contract("💰🤑 Cash Out Promise (Owner)", function async(accounts) {
  const [owner, notOwner, nominatedAccount] = accounts;

  beforeEach(async function () {
    AccountabilityChecker = await AccountabilityContract.new();

    await AccountabilityChecker.setNomineeAccount(nominatedAccount);
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

  it("should allow user to CASH OUT AFTER DEADLINE", async function () {
    for (let day = 1; day <= PROMISE_DURATION_IN_DAYS; day++) {
      if (day < PROMISE_DURATION_IN_DAYS) {
        let result = await AccountabilityChecker.checkCommitments(
          true,
          TIME_SUBMITTED
        );

        if (!result) return done(new Error("No result returned"));
      }

      await simulatePassTime(1);
    }

    let result = await AccountabilityChecker.cashOut();

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({
        payout,
        penalty,
        sentToOwner,
        sentToPenaltyBank,
        isPromiseActive,
      }) => {
        return (
          payout.toNumber() === DAILY_WAGER * CHECKS &&
          penalty.toNumber() === 0 &&
          sentToOwner === true &&
          sentToPenaltyBank === false &&
          isPromiseActive === false
        );
      }
    );
  });

  it("should apply PENALTY for MISSED DAYS before CASHOUT", async function () {
    await simulatePassTime(PROMISE_DURATION_IN_DAYS);

    let result = await AccountabilityChecker.cashOut();

    await truffleAssert.eventEmitted(
      result,
      "penaltyApplied",
      ({ days_missed, penalty_pot }) => {
        return (
          days_missed.toNumber() === CHECKS &&
          penalty_pot.toNumber() === DAILY_WAGER * CHECKS
        );
      }
    );

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({
        payout,
        penalty,
        sentToOwner,
        sentToPenaltyBank,
        isPromiseActive,
      }) => {
        return (
          payout.toNumber() === 0 &&
          penalty.toNumber() === DAILY_WAGER * CHECKS &&
          sentToOwner === false &&
          sentToPenaltyBank === true &&
          isPromiseActive === false
        );
      }
    );
  });
});

contract("💰🤑 Cash Out Promise (Nominee)", function async(accounts) {
  const [owner, notOwner, nominatedAccount] = accounts;

  beforeEach(async function () {
    AccountabilityChecker = await AccountabilityContract.new();

    let result = await truffleAssert.createTransactionResult(
      AccountabilityChecker,
      AccountabilityChecker.transactionHash
    );

    let penalty_bank_address = result.logs[0].args.penalty_bank_address;

    PenaltyBank = await PenaltyContract.at(penalty_bank_address);

    await AccountabilityChecker.setNomineeAccount(nominatedAccount);
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

    let commitment_result;
    for (let day = 1; day <= PROMISE_DURATION_IN_DAYS; day++) {
      commitment_result = !commitment_result;
      if (day < PROMISE_DURATION_IN_DAYS) {
        let result = await AccountabilityChecker.checkCommitments(
          commitment_result,
          TIME_SUBMITTED
        );

        if (!result) return done(new Error("No result returned"));
      }

      await simulatePassTime(1);
    }

    await AccountabilityChecker.cashOut();
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("PenaltyBank Contract should REVERT payments NOT FROM ACCOUNTABILITYCHECKER CONTRACT", async function () {
    await truffleAssert.reverts(
      PenaltyBank.sendTransaction({ value: new BN(1000), from: owner }),
      "approved payee contract only"
    );

    await truffleAssert.reverts(
      PenaltyBank.sendTransaction({ value: new BN(1000), from: notOwner }),
      "approved payee contract only"
    );
  });

  it("PenaltyBank Contract should REVERT payout IF NOT FROM NOMINATED ACCOUNT", async function () {
    await truffleAssert.reverts(
      PenaltyBank.payoutPenaltyPayment({ from: owner }),
      "approved receipent only"
    );
    await truffleAssert.reverts(
      PenaltyBank.payoutPenaltyPayment({ from: notOwner }),
      "approved receipent only"
    );
  });

  it("PenaltyBank Contract should only payout to NOMINATED ACCOUNT", async function () {
    let result = await PenaltyBank.payoutPenaltyPayment({
      from: nominatedAccount,
    });

    await truffleAssert.eventEmitted(
      result,
      "penaltyPayoutSummary",
      ({ sent_amount, sentPenaltyPayout }) =>
        sentPenaltyPayout === true && sent_amount.toNumber() === DAILY_WAGER * 3
    );
  });
});
