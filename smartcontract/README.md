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

### How to use

> TESTS
> certains tests take a longer duration because they are using loops to simulate the passing of time, and so it can look like the tests have frozen. But be rest assured that it is working.
> It is advised to run tests files that have large time simulates separate to avoid this issue
> e.g. $ test test/3_Promise_Cashout.js
