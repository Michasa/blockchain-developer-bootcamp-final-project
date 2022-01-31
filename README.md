# accountabil.ETH.y 🖐️

### _My promise is BOND!_ 💯

- Website = https://michasa.github.io/blockchain-developer-bootcamp-final-project/ (Provider required! [rETH too](https://faucet.egorfine.com/)
- Screencast walkthrough = (Link to this is in the _final-project-checklist.txt_ file)

Hello and welcome to my final project to for the course! Please send my Certificate NFT to this address = **0x7C24027B1C9A1b7E4c300dcBcBbCf48CC020a656**

---

### Project Structure

This is a bi-directory project made up of the _accountabil-eth-y_ and _smartcontract_ folders, see below for a detailed map of this directory of the files mentioned below. Please make sure you have navigated to the specific directory before performing terminal commands described below!

```
blockchain-developer-bootcamp-final-project
├─ accountabil-eth-y
│  ├─ public
│  ├─ src
│  │  ├─ components
│  │  │  ├─ ExchangeRates.js
│  │  │  ├─ Loader.js
│  │  │  ├─ PotTotals.js
│  │  │  ├─ PromiseDefinitionForm.js
│  │  │  ├─ RequirementsGate.js
│  │  │  └─ TransactionResultScreen.js
│  │  ├─ contexts
│  │  │  └─ Web3Interface
│  │  │     ├─ ContractGetterFunctions.js
│  │  │     └─ index.js
│  │  ├─ pages
│  │  │  ├─ Cashout.js
│  │  │  ├─ CheckIn.js
│  │  │  ├─ CreateContract.js
│  │  │  ├─ CreatePromise.js
│  │  │  ├─ Nominate.js
│  │  │  ├─ NotFound.js
│  │  │  ├─ Start.js
│  │  │  ├─ _layout.js
│  │  │  └─ index.js
│  │  ├─ smart-contract
│  │  │  ├─ abi
│  │  │  │  ├─ AccountabilityChecker.js
│  │  │  │  └─ AccountabilityCheckerFactory.js
│  │  │  └─ contracts.js
│  │  ├─ styles
│  │  │  └─ index.scss
│  │  ├─ utils
│  │  │  ├─ Validation
│  │  │  │  └─ PromiseDefintion.js
│  │  │  └─ functions.js
│  │  ├─ Routes.js
│  │  ├─ index.js
│  │  └─ reportWebVitals.js
│  └─ package.json
├─ smartcontract
│  ├─ contracts
│  │  ├─ AccountabilityChecker.sol
│  │  ├─ AccountabilityCheckerFactory.sol
│  │  └─ Migrations.sol
│  ├─ migrations
│  │  ├─ 1_initial_migration.js
│  │  └─ 2_deploy_accountability_checker.js
│  ├─ test
│  │  ├─ utils
│  │  │  ├─ functions.js
│  │  │  └─ variables.js
│  │  ├─ 0_Smart_Contract_Initialization.js
│  │  ├─ 1_Promise_Activation.js
│  │  ├─ 2_Check_Commitments.js
│  │  ├─ 3_Promise_Cashout.js
│  │  └─ 4_Contract_Reusablity.js
│  ├─ package.json
│  └─ truffle-config.js
├─ FinalProjectIdea.md
└─ README.md (You are here 😄)
```

---

### _smartcontract_

This folder contains my smart contract. It uses truffle for development, deployment and migration, and various other packages to work and so begin by installing them with

```bash
npm install

```

within the directory. Within the _contracts_ folder the contracts relevant to this project are

- **_smartcontract/contracts/AccountabilityChecker.sol _** : This is the smart contract users use to create and check their promises
- **_smartcontract/contracts/AccountabilityCheckerFactory.sol _** : A smart contract that acts as a proxy factory; duplicates copies of the linked AccountabilityChecker smart contract. Also provides functions that allows a user to retrive AccountabilityChecker smart contracts they own

And their migration file is \_migrations/2_deploy_accountability_checker.js. These contracts both inherit from some openzeppelin contracts.

#### Tests

This project contains approximately 50 tests (woo TDD) to test the various aspects of both these contracts from start to finish of the proposed use of my smart-contract application. The _utils_ folder contains various constants and functions that are used repeatedly in the tests. To run them all use the command:

```bash
truffle test

```

Certains tests (particularly 3_Promise_Cashout.js and 4_Contract_Reusablity.js) take a longer duration because they are using loops to simulate the passing of time, and so it can look like the tests have frozen. But be rest assured that theyre working as intended...lol I hope. It is advised to run tests files that have large time simulates separate to avoid this issue

```bash
truffle test test/3_Promise_Cashout.js

```

#### Deployment

The _truffle-config.js_ has been configured to deploy on the Ropesten network and requires 2 environment variables to work, and these are provided by an .env file (see _.envsample_, remove the _sample_ bit of the file name to use with the project); `INFURA_API_KEY` which can be got [by signing up to INFURA](https://infura.io/) and `MNEMONIC` which is 24 word seed phrase to generate the wallets associated with the deployment. The first account in the wallet will be the owner of the deployed Accountability Contract Factory contract.
Please see _deployed_address.txt_ for the address of smart contract that have been already deployed

---

### _accountabil-eth-y_

This folder contains the front end part of my project, it is a react application. To install the dependancies please use the following command

```bash
nvm use; npm install

```

There is an env file associated with this project (see _.envsample_), apart from removing the _sample_ bit to use it there isn't anything required at this stage. There was an intention to use the Ethscan api (REACT_APP_ETHSCAN_API_KEY = "") but it was never implemented

#### Localhost

The project can be served from localhost3000 by using the command

```bash
npm run start

```

A provider such as Metamask is required to interact with the project.

#### Files and Folders of interest

There are so many things going on with this part of the project but here are ones of note:

- **_accountabil-eth-y/src/contexts/index.js _**: Context Provider, contains various functions that are imported by pages to call functions on the AccountabilityCheckerFactory and AccountabilityChecker contracts to get data and action transactions
- **_accountabil-eth-y/src/pages _**: pages of the application that users interact with are stored here.
- **_accountabil-eth-y/src/smart-contract/ _**: Where the ABI of the AccountabilityCheckerFactory and AccountabilityChecker contracts is kept (please update this if you make changes to the smart contracts in smartcontract/contracts) and functions that instantiate Contract objects from them.
- **_accountabil-eth-y/src/Routes.js _**: Defines the routing structure of the application.
- **_accountabil-eth-y/src/utils _**: contains functions used repeatedly in this application. Validation schema used for promise creation lives here.

---

### Closing Remarks

This is a MVP project and I intend to return to this at a later date to clean up the code base and add some much needed CSS sparkle ✨.
Thank you for marking my project, I hope to develop more web3 applications like this!
