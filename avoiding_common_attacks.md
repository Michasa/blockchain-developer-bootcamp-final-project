### Using Specific Compiler Pragma

Both my contracts have pragma ^0.8.0;

### Checks-Effects-Interactions

The `cashOut` function of contract Accountability Checker, state changes variables are made before payable functions are called to pay the owner and their nominee

Extras I think apply...

### Use Modifiers Only for Validation

Modifiers used to confirm ownership, promise activation and timing states of the contract before proceeding with a function.

### Proper Use of Require, Assert and Revert

Require was used as a conditional gate on multiple occasions in the Accountability Checker contract either directly or as part of a modifier. I used assert to ensure the completion of two essential functions ( updateCheckTimes && updateMoneyPots) before proceeding with another one acceptCommitmentSubmission.
