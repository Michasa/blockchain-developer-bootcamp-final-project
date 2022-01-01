// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AccountabilityChecker {
    // ANCHOR  STATE VARIABLES
    uint256 public one_day_in_seconds = 86400; //could I outsource to a different contract?

    address public owner;
    bytes32[] public commitments;
    uint256 private pledge_pot;
    uint256 private daily_wager;

    uint256 private reward_pot;
    uint256 private penalty_pot;

    bool private isPromiseActive;
    uint256 private creation_date;
    uint256 private deadline;
    uint256 private last_checked;
    uint256 private days_left;

    // ANCHOR EVENTS
    event promiseSet(
        uint256 creation_date,
        bytes32[] commitments,
        uint256 pledge_pot,
        uint256 deadline,
        uint256 days_left
    );
    event potTotals(
        uint256 pledge_pot,
        uint256 reward_pot,
        uint256 penalty_pot
    );
    event cashOutResult(bool hasCashedOut);

    // ANCHOR MODIFIERS
    modifier isOwner() {
        require(msg.sender == owner, "owner only");
        _;
    }

    // NOTE Might no longer be relevant
    // modifier potHasEnough() {
    //     require(daily_wager < pledge_pot, "insufficient balance");
    //     _;
    // }

    modifier updatePromiseStatus() {
        if (block.timestamp > deadline) {
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

    constructor() {
        owner = msg.sender;
    }

    //ANCHOR MAIN FUNCTIONS
    // 🌟 CREATE PROMISE
    function activatePromise(
        bytes32[] memory my_commitments,
        uint256 my_wager,
        uint256 my_due_date
    ) public payable isOwner checkPromiseIsntActive {
        require(
            my_commitments.length != 0 && my_commitments.length <= 3,
            "1-3 commitments only"
        );
        require(my_due_date > block.timestamp, "future dates only");
        require(
            ((my_due_date - block.timestamp) / one_day_in_seconds) >= 1,
            "dates > 24hrs away only"
        );
        require(my_wager > 0, "insufficient wager defined");
        require(
            msg.value >=
                my_wager *
                    ((my_due_date - block.timestamp) / one_day_in_seconds),
            "insufficient pledge pot amount"
        );

        pledge_pot = msg.value;
        isPromiseActive = true;
        creation_date = block.timestamp;
        deadline = my_due_date;

        days_left = (deadline - creation_date) / one_day_in_seconds;

        daily_wager = my_wager;
        commitments = my_commitments;

        emit promiseSet(
            creation_date,
            commitments,
            pledge_pot,
            deadline,
            days_left
        );
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

    //     pledge_pot -= daily_wager;
    //     if (did_user_complete) {
    //         reward_pot += daily_wager;
    //     } else {
    //         penalty_pot += daily_wager;
    //     }

    //     emit potTotals(pledge_pot, reward_pot, penalty_pot);
    // }

    // 🤑 CASHOUT REWARD

    // function cashOutReward() public payable isOwner {
    //     //NOTE can only cash out once deadline has passed OR inffucient funds
    //     // correct transfer amount

    //     uint256 payout = reward_pot + pledge_pot;
    //     isPromiseActive = false;
    //     reward_pot = 0;
    //     pledge_pot = 0;
    //     penalty_pot = 0; //just destroy it for simplicity's sake
    //     (bool sent, ) = owner.call{value: payout}("");
    //     emit cashOutResult(sent);
    // }

    //ANCHOR UTIL FUNCTIONS

    // //TODO fix this return function
    // function showStats() public view returns () {
    //     pledge_pot;
    //     daily_wager;
    //     reward_pot;
    //     penalty_pot;
    //     deadline;
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

    //     pledge_pot -= daily_wager;
    //     if (did_user_complete) {
    //         reward_pot += daily_wager;
    //     } else {
    //         penalty_pot += daily_wager;
    //     }

    //     emit potTotals(pledge_pot, reward_pot, penalty_pot);
    // }

    receive() external payable {}

    fallback() external payable {}
}
