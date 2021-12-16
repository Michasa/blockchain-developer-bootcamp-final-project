const { expect } = require("chai");
const { ethers } = require("hardhat");
require("mocha-steps");
const web3 = require("web3");

describe("My Smart Contract Tests \n", async function () {
  let owner;
  let notOwner;
  let rest;
  let AccountabilityChecker;
  let validTxn;

  before(async function () {
    let Contract = await ethers.getContractFactory("AccountabilityChecker");
    AccountabilityChecker = await Contract.deploy();
    //FIXME there is something wrong with this array
    const COMMITMENTS = [
      "read a book a day",
      "go to the gym",
      "eat some fruit",
    ];
    [owner, notOwner, , ...rest] = await ethers.getSigners();

    //Sent from Front End
    validTxn = {
      value: 94,
      my_commitments: [
        COMMITMENTS.map((commitment) => web3.utils.asciiToHex(commitment)),
      ],
      due_date: Date.now(),
    };
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
        const invalidTxn = [
          {
            ...validTxn,
            value: 0,
          },
          {
            ...validTxn,
            value: 2000,
          },
        ];

        invalidTxn.forEach(async function (txn) {
          console.log(txn);
          await expect(
            await AccountabilityChecker.activatePromise(txn)
          ).to.be.revertedWith("insufficient amount provided");
        });
      });

      // it("should reject promise creation if NO/TOO MANY COMMITMENTS ARE PROVIDED", async function () {});

      // it("should reject promise creation if DUE DATE IS TOO SOON/IN THE PAST", async function () {});

      // step(
      //   "should accept promise creation if all arguments are correctly provided",
      //   async function () {
      //     const message = {
      //       value: 9400000,
      //       // commitments: ["wake up at 9", "read a book", "go to gym"],
      //     };
      //     await expect(
      //       await AccountabilityChecker.activatePromise(message)
      //     ).to.emit(AccountabilityChecker, "promiseSet");
      //   }
      // );

      // step(
      //   "should prevent the owner from creating another promise if promise is active",
      //   async function () {
      //     await expect(
      //       AccountabilityChecker.activatePromise({ value: 9400000 })
      //     ).to.be.revertedWith("promise is active");
      //   }
      // );
    });
  });
});
