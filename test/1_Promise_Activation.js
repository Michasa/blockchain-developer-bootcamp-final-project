const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const { BN, time } = require("@openzeppelin/test-helpers");

const AccountabilityContract = artifacts.require("AccountabilityChecker");

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  CHECKS,
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

let AccountabilityChecker;
const CORRECT_PLEDGE_AMOUNT = returnPledgeAmount(CHECKS, DAILY_WAGER);

contract("🛳️ Promise Activation", function (accounts) {
  const [owner, notOwner, nominatedAccount] = accounts;

  beforeEach(async function () {
    AccountabilityChecker = await AccountabilityContract.new();

    await AccountabilityChecker.setNomineeAccount(nominatedAccount);
  });

  it("promise creation should REVERT if NOTHING is provided FOR the PLEDGE POT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        DEADLINE
      ),
      "insufficient pledge amount"
    );
  });

  it("promise creation should REVERT if NOT ENOUGH is provided FOR the PLEDGE POT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        DEADLINE,
        {
          value: new BN(100),
        }
      ),
      "insufficient pledge amount"
    );
  });

  it("promise creation should REVERT if NO DAILY WAGER is defined", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        new BN(0),
        CHECKS,
        DEADLINE,
        {
          value: returnPledgeAmount(CHECKS, 0),
        }
      ),
      "insufficient wager"
    );
  });

  it("promise creation should REVERT if NO COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise([], DAILY_WAGER, CHECKS, DEADLINE, {
        value: CORRECT_PLEDGE_AMOUNT,
      }),
      "3 commitments only"
    );
  });

  it("promise creation should REVERT if MORE THAN 3 COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(TOO_MANY_COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        DEADLINE,
        {
          value: CORRECT_PLEDGE_AMOUNT,
        }
      ),
      "3 commitments only"
    );
  });

  it("promise creation should REVERT if GIVEN DEADLINE HAS PASSED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        PASSED_DEADLINE,
        {
          value: CORRECT_PLEDGE_AMOUNT,
        }
      ),
      "deadline >1 day away only"
    );
  });

  it("promise creation should REVERT if GIVEN DEADLINE IS TOO SOON", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        TOO_SOON_DEADLINE,
        {
          value: returnPledgeAmount(TOO_SOON_DEADLINE, DAILY_WAGER),
        }
      ),
      "deadline >1 day away only"
    );
  });

  it("promise creation should REVERT if GIVEN DEADLINE is MORE THAN 30 DAYS", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        30,
        TOO_FAR_DEADLINE,
        {
          value: returnPledgeAmount(30, DAILY_WAGER),
        }
      ),
      "deadline <30 days away only "
    );
  });

  it("promise creation should REVERT if CALCULATED_CHECKS DON'T MATCH DEADLINE (LESS THAN)", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        2,
        DEADLINE,
        {
          value: returnPledgeAmount(2, DAILY_WAGER),
        }
      ),
      "incorrect # of checks"
    );
  });

  it("promise creation should REVERT if CALCULATED_CHECKS DON'T MATCH DEADLINE (MORE THAN)", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        7,
        DEADLINE,
        {
          value: returnPledgeAmount(7, DAILY_WAGER),
        }
      ),
      "incorrect # of checks"
    );
  });

  it("promise creation should REVERT is NOT FROM OWNER...", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        DEADLINE,
        {
          value: CORRECT_PLEDGE_AMOUNT,
          from: notOwner,
        }
      ),
      "owner only"
    );
  });

  it("should ACCEPT creation if ALL THE CORRECT VARIABLES ARE PROVIDED", async function () {
    let result = await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      CHECKS,
      DEADLINE,
      {
        value: CORRECT_PLEDGE_AMOUNT,
      }
    );

    truffleAssert.eventEmitted(
      result,
      "promiseSet",
      ({ commitments, pledge_pot, promise_deadline }) => {
        return (
          expect(returnUTF8Array(commitments)).to.eql(COMMITMENTS) &&
          pledge_pot.toNumber() === CORRECT_PLEDGE_AMOUNT.toNumber() &&
          promise_deadline.toNumber() === DEADLINE
        );
      }
    );

    let BLOCK_TIMESTAMP = (await time.latest()).toNumber();
    let BLOCK_TIMESTAMP_24HRS_FROM_NOW = BLOCK_TIMESTAMP + DAY_IN_SECONDS;

    truffleAssert.eventEmitted(
      result,
      "checkIntervalUpdated",
      ({ check_closed, check_open }) => {
        return (
          BLOCK_TIMESTAMP === check_open.toNumber() &&
          BLOCK_TIMESTAMP_24HRS_FROM_NOW === check_closed.toNumber()
        );
      }
    );
  });

  it("should REVERT CREATION if user submits again but PROMISE IS ALREADY ACTIVE.", async function () {
    let result = await AccountabilityChecker.activatePromise(
      returnHexArray(COMMITMENTS),
      DAILY_WAGER,
      CHECKS,
      DEADLINE,
      {
        value: CORRECT_PLEDGE_AMOUNT,
      }
    );
    if (!result) return done(new Error("No result returned"));
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        CHECKS,
        DEADLINE,
        {
          value: CORRECT_PLEDGE_AMOUNT,
        }
      ),
      "promise is active"
    );
  });

  it("should REVERT COMMITMENT submission if PROMISE NOT ACTIVE", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, TIME_NOW),
      "promise isnt active"
    );
  });

  it("should REVERT CASHOUT if PROMISE NOT ACTIVE", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.cashOut(),
      "promise isnt active"
    );
  });
});
