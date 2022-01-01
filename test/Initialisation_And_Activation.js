const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
require("mocha-steps");

const {
  COMMITMENTS,
  SUFFICIENT_PLEDGE_AMOUNT,
  DAILY_WAGER,
  DEADLINE,
  PASSED_DEADLINE,
  TOO_MANY_COMMITMENTS,
  TOO_SOON_DEADLINE,
} = require("./variables");

const Contract = artifacts.require("AccountabilityChecker");

contract("⭐ Contract Deployment and Initialisation", function async(accounts) {
  const [owner, notOwner] = accounts;
  let AccountabilityChecker;

  before(async function () {
    AccountabilityChecker = await Contract.deployed();
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
    AccountabilityChecker = await Contract.deployed();
  });

  it("should REJECT promise creation if NOT ENOUGH is provided FOR the PLEDGE POT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: web3.utils.toBN(1000),
        }
      ),
      "insufficient pledge pot amount"
    );
  });

  it("should REJECT promise creation if NO DAILY WAGER is defined", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        web3.utils.toBN(0),
        DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
        }
      ),
      "insufficient wager defined"
    );
  });

  it("should REJECT promise creation if NO COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise([], DAILY_WAGER, DEADLINE, {
        value: SUFFICIENT_PLEDGE_AMOUNT,
      }),
      "3 commitments only"
    );
  });

  it("should REJECT promise creation if MORE THAN 3 COMMITMENTS ARE PROVIDED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        TOO_MANY_COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
        }
      ),
      "3 commitments only"
    );
  });

  it("should REJECT promise creation if GIVEN DEADLINE HAS PASSED", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        PASSED_DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
        }
      ),
      "future dates only"
    );
  });

  it("should REJECT promise creation if GIVEN DEADLINE IS TOO SOON", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        TOO_SOON_DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
        }
      ),
      "dates > 24hrs away only"
    );
  });

  step(
    "should ACCEPT creation if ALL THE CORRECT VARIABLES ARE PROVIDED...",
    async function () {
      let result = await AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
        }
      );
      truffleAssert.eventEmitted(result, "promiseSet");
    }
  );

  step(
    "...but should REJECT creation if user submits again but PROMISE IS ALREADY ACTIVE.",
    async function () {
      await truffleAssert.reverts(
        AccountabilityChecker.activatePromise(
          COMMITMENTS,
          DAILY_WAGER,
          DEADLINE,
          {
            value: SUFFICIENT_PLEDGE_AMOUNT,
          }
        ),
        "promise is active"
      );
    }
  );

  it("should REJECT creation is NOT FROM OWNER...", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        COMMITMENTS,
        DAILY_WAGER,
        DEADLINE,
        {
          value: SUFFICIENT_PLEDGE_AMOUNT,
          from: notOwner,
        }
      ),
      "owner only"
    );
  });
});
