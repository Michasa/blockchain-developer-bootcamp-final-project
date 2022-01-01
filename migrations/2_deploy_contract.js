var myContract = artifacts.require("AccountabilityChecker");

module.exports = function (deployer) {
  deployer.deploy(myContract);
};
