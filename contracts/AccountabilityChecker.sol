// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//LINK https://blog.polymath.network/solidity-tips-and-tricks-to-save-gas-and-reduce-bytecode-size-c44580b218e6
// > Contract for dates https://github.com/pipermerriam/ethereum-datetime
// > Use SafeMath library for operations https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol
// NOTE default denomination of smart contract is GWEI
//
//CONSIDERATIONS
// store promises on blockchain?
// hardcode deduction amount and require min

import "hardhat/console.sol";

contract AccountabilityChecker {
    // ANCHOR Status Variables
    address public owner;

    // NOTE https://ethereum.stackexchange.com/questions/43751/does-solidity-support-passing-an-array-of-strings-to-a-contracts-constructor-ye
    bytes32[] public commitments;
    uint256 private money_pot;
    uint256 private stake_amount = 1600000; //  ~£5  //how much is being staked per day
    uint256 private reward_pot;
    uint256 private penalty_pot;

    // NOTE https://programtheblockchain.com/posts/2018/01/12/writing-a-contract-that-handles-time/
    // NOTE https://www.youtube.com/watch?v=HGw-yalqdgs
    uint256 private promise_deadline;

    bool public isPromiseActive = false; // is the promise active or not
    uint256 public promiseLastChecked; // the last time when the promise was last checked; unix timestamp

    // ANCHOR EVENTS

    event promiseSet(
        bytes32[] commitments,
        uint256 money_pot,
        uint256 promise_deadline
    );
    event potTotals(uint256 money_pot, uint256 reward_pot, uint256 penalty_pot);
    event cashOutResult(bool hasCashedOut);

    // ANCHOR MODIFIERS
    modifier isOwner() {
        require(msg.sender == owner, "owner only");
        _;
    }

    modifier potHasEnough() {
        require(stake_amount < money_pot, "insufficient balance");
        _;
    }

    modifier updatePromiseStatus() {
        if (block.timestamp > promise_deadline) {
            isPromiseActive = false;
        }
        _;
    }

    modifier checkPromiseIsActive() {
        require(isPromiseActive, "promise isnt active");
        _;
    }

    modifier checkPromiseIsntActive() {
        require(isPromiseActive != true, "promise is active"); //try !isPromiseActive
        _;
    }

    //ANCHOR CONSTRUCTOR
    constructor() {
        owner = msg.sender;
    }

    //ANCHOR MAIN FUNCTIONS
    // 🌟 CREATE PROMISE
    function activatePromise(bytes32[] memory _commitments, uint256 due_date)
        public
        payable
        isOwner
        checkPromiseIsntActive
    {
        require(commitments.length == 3, "3 commitments only");
        require(msg.value > stake_amount, "insufficient amount provided");
        // TODO require(promise_deadline > "is at least 24hrs away");
        isPromiseActive = true;
        for (uint256 i = 0; i < _commitments.length; i++) {
            commitments.push(_commitments[i]);
        }
        money_pot = msg.value;
        promise_deadline = due_date;

        emit promiseSet(commitments, money_pot, promise_deadline);
    }

    // 🔍 CHECK PROMISE
    // function checkPromise(bool did_user_complete)
    //     public
    //     potHasEnough
    //     isOwner
    //     checkPromiseIsActive
    // {
    //     //NOTE can only checkPromise ONCE every 24hrs.
    //     //  If 24hrs and no result is submitted automatic deduction to penalty pot.

    //     money_pot -= stake_amount;
    //     if (did_user_complete) {
    //         reward_pot += stake_amount;
    //     } else {
    //         penalty_pot += stake_amount;
    //     }

    //     emit potTotals(money_pot, reward_pot, penalty_pot);
    // }

    // 🤑 CASHOUT REWARD

    // function cashOutReward() public payable isOwner {
    //     //NOTE can only cash out once deadline has passed OR inffucient funds
    //     // correct transfer amount

    //     uint256 payout = reward_pot + money_pot;
    //     isPromiseActive = false;
    //     reward_pot = 0;
    //     money_pot = 0;
    //     penalty_pot = 0; //just destroy it for simplicity's sake
    //     (bool sent, ) = owner.call{value: payout}("");
    //     emit cashOutResult(sent);
    // }

    //ANCHOR UTIL FUNCTIONS

    // //TODO fix this return function
    // function showStats() public view returns () {
    //     money_pot;
    //     stake_amount;
    //     reward_pot;
    //     penalty_pot;
    //     promise_deadline;
    //     isPromiseActive;
    // }

    // function checkPromise(bool did_user_complete)
    //     public
    //     potHasEnough
    //     isOwner
    //     checkPromiseIsActive
    // {
    //     //NOTE can only checkPromise ONCE every 24hrs.
    //     //  If 24hrs and no result is submitted automatic deduction to penalty pot.

    //     money_pot -= stake_amount;
    //     if (did_user_complete) {
    //         reward_pot += stake_amount;
    //     } else {
    //         penalty_pot += stake_amount;
    //     }

    //     emit potTotals(money_pot, reward_pot, penalty_pot);
    // }

    receive() external payable {}

    fallback() external payable {}
}
