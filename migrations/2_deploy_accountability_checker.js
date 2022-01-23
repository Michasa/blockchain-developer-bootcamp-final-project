// var myContract = artifacts.require("AccountabilityChecker");

// module.exports = function (deployer) {
//   deployer.deploy(myContract);
// };

const AC = artifacts.require("AccountabilityChecker");
const ACFactory = artifacts.require("AccountabilityCheckerFactory");

module.exports = async function (deployer) {
  deployer.deploy(AC).then(() => {
    return deployer.deploy(ACFactory, AC.address);
  });
};
