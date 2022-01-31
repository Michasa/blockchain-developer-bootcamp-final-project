### Access Control Design Patterns

When the Accountability Checker Factory contract deploys an instance of the Accountability Checker contract, the caller of the function to create it becomes the owner. Majority of the functions within Accountability Checker are restricted to the Owner with use of the modifier `isOwner`x

### Inheritance and Interfaces

Both of my contracts inherit from Openzeplin contracts!

1. Initializable.sol: Because proxied contracts cannot have a constructor and I used this contract to implement a initialize function in contract AccountabilityChecker

2. ClonesUpgradeable: Used in contract AccountabilityCheckerFactory in order to make clones of contract AccountabilityChecker
