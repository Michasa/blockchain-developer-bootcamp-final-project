const { expect } = require("chai");
const truffleAssert = require("truffle-assertions");
const {
  COMMITMENTS,
  DAILY_WAGER,
  SEVEN_DAYS_AWAY_TIMESTAMP,
} = require("./utils/variables");
const { returnPledgeAmount, returnHexArray } = require("./utils/functions");

const AccountabilityCheckerFactoryContract = artifacts.require(
  "AccountabilityCheckerFactory"
);
const AccountabilityCheckerContract = artifacts.require(
  "AccountabilityChecker"
);

let AccountabilityCheckerFactory, AccountabilityChecker;

contract(
  "✨🏭 AccountabilityCheckerFactory Initialisation",
  function (accounts) {
    const [factoryOwner, contractOwner, notContractOwner] = accounts;

    before(async function () {
      AccountabilityCheckerFactory =
        await AccountabilityCheckerFactoryContract.deployed();
    });

    it("should belong to the account that deployed it", async function () {
      expect(await AccountabilityCheckerFactory.owner()).to.equal(factoryOwner);
    });

    it("should create accountabilitychecker contract and update contracts_deployed value", async function () {
      let result = await AccountabilityCheckerFactory.createContract({
        from: contractOwner,
      });
      truffleAssert.eventEmitted(result, "newContractCreated");
      expect(
        (await AccountabilityCheckerFactory.contracts_deployed()).toNumber()
      ).to.equal(1);
    });

    it("should allow requesting account to create multiple accountabilitychecker contracts", async function () {
      let result = await AccountabilityCheckerFactory.createContract({
        from: contractOwner,
      });
      truffleAssert.eventEmitted(result, "newContractCreated");
      expect(
        (await AccountabilityCheckerFactory.contracts_deployed()).toNumber()
      ).to.equal(2);
    });

    it("should return any contracts associated the requesting address", async function () {
      let contractsFound = await AccountabilityCheckerFactory.findMyContracts({
        from: contractOwner,
      });
      expect(contractsFound.length).to.equal(2);

      let contractsFound2 = await AccountabilityCheckerFactory.findMyContracts({
        from: notContractOwner,
      });
      expect(contractsFound2.length).to.equal(0);
    });

    it("deployed AccountabilityCheckerFactory contract should belong to account that requested it", async function () {
      let contract_address = (
        await AccountabilityCheckerFactory.createContract({
          from: contractOwner,
        })
      ).logs[0].args.contract_address;

      let GeneratedContract = await AccountabilityCheckerContract.at(
        contract_address
      );

      expect(await GeneratedContract.owner()).to.equal(contractOwner);

      expect(await GeneratedContract.owner()).to.not.equal(factoryOwner);

      expect(await GeneratedContract.owner()).to.not.equal(notContractOwner);
    });
  }
);

contract("✨📜 AccountabilityChecker Initialisation", function (accounts) {
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
  });

  it("should revert if owner tries to make nominate their account", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(contractOwner, {
        from: contractOwner,
      }),
      "cant nominate owner account"
    );
  });

  it("should revert if owner tries to nominate accountability-checker contract", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(AccountabilityChecker.address, {
        from: contractOwner,
      }),
      "cant nominate this contract"
    );
  });

  it("should revert account nomination not from contract owner", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.setNominee(nominatedAccount, {
        from: notContractOwner,
      }),
      "owner only"
    );
  });

  it("should revert promise activation if owner doesn't nominate an account", async function () {
    await truffleAssert.reverts(
      AccountabilityChecker.activatePromise(
        returnHexArray(COMMITMENTS),
        DAILY_WAGER,
        SEVEN_DAYS_AWAY_TIMESTAMP,
        {
          value: returnPledgeAmount(SEVEN_DAYS_AWAY_TIMESTAMP, DAILY_WAGER),
          from: contractOwner,
        }
      ),
      "nominee account required"
    );
  });

  it("should allow contract owner to set nominee account", async function () {
    let AccountabilityCheckerResult = await AccountabilityChecker.setNominee(
      nominatedAccount,
      {
        from: contractOwner,
      }
    );

    truffleAssert.eventEmitted(
      AccountabilityCheckerResult,
      "nomineeSet",
      ({ nominee_address }) => {
        return expect(nominee_address).to.equal(nominatedAccount);
      }
    );
  });

  it("should accept subsquent changes to the nominated account", async function () {
    let nominee_address = (
      await AccountabilityChecker.setNominee(nominatedAccount, {
        from: contractOwner,
      })
    ).logs[0].args.nominee_address;

    expect(nominee_address).to.equal(nominatedAccount);

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
});
