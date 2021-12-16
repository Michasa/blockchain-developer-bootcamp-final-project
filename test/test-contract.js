const { expect } = require("chai");
const { ethers } = require("hardhat");
require("mocha-steps");

describe("My Smart Contract Tests \n", async function () {
  let owner;
  let notOwner;
  let rest;
  let AccountabilityChecker;

  before(async function () {
    let Contract = await ethers.getContractFactory("AccountabilityChecker");
    AccountabilityChecker = await Contract.deploy();

    [owner, notOwner, , ...rest] = await ethers.getSigners();

    let commitmentTxn = {
      value: 94,
      commitments: [
        "read a book a month",
        "go to the gym",
        "eat some fruit",
      ],
      dueDate: Date.now()
    }
  });

  describe("⭐ Contract Deployment and Initialisation", function () {
    describe("Deployment Tests", async function () {
      it("should have an owner", async function () {
        expect(await AccountabilityChecker.owner()).to.equal(owner.address);
      });

      it("should only belong to the deployer", async function () {
        expect(await AccountabilityChecker.owner()).not.equal(notOwner.address);
      });
    });

    describe("Initialisation Tests", async function () {
      it("should reject promise creation if NOT ENOUGH IS STAKED", async function () {
        const incorrectCommitments = [
          {
            transaction: {
              value: 94,
              commitments: [
                "read a book a month",
                "go to the gym",
                "eat some fruit",
              ],
            },
            reversionMessage: "insufficient amount provided",
          },
          {
            transaction: {
              value: 9400000,
              commitments: [],
            },
            reversionMessage: "provide 3 commitments only",
          },
          {
            transaction: {
              value: 9400000,
              commitments: [
                "read a book a month",
                "go to the gym",
                "eat some fruit",
                "read a book a month",
                "go to the gym",
                "eat some fruit",
              ],
            },
            reversionMessage: "provide 3 commitments only",
          },
        ];

        incorrectCommitments.forEach(async function ({
          transaction,
          reversionMessage,
        }) {
          await expect(
            await AccountabilityChecker.initialisePromise(transaction)
          ).to.be.revertedWith(reversionMessage);
        });
      });

      it("should reject promise creation if NO/TOO MANY COMMITMENTS ARE PROVIDED", async function () {});

      it("should reject promise creation if DUE DATE IS TOO SOON/IN THE PAST", async function () {});

      step(
        "should accept promise creation if all arguments are correctly provided",
        async function () {
          const message = {
            value: 9400000,
            // commitments: ["wake up at 9", "read a book", "go to gym"],
          };
          await expect(
            await AccountabilityChecker.initialisePromise(message)
          ).to.emit(AccountabilityChecker, "promiseSet");
        }
      );

      step(
        "should prevent the owner from creating another promise if promise is active",
        async function () {
          await expect(
            AccountabilityChecker.initialisePromise({ value: 9400000 })
          ).to.be.revertedWith("promise is active");
        }
      );
    });
  });
});
