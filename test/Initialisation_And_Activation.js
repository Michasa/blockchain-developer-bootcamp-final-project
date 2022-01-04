const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const { BN, time } = require("@openzeppelin/test-helpers");
const dayjs = require("dayjs");
var isTomorrow = require("dayjs/plugin/isTomorrow");
dayjs.extend(isTomorrow);

const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  TIME_NOW,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
  DAY_IN_SECONDS,
} = require("./utils/variables");
const { returnPledgeAmount } = require("./utils/functions");

const Contract = artifacts.require("AccountabilityChecker");

contract("⭐ Contract Deployment and Initialisation", function async(accounts) {
  const [owner, notOwner] = accounts;
  let AccountabilityChecker;

  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();
  });

  it("should have an owner", async function () {
    expect(await AccountabilityChecker.owner()).to.equal(owner);
  });

  it("should only belong to the deployer", async function () {
    expect(await AccountabilityChecker.owner()).not.equal(notOwner);
  });
});

contract("🛳️ Promise Activation Tests", function (accounts) {
  const [owner, notOwner] = accounts;
  beforeEach(async function () {
    AccountabilityChecker = await Contract.new();
  });

  it("promise creation should REVERT if NOTHING is added to PLEDGE POT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(COMMITMENTS, DAILY_WAGER, DEADLINE),
      "insufficient pledge amount"
    );
  });

  it("promise creation should REVERT if NOT ENOUGH is provided FOR the PLEDGE POT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: new BN(1000),
        }
      ),
      "insufficient pledge amount"
    );
  });

  it("promise creation should REVERT if NO DAILY WAGER is defined", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(COMMITMENTS, new BN(0), DEADLINE, {
        value: returnPledgeAmount(DEADLINE),
      }),
      "insufficient wager"
    );
  });

  it("promise creation should REVERT if NO COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise([], DAILY_WAGER, DEADLINE, {
        value: returnPledgeAmount(DEADLINE),
      }),
      "3 commitments only"
    );
  });

  it("promise creation should REVERT if MORE THAN 3 COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        TOO_MANY_COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: returnPledgeAmount(DEADLINE),
        }
      ),
      "3 commitments only"
    );
  });

  it("promise creation should REVERT if GIVEN DEADLINE HAS PASSED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        PASSED_DEADLINE,
        {
          value: returnPledgeAmount(DEADLINE),
        }
      ),
      "future dates only"
    );
  });

  it("promise creation should REVERT if GIVEN DEADLINE IS TOO SOON", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        TOO_SOON_DEADLINE,
        {
          value: returnPledgeAmount(TOO_SOON_DEADLINE),
        }
      ),
      "dates >24hrs away only"
    );
  });

  it("promise creation should REVERT is NOT FROM OWNER...", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: returnPledgeAmount(DEADLINE),
          from: notOwner,
        }
      ),
      "owner only"
    );
  });

  it("should REJECT promise submission if PROMISE NOT ACTIVE", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.checkCommitments(true, TIME_NOW),
      "promise isnt active"
    );
  });

  it("should ACCEPT creation if ALL THE CORRECT VARIABLES ARE PROVIDED", async function () {
    let result = await AccountabilityChecker.activatePromise(
      COMMITMENTS,
      DAILY_WAGER,
      DEADLINE,
      {
        value: returnPledgeAmount(DEADLINE),
      }
    );

    let BLOCK_TIMESTAMP = (await time.latest()).toNumber();
    let BLOCK_TIMESTAMP_24HRS_FROM_NOW = BLOCK_TIMESTAMP + DAY_IN_SECONDS;

    truffleAssert.eventEmitted(
      result,
      "promiseSet",
      ({ commitments, pledge_pot, promise_deadline }) => {
        return (
          expect(commitments).to.eql(COMMITMENTS) &&
          pledge_pot.toNumber() === returnPledgeAmount(DEADLINE).toNumber() &&
          promise_deadline.toNumber() === DEADLINE
        );
      }
    );

    truffleAssert.eventEmitted(
      result,
      "commitmentTimesUpdated",
      ({ commitments_check_deadline, commitments_check_open }) => {
        return (
          BLOCK_TIMESTAMP === commitments_check_open.toNumber() &&
          BLOCK_TIMESTAMP_24HRS_FROM_NOW ===
            commitments_check_deadline.toNumber()
        );
      }
    );
  });

  it("should REJECT creation if user submits again but PROMISE IS ALREADY ACTIVE.", async function () {
    let result = await AccountabilityChecker.activatePromise(
      COMMITMENTS,
      DAILY_WAGER,
      DEADLINE,
      {
        value: returnPledgeAmount(DEADLINE),
      }
    );
    if (!result) return done(new Error("No result returned"));
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: returnPledgeAmount(DEADLINE),
        }
      ),
      "promise is active"
    );
  });
});
