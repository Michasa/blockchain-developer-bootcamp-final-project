const truffleAssert = require("truffle-assertions");
const dayjs = require("dayjs");
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
  TIME_NOW,
  SEVEN_DAYS_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_7_DAYS,
  ONE_DAY_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_1_DAYS,
  THIRTY_DAY_AWAY_TIMESTAMP,
  NUMBER_OF_CHECKS_FOR_30_DAYS,
  DAY_IN_SECONDS,
  NOW_PLUS_15_MIN,
} = require("./utils/variables");
const { returnPledgeAmount, returnHexArray } = require("./utils/functions");
const { expect } = require("chai");

let AccountabilityCheckerFactory, AccountabilityChecker;
let user_time_submitted;
let BLOCKCHAIN_SNAPSHOT;

let PROMISE_DURATION_IN_DAYS;

let simulateDayPass;

contract("💰🤑 Cash Out Promise (1 Day Duration)", function (accounts) {
  const [
    factoryOwner,
    contractOwner,
    notContractOwner,
    nominatedAccount,
    nominatedAccount2,
  ] = accounts;

  let nominee_balance_before, owner_balance_before;

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
      ONE_DAY_AWAY_TIMESTAMP,
      {
        from: contractOwner,
        value: returnPledgeAmount(NUMBER_OF_CHECKS_FOR_1_DAYS, DAILY_WAGER),
      }
    );

    user_time_submitted = NOW_PLUS_15_MIN;
    PROMISE_DURATION_IN_DAYS = dayjs
      .unix(ONE_DAY_AWAY_TIMESTAMP)

      .diff(dayjs.unix(TIME_NOW), "days");

    simulateDayPass = async (days) => {
      return (
        (user_time_submitted += days * DAY_IN_SECONDS),
        await time.increase(time.duration.days(days))
      );
    };

    nominee_balance_before = Number(
      await web3.eth.getBalance(nominatedAccount)
    );

    BLOCKCHAIN_SNAPSHOT = await snapshot();
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("should allow owner to cash out after promise expires", async function () {
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

    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_1_DAYS &&
          penalty.toNumber() === 0 &&
          sentToOwner === true &&
          sentToNominee === false &&
          isPromiseActive === false
        );
      }
    );

    expect(nominee_balance_before).to.equal(
      Number(await web3.eth.getBalance(nominatedAccount))
    );
  });

  it("should apply penalty for missed days before cashout and send amount to nominee", async function () {
    await simulateDayPass(PROMISE_DURATION_IN_DAYS);
    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
      "penaltyApplied",
      ({ days_missed, penalty_amount }) => {
        return (
          days_missed.toNumber() === NUMBER_OF_CHECKS_FOR_1_DAYS &&
          penalty_amount.toNumber() ===
            DAILY_WAGER * NUMBER_OF_CHECKS_FOR_1_DAYS
        );
      }
    );

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === 0 &&
          penalty.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_1_DAYS &&
          sentToOwner === false &&
          sentToNominee === true &&
          isPromiseActive === false
        );
      }
    );

    expect(
      nominee_balance_before + DAILY_WAGER * NUMBER_OF_CHECKS_FOR_1_DAYS
    ).to.equal(Number(await web3.eth.getBalance(nominatedAccount)));
  });

  it("should revert setting new nominee if before cashout (i.e. promise still active) ", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(nominatedAccount2, {
        from: contractOwner,
      }),
      "promise is active"
    );
  });
});

contract("💰🤑 Cash Out Promise (7 Day Duration)", function (accounts) {
  const [
    factoryOwner,
    contractOwner,
    notContractOwner,
    nominatedAccount,
    nominatedAccount2,
  ] = accounts;

  let nominee_balance_before, owner_balance_before;

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
      SEVEN_DAYS_AWAY_TIMESTAMP,
      {
        from: contractOwner,
        value: returnPledgeAmount(NUMBER_OF_CHECKS_FOR_7_DAYS, DAILY_WAGER),
      }
    );

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

    nominee_balance_before = Number(
      await web3.eth.getBalance(nominatedAccount)
    );

    BLOCKCHAIN_SNAPSHOT = await snapshot();
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("should allow owner to cash out after promise expires", async function () {
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

    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
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

    expect(nominee_balance_before).to.equal(
      Number(await web3.eth.getBalance(nominatedAccount))
    );
  });

  it("should apply penalty for missed days before cashout and send amount to nominee", async function () {
    await simulateDayPass(PROMISE_DURATION_IN_DAYS);
    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
      "penaltyApplied",
      ({ days_missed, penalty_amount }) => {
        return (
          days_missed.toNumber() === NUMBER_OF_CHECKS_FOR_7_DAYS &&
          penalty_amount.toNumber() ===
            DAILY_WAGER * NUMBER_OF_CHECKS_FOR_7_DAYS
        );
      }
    );

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === 0 &&
          penalty.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_7_DAYS &&
          sentToOwner === false &&
          sentToNominee === true &&
          isPromiseActive === false
        );
      }
    );

    expect(
      nominee_balance_before + DAILY_WAGER * NUMBER_OF_CHECKS_FOR_7_DAYS
    ).to.equal(Number(await web3.eth.getBalance(nominatedAccount)));
  });

  it("should revert setting new nominee if before cashout (i.e. promise still active) ", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(nominatedAccount2, {
        from: contractOwner,
      }),
      "promise is active"
    );
  });
});

contract("💰🤑 Cash Out Promise (30 Day Duration)", function (accounts) {
  const [
    factoryOwner,
    contractOwner,
    notContractOwner,
    nominatedAccount,
    nominatedAccount2,
  ] = accounts;

  let nominee_balance_before, owner_balance_before;

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
      THIRTY_DAY_AWAY_TIMESTAMP,
      {
        from: contractOwner,
        value: returnPledgeAmount(NUMBER_OF_CHECKS_FOR_30_DAYS, DAILY_WAGER),
      }
    );

    user_time_submitted = NOW_PLUS_15_MIN;
    PROMISE_DURATION_IN_DAYS = dayjs
      .unix(THIRTY_DAY_AWAY_TIMESTAMP)

      .diff(dayjs.unix(TIME_NOW), "days");

    simulateDayPass = async (days) => {
      return (
        (user_time_submitted += days * DAY_IN_SECONDS),
        await time.increase(time.duration.days(days))
      );
    };

    nominee_balance_before = Number(
      await web3.eth.getBalance(nominatedAccount)
    );

    BLOCKCHAIN_SNAPSHOT = await snapshot();
  });

  afterEach(async function () {
    await BLOCKCHAIN_SNAPSHOT.restore();
  });

  it("should allow owner to cash out after promise expires", async function () {
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

    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_30_DAYS &&
          penalty.toNumber() === 0 &&
          sentToOwner === true &&
          sentToNominee === false &&
          isPromiseActive === false
        );
      }
    );

    expect(nominee_balance_before).to.equal(
      Number(await web3.eth.getBalance(nominatedAccount))
    );
  });

  it("should apply penalty for missed days before cashout and send amount to nominee", async function () {
    await simulateDayPass(PROMISE_DURATION_IN_DAYS);
    let result = await AccountabilityChecker.cashOut({
      from: contractOwner,
    });

    truffleAssert.eventEmitted(
      result,
      "penaltyApplied",
      ({ days_missed, penalty_amount }) => {
        return (
          days_missed.toNumber() === NUMBER_OF_CHECKS_FOR_30_DAYS &&
          penalty_amount.toNumber() ===
            DAILY_WAGER * NUMBER_OF_CHECKS_FOR_30_DAYS
        );
      }
    );

    truffleAssert.eventEmitted(
      result,
      "cashOutSummary",
      ({ payout, penalty, sentToOwner, sentToNominee, isPromiseActive }) => {
        return (
          payout.toNumber() === 0 &&
          penalty.toNumber() === DAILY_WAGER * NUMBER_OF_CHECKS_FOR_30_DAYS &&
          sentToOwner === false &&
          sentToNominee === true &&
          isPromiseActive === false
        );
      }
    );

    expect(
      nominee_balance_before + DAILY_WAGER * NUMBER_OF_CHECKS_FOR_30_DAYS
    ).to.equal(Number(await web3.eth.getBalance(nominatedAccount)));
  });

  it("should revert setting new nominee if before cashout (i.e. promise still active) ", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(nominatedAccount2, {
        from: contractOwner,
      }),
      "promise is active"
    );
  });
});
