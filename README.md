# accountabil.ETH.y 🖐️

### _My promise is BOND!_ 💯

- A platform where people further motivate themselves to complete goals further by staking ETH on their commitments.
- Depends on an external api that providing information on trackable commitment's fulfilment.

### Work Flow

1. On Front End Application user inputs:

- description commitment (e.g. "🏋️I will visit the gym at least twice a week", "📺 I will only watch Netflix for 5hrs a week", "💻 I will commit this github repo five times a week")
- external api tracking this
- amount staked.
- penalty protocol (forgiving, strict)
- time period.

2. This deploys a Smart Contract to which the user's account transfers the ETH to keep
3. If the user FAILS ❎ penalty is executed; defined amount deducted from staked amount until it is 0 (forgiving) all amount is taken (strict). Confiscated money is transfered to money pot account.
4. If the user succeeds ✅ money is returned to original user account.

### The Contracts!!

1. Accountability Checker (https://ropsten.etherscan.io/address/0x461d7057A672e4111B7445f7382E4343484A84e8)
   ADDRESS = 0x461d7057A672e4111B7445f7382E4343484A84e8
   Where the magic happens ✨. Contract that incentivizes a user to keep to their commitments at the risk of either earning or losing their daily wager. This contract is used by the factory to make clones.

2. Accountability Checker Factory (https://ropsten.etherscan.io/address/0x461d7057A672e4111B7445f7382E4343484A84e8#code)
   ADDRESS = 0x461d7057A672e4111B7445f7382E4343484A84e8
   Factory contract that creates clones of the Accountability Checker for a user. Also used to retrive a users' previous contracts in case they lose them. It is owned by (0x8c19e0Fd2717261E2E49Bafd74A412333F400762)

### How to use

## TESTS

Certains tests take a longer duration because they are using loops to simulate the passing of time, and so it can look like the tests have frozen. But be rest assured that they're working as intended...lol I hope.

It is advised to run tests files that have large time simulates separate to avoid this issue

> > e.g. $ test test/3_Promise_Cashout.js
