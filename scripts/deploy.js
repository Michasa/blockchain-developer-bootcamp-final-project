async function main() {
  const Contract = await ethers.getContractFactory("AccountabilityChecker");
  const AccountabilityChecker = await Contract.deploy();

  console.log("Greeter deployed to:", AccountabilityChecker.address);

  console.log(AccountabilityChecker.deployTransaction)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
