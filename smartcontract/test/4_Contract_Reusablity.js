const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
const { time, snapshot, BN } = require("@openzeppelin/test-helpers");

const AccountabilityCheckerFactoryContract = artifacts.require(
  "AccountabilityCheckerFactory"
);
const AccountabilityCheckerContract = artifacts.require(
  "AccountabilityChecker"
);

const {
  COMMITMENTS,
  DAILY_WAGER,
  SEVEN_DAYS_AWAY_TIMESTAMP,
  TIME_NOW,
  NUMBER_OF_CHECKS_FOR_7_DAYS,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
} = require("./utils/variables");
const {
  returnPledgeAmount,
  returnHexArray,
  returnUTF8Array,
} = require("./utils/functions");
const { expect } = require("chai");

let AccountabilityCheckerFactory, AccountabilityChecker;
let user_time_submitted;
let BLOCKCHAIN_SNAPSHOT;

let PROMISE_DURATION_IN_DAYS;

let simulateDayPass;

contract("⏪ Contract Repeatability", function async(accounts) {
  const [
    factoryOwner,
    contractOwner,
    notContractOwner,
    nominatedAccount,
    nominatedAccount2,
  ] = accounts;

  before(async function () {
    AccountabilityCheckerFactory =
      await AccountabilityCheckerFactoryContract.deployed({
        from: factoryOwner,
      });

    let contract_address = (
      await AccountabilityCheckerFactory.createContract({
        from: contractOwner,
      })
    ).logs[0].args.contract_address;

    AccountabilityChecker = await AccountabilityCheckerContract.at(
      contract_address
    );

    await AccountabilityChecker.setNominee(nominatedAccount, {
      from: contractOwner,
    });

    await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      SEVEN_DAYS_AWAY_TIMESTAMP,
      {
        from: contractOwner,
        value: returnPledgeAmount(NUMBER_OF_CHECKS_FOR_7_DAYS, DAILY_WAGER),
      }
    );

    BLOCKCHAIN_SNAPSHOT = await snapshot();
  });

  beforeEach(async function () {
    user_time_submitted = NOW_PLUS_15_MIN;
    PROMISE_DURATION_IN_DAYS = dayjs
      .unix(SEVEN_DAYS_AWAY_TIMESTAMP)

      .diff(dayjs.unix(TIME_NOW), "days");

    simulateDayPass = async (days) => {
      return (
        (user_time_submitted += days * DAY_IN_SECONDS),
        await time.increase(time.duration.days(days))
      );
    };

    for (let day = 0; day <= PROMISE_DURATION_IN_DAYS; day++) {
      if (day < PROMISE_DURATION_IN_DAYS) {
        let result = await AccountabilityChecker.checkCommitments(
          true,
          user_time_submitted,
          {
            from: contractOwner,
          }
        );

        if (!result) return done(new Error("No result returned"));
      }

      await simulateDayPass(1);
    }
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("should allow user to still cash out long period after deadline (30 days)", async function () {
    simulateDayPass(30);

    let results = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      results,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_7_DAYS &&
          penalty.toNumber() === 0 &&
          sentToOwner === true &&
          sentToNominee === false &&
          isPromiseActive === false
        );
      }
    );
  });

  it("should prevent non-owner from cashing out after promise expires", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.cashOut({
        from: notContractOwner,
      }),
      "owner only"
    );
  });

  it("should allow owner to set new nominee after cashout", async function () {
    await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    let result = await AccountabilityChecker.setNominee(nominatedAccount2, {
      from: contractOwner,
    });

    truffleAssert.eventEmitted(result, "nomineeSet", ({ nominee_address }) => {
      return (
        expect(nominee_address).to.equal(nominatedAccount2) &&
        expect(nominee_address).to.not.equal(nominatedAccount)
      );
    });
  });

  it("should allow owner to create new promise after cashing out and completing previous one", async function () {
    await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    // mimics user submitting immediately after cashout
    user_time_submitted = (await time.latest()).toNumber();

    const SEVEN_DAYS_AWAY_TIMESTAMP_2 = dayjs
      .unix(user_time_submitted)
      .add(7, "day")
      .unix();

    const NUMBER_OF_CHECKS_FOR_7_DAYS_2 = dayjs
      .unix(SEVEN_DAYS_AWAY_TIMESTAMP_2)
      .diff(dayjs.unix(user_time_submitted), "days");

    let result = await AccountabilityChecker.activatePromise(
      returnHexArray(["pass this test"]),
      DAILY_WAGER,
      SEVEN_DAYS_AWAY_TIMESTAMP_2,
      {
        from: contractOwner,
        value: returnPledgeAmount(NUMBER_OF_CHECKS_FOR_7_DAYS_2, DAILY_WAGER),
      }
    );

    truffleAssert.eventEmitted(
      result,
      "promiseSet",
      ({ commitments, pledge_pot, promise_deadline, checks_left }) => {
        return (
          expect(returnUTF8Array(commitments)).to.eql(["pass this test"]) &&
          pledge_pot.toNumber() ===
            returnPledgeAmount(
              NUMBER_OF_CHECKS_FOR_7_DAYS_2,
              DAILY_WAGER
            ).toNumber() &&
          promise_deadline.toNumber() === SEVEN_DAYS_AWAY_TIMESTAMP_2 &&
          checks_left.toNumber() === NUMBER_OF_CHECKS_FOR_7_DAYS_2
        );
      }
    );
  });
});
