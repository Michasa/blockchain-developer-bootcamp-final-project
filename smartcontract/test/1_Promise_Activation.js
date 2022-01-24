const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const { BN, time } = require("@openzeppelin/test-helpers");

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
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
  DAY_IN_SECONDS,
  TOO_FAR_DEADLINE,
} = require("./utils/variables");
const {
  returnPledgeAmount,
  returnHexArray,
  returnUTF8Array,
} = require("./utils/functions");

let AccountabilityCheckerFactory, AccountabilityChecker;
const CORRECT_PLEDGE_AMOUNT = returnPledgeAmount(SIX_CHECKS, DAILY_WAGER);

contract("🛳️ Promise Activation", function (accounts) {
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
  });

  it("promise creation should revert if nothing is provided for the pledge pot", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
        }
      ),
      "insufficient pledge amount"
    );
  });

  it("promise creation should revert if not enough is provided for the pledge pot", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: new BN(100),
        }
      ),
      "insufficient pledge amount"
    );
  });

  it("promise creation should revert if no daily wager is defined", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        new BN(0),
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: returnPledgeAmount(SIX_CHECKS, 0),
        }
      ),
      "insufficient wager"
    );
  });

  it("promise creation should revert if no commitments are provided", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        [],
        DAILY_WAGER,
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: CORRECT_PLEDGE_AMOUNT,
        }
      ),
      "1-3 commitments only"
    );
  });

  it("promise creation should revert if more than 3 commitments are provided", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(TOO_MANY_COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: CORRECT_PLEDGE_AMOUNT,
        }
      ),
      "1-3 commitments only"
    );
  });

  it("promise creation should revert if given deadline has passed", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        PASSED_DEADLINE,
        { from: contractOwner, value: CORRECT_PLEDGE_AMOUNT }
      ),
      "deadline >1 day away only"
    );
  });

  it("promise creation should revert if given deadline is <24hrs away", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        TOO_SOON_DEADLINE,
        {
          from: contractOwner,
          value: returnPledgeAmount(TOO_SOON_DEADLINE, DAILY_WAGER),
        }
      ),
      "deadline >1 day away only"
    );
  });

  it("promise creation should revert if given deadline is >= 30 days", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        30,
        TOO_FAR_DEADLINE,
        {
          from: contractOwner,
          value: returnPledgeAmount(30, DAILY_WAGER),
        }
      ),
      "deadline <30 days away only "
    );
  });

  it("promise creation should revert if calculated_checks doesn't match deadline", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        2,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: returnPledgeAmount(2, DAILY_WAGER),
        }
      ),
      "incorrect # of checks"
    );

    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        7,
        DEADLINE_SEVEN_DAYS_AWAY,
        {
          from: contractOwner,
          value: returnPledgeAmount(7, DAILY_WAGER),
        }
      ),
      "incorrect # of checks"
    );
  });

  it("promise creation should revert is not from owner", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SIX_CHECKS,
        DEADLINE_SEVEN_DAYS_AWAY,
        { from: notContractOwner, value: CORRECT_PLEDGE_AMOUNT }
      ),
      "owner only"
    );
  });

  async function callActivatePromiseFunction(contractOwner) {
    return await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      SIX_CHECKS,
      DEADLINE_SEVEN_DAYS_AWAY,
      {
        from: contractOwner,
        value: CORRECT_PLEDGE_AMOUNT,
      }
    );
  }

  it("should accept creation if all the correct variables are provided", async function () {
    let result = await callActivatePromiseFunction(contractOwner);

    truffleAssert.eventEmitted(
      result,
      "promiseSet",
      ({ commitments, pledge_pot, promise_deadline, checks_left }) => {
        return (
          expect(returnUTF8Array(commitments)).to.eql(COMMITMENTS) &&
          pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT.toNumber() &&
          promise_deadline.toNumber() === DEADLINE_SEVEN_DAYS_AWAY &&
          checks_left.toNumber() === SIX_CHECKS
        );
      }
    );

    let BLOCK_TIMESTAMP = (await time.latest()).toNumber();
    let BLOCK_TIMESTAMP_24HRS_FROM_NOW = BLOCK_TIMESTAMP + DAY_IN_SECONDS;

    truffleAssert.eventEmitted(
      result,
      "checkTimesUpdated",
      ({ check_closed, check_open }) => {
        return (
          BLOCK_TIMESTAMP === check_open.toNumber() &&
          BLOCK_TIMESTAMP_24HRS_FROM_NOW === check_closed.toNumber()
        );
      }
    );
  });

  it("should revert creation if user submits again but promise is already active.", async function () {
    let result = await callActivatePromiseFunction(contractOwner);

    if (!result) return done(new Error("No result returned"));

    await truffleAssert.reverts(
      callActivatePromiseFunction(contractOwner),
      "promise is active"
    );
  });

  it("should REVERT COMMITMENT submission if PROMISE NOT ACTIVE", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, TIME_NOW, {
        from: contractOwner,
      }),
      "promise isnt active"
    );
  });

  it("should REVERT CASHOUT if PROMISE NOT ACTIVE", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.cashOut({ from: contractOwner }),
      "promise isnt active"
    );
  });
});
