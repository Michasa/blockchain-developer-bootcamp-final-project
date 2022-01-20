const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const {
  COMMITMENTS,
  DAILY_WAGER,
  DEADLINE,
  CHECKS,
} = require("./utils/variables");
const { returnPledgeAmount, returnHexArray } = require("./utils/functions");

const AccountabilityCheckerContract = artifacts.require(
  "AccountabilityChecker"
);
const PenaltyBankContract = artifacts.require("PenaltyBank");

let AccountabilityChecker, PenaltyBank;
const CORRECT_PLEDGE_AMOUNT = returnPledgeAmount(CHECKS, DAILY_WAGER);

contract("✨Smart Contract Initialisation", function (accounts) {
  const [owner, notOwner, nominatedAccount, nominatedAccount2] = accounts;

  it("initialisation of AccountabilityChecker should create accompanying Penalty Bank Contract", async function () {
    AccountabilityChecker = await AccountabilityCheckerContract.new();

    let result = await truffleAssert.createTransactionResult(
      AccountabilityChecker,
      AccountabilityChecker.transactionHash
    );

    truffleAssert.eventEmitted(result, "penaltyBankCreated");
  });

  beforeEach(async function () {
    AccountabilityChecker = await AccountabilityCheckerContract.new();

    let result = await truffleAssert.createTransactionResult(
      AccountabilityChecker,
      AccountabilityChecker.transactionHash
    );

    let penalty_bank_address = result.logs[0].args.penalty_bank_address;

    PenaltyBank = await PenaltyBankContract.at(penalty_bank_address);
  });

  it("should REVERT if owner tries to make NOMINATE THEIR ACCOUNT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNomineeAccount(owner),
      "cant nominate contract owner"
    );
  });

  it("should REVERT if owner tries to NOMINATE ACCOUNTABILITY-CHECKER CONTRACT", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNomineeAccount(AccountabilityChecker.address),
      "cant nominate this contract"
    );
  });

  it("should REVERT if owner tries to NOMINATE PENALTY-BANK CONTRACT", async function () {
    let result = await truffleAssert.createTransactionResult(
      AccountabilityChecker,
      AccountabilityChecker.transactionHash
    );

    let penalty_bank_address = result.logs[0].args.penalty_bank_address;

    await truffleAssert.reverts(
      AccountabilityChecker.setNomineeAccount(penalty_bank_address),
      "cant nominate penalty contract"
    );
  });
  it("should REVERT ACCOUNT NOMINATION NOT FROM OWNER...", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNomineeAccount(nominatedAccount, {
        from: notOwner,
      }),
      "owner only"
    );
  });
  it("should REVERT promise activation if owner DOESN'T NOMINATE AN ACCOUNT", async function () {
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
      "nominee account required"
    );
  });

  it("should ACCEPT if owner NOMINATES APPROPRIATE ACCOUNT", async function () {
    let AccountabilityCheckerResult =
      await AccountabilityChecker.setNomineeAccount(nominatedAccount);

    truffleAssert.eventEmitted(
      AccountabilityCheckerResult,
      "nomineeSent",
      ({ nominee_address }) => {
        return expect(nominee_address).to.equal(nominatedAccount);
      }
    );

    let PenaltyBankFilteredEvents = (
      await PenaltyBank.getPastEvents("paymentRecipientSet")
    )[0].returnValues;

    expect(PenaltyBankFilteredEvents).to.have.property(
      "recipient_address",
      nominatedAccount
    );
  });

  it("should ACCEPT subsquent CHANGES to the NOMINATED ACCOUNT", async function () {
    await AccountabilityChecker.setNomineeAccount(nominatedAccount);

    let AccountabilityCheckerResult =
      await AccountabilityChecker.setNomineeAccount(nominatedAccount2);

    truffleAssert.eventEmitted(
      AccountabilityCheckerResult,
      "nomineeSent",
      ({ nominee_address }) => {
        return (
          expect(nominee_address).to.equal(nominatedAccount2) &&
          expect(nominee_address).to.not.equal(nominatedAccount)
        );
      }
    );

    let PenaltyBankFilteredEvents = (
      await PenaltyBank.getPastEvents("paymentRecipientSet")
    )[0].returnValues;

    expect(PenaltyBankFilteredEvents).to.have.property(
      "recipient_address",
      nominatedAccount2
    );
  });
});
