const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
const { expect } = require("chai");
const { time, snapshot } = require("@openzeppelin/test-helpers");

const AccountabilityCheckerFactoryContract = artifacts.require(
  "AccountabilityCheckerFactory"
);
const AccountabilityCheckerContract = artifacts.require(
  "AccountabilityChecker"
);

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE_SEVEN_DAYS_AWAY,
  TIME_NOW,
  SIX_CHECKS,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
} = require("./utils/variables");

const { returnPledgeAmount, returnHexArray } = require("./utils/functions");

let AccountabilityCheckerFactory, AccountabilityChecker;
let user_time_submitted;
let BLOCKCHAIN_SNAPSHOT;

let PROMISE_DURATION_IN_DAYS;

let simulateTimePass;

contract("✅ Checking Commitments", function async(accounts) {
  const [
    factoryOwner,
    contractOwner,
    notContractOwner,
    nominatedAccount,
    nominatedAccount2,
  ] = accounts;

  beforeEach(async function () {
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
      SIX_CHECKS,
      DEADLINE_SEVEN_DAYS_AWAY,
      {
        from: contractOwner,
        value: returnPledgeAmount(SIX_CHECKS, DAILY_WAGER),
      }
    );
  });

  it("should revert submission if promise timestamp is missing", async function () {
    truffleAssert.fails(
      AccountabilityChecker.checkCommitments(undefined, true, {
        from: contractOwner,
      })
    );
  });

  it("should revert submission if promise promise result is missing", async function () {
    truffleAssert.fails(
      AccountabilityChecker.checkCommitments(NOW_PLUS_15_MIN, undefined, {
        from: contractOwner,
      })
    );
  });

  it("should accept correct promise submission (fulfilment)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      true,
      NOW_PLUS_15_MIN,
      { from: contractOwner }
    );

    truffleAssert.eventEmitted(
      result,
      "moneyPotUpdated",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          penalty_pot.toNumber() === 0 &&
          reward_pot.toNumber() === DAILY_WAGER.toNumber() &&
          pledge_pot.toNumber() ===
            returnPledgeAmount(SIX_CHECKS, DAILY_WAGER) - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "checkTimesUpdated");
  });

  it("should accept correct promise submission (failure)", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      false,
      NOW_PLUS_15_MIN,
      { from: contractOwner }
    );
    truffleAssert.eventEmitted(
      result,
      "moneyPotUpdated",
      ({ penalty_pot, pledge_pot, reward_pot }) => {
        return (
          reward_pot.toNumber() === 0 &&
          penalty_pot.toNumber() === DAILY_WAGER.toNumber() &&
          pledge_pot.toNumber() ===
            returnPledgeAmount(SIX_CHECKS, DAILY_WAGER) - DAILY_WAGER
        );
      }
    );
    truffleAssert.eventEmitted(result, "checkTimesUpdated");
  });

  it("should revert subsquent promise submission if already submitted for the day", async function () {
    let result = await AccountabilityChecker.checkCommitments(
      true,
      NOW_PLUS_15_MIN,
      {
        from: contractOwner,
      }
    );
    if (!result) return done(new Error("No result returned"));

    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, NOW_PLUS_15_MIN, {
        from: contractOwner,
      }),
      "already submitted"
    );
  });

  it("should revert promise submission not from owner", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, NOW_PLUS_15_MIN, {
        from: notContractOwner,
      }),
      "owner only"
    );
  });

  it("should revert setting new nominee if promise is active.", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(nominatedAccount2, {
        from: contractOwner,
      }),
      "promise is active"
    );
  });

  it("should revert cashout if promise not expired", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.cashOut({ from: contractOwner }),
      "promise not expired"
    );
  });
});

contract(
  "🕥✅ Checking Commitments - Time Simulations",
  function async(accounts) {
    const [
      factoryOwner,
      contractOwner,
      notContractOwner,
      nominatedAccount,
      nominatedAccount2,
    ] = accounts;

    beforeEach(async function () {
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
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: returnPledgeAmount(SIX_CHECKS, DAILY_WAGER),
        }
      );

      user_time_submitted = NOW_PLUS_15_MIN;
      PROMISE_DURATION_IN_DAYS = dayjs
        .unix(DEADLINE_SEVEN_DAYS_AWAY)

        .diff(dayjs.unix(TIME_NOW), "days");

      simulateTimePass = async (days) => {
        return (
          (user_time_submitted += DAY_IN_SECONDS),
          await time.increase(time.duration.days(days))
        );
      };

      BLOCKCHAIN_SNAPSHOT = await snapshot();
    });

    afterEach(async function () {
      await BLOCKCHAIN_SNAPSHOT.restore();
    });

    it("should accept submissions submitted for full promise duration (ALL PASS)", async function () {
      for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
        let result = await AccountabilityChecker.checkCommitments(
          true,
          user_time_submitted,
          { from: contractOwner }
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
                pledge_pot.toNumber() ===
                  returnPledgeAmount(SIX_CHECKS, DAILY_WAGER)) -
              multiplied_wager
            );
          }
        );

        truffleAssert.eventEmitted(result, "checkTimesUpdated");

        let { 2: checks_left } =
          await AccountabilityChecker.getPromiseDetails.call({
            from: contractOwner,
          });

        expect(checks_left.toNumber()).to.equal(SIX_CHECKS - day);

        await simulateTimePass(1);
      }
    });

    it("should accept submissions submitted at 24hr intervals for full promise duration (ALL FAILED)", async function () {
      for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
        let result = await AccountabilityChecker.checkCommitments(
          false,
          user_time_submitted,
          { from: contractOwner }
        );

        if (!result) return done(new Error("No result returned"));

        truffleAssert.eventEmitted(
          result,
          "moneyPotUpdated",
          ({ penalty_pot, pledge_pot, reward_pot }) => {
            let multiplied_wager = DAILY_WAGER.toNumber() * day;
            return (
              reward_pot.toNumber() === 0 &&
              penalty_pot.toNumber() === multiplied_wager &&
              pledge_pot.toNumber() ===
                returnPledgeAmount(SIX_CHECKS, DAILY_WAGER) - multiplied_wager
            );
          }
        );

        truffleAssert.eventEmitted(result, "checkTimesUpdated");

        let { 2: checks_left } =
          await AccountabilityChecker.getPromiseDetails.call({
            from: contractOwner,
          });
        expect(checks_left.toNumber()).to.equal(SIX_CHECKS - day);

        await simulateTimePass(1);
      }
    });

    it("should apply penalty for missed checks(4) on next submission", async function () {
      for (let day = 1; day < PROMISE_DURATION_IN_DAYS; day++) {
        await simulateTimePass(1);

        if (day == 5) {
          let result = await AccountabilityChecker.checkCommitments(
            true,
            user_time_submitted,
            { from: contractOwner }
          );

          truffleAssert.eventEmitted(
            result,
            "penaltyApplied",
            ({ days_missed, penalty_amount }) => {
              return (
                days_missed.toNumber() === 4 &&
                penalty_amount.toNumber() === DAILY_WAGER * 4
              );
            }
          );
        }
      }
    });

    it("should revert submission if deadline has passed", async function () {
      await simulateTimePass(PROMISE_DURATION_IN_DAYS);

      await truffleAssert.reverts(
        AccountabilityChecker.checkCommitments(true, user_time_submitted, {
          from: contractOwner,
        }),
        "promise expired; cashout now"
      );
    });
  }
);
