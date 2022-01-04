// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract AccountabilityChecker {
    // SECTION  STATE VARIABLES
    uint256 public one_day_in_seconds = 86400; //could I outsource to a different contract?

    address public owner;
    bytes32[] private commitments;
    uint256 private pledge_pot;
    uint256 private daily_wager;

    uint256 private reward_pot;
    uint256 private penalty_pot;

    bool public isPromiseActive;

    uint256 public promise_deadline;
    uint256 public commitments_check_open;
    uint256 public commitments_check_deadline;
    uint256 private commitments_last_checked;
    uint256 private checks_left;

    // SECTION EVENTS
    event promiseSet(
        bytes32[] commitments,
        uint256 pledge_pot,
        uint256 promise_deadline,
        uint256 checks_left
    );

    event commitmentsChecked(
        uint256 pledge_pot,
        uint256 reward_pot,
        uint256 penalty_pot,
        uint256 checks_left
    );

    event commitmentTimesUpdated(
        uint256 commitments_check_open,
        uint256 commitments_check_deadline
    );
    // event log(uint256 given, uint256 open);
    //event cashOutResult(bool hasCashedOut);

    // SECTION MODIFIERS
    modifier isOwner() {
        require(msg.sender == owner, "owner only");
        _;
    }

    modifier promiseActive() {
        require(isPromiseActive, "promise isnt active");
        _;
    }

    modifier promiseNotActive() {
        require(!isPromiseActive, "promise is active");
        _;
    }
    modifier commitmentNotSubmitted(uint256 time_given) {
        require(
            time_given > commitments_last_checked &&
                time_given >= commitments_check_open,
            "already submitted"
        );
        _;
    }

    modifier promiseNotExpired() {
        require(
            checks_left != 0 && !(block.timestamp >= promise_deadline),
            "promise expired; cashout now"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //SECTION MAIN FUNCTIONS
    // 🌟 CREATE PROMISE
    function activatePromise(
        bytes32[] memory my_commitments,
        uint256 my_wager,
        uint256 my_due_date
    ) public payable isOwner promiseNotActive {
        require(
            my_commitments.length != 0 && my_commitments.length <= 3,
            "1-3 commitments only"
        );
        require(my_due_date > block.timestamp, "future dates only");
        require(
            ((my_due_date - block.timestamp) / one_day_in_seconds) >= 1,
            "dates >24hrs away only"
        );
        //TODO should prevent time being more than 30 days
        require(my_wager > 0, "insufficient wager");
        require(
            msg.value >=
                my_wager *
                    (((my_due_date - block.timestamp) / one_day_in_seconds)),
            "insufficient pledge amount"
        );

        pledge_pot = msg.value;
        isPromiseActive = true;
        promise_deadline = my_due_date;

        checks_left = (promise_deadline - block.timestamp) / one_day_in_seconds;
        daily_wager = my_wager;
        commitments = my_commitments;

        updateCommitmentCheckTimes(block.timestamp);
        emit promiseSet(commitments, pledge_pot, promise_deadline, checks_left);
    }

    // 🔍 CHECK PROMISE
    function checkCommitments(bool commitments_fulfiled, uint256 time_submitted)
        public
        isOwner
        promiseActive
        commitmentNotSubmitted(time_submitted)
        promiseNotExpired
    {
        if (time_submitted < commitments_check_deadline) {
            pledge_pot -= daily_wager;
            commitments_fulfiled == true
                ? reward_pot += daily_wager
                : penalty_pot += daily_wager;
        } else {
            revert("uhoh penalty time");
        }

        commitments_last_checked = block.timestamp;
        checks_left -= 1;
        updateCommitmentCheckTimes(commitments_check_open + one_day_in_seconds);

        emit commitmentsChecked(
            pledge_pot,
            reward_pot,
            penalty_pot,
            checks_left
        );
    }

    // 🤑 CASHOUT REWARD

    // function cashOutReward() public payable isOwner {
    //     //NOTE can only cash out once promise_deadline has passed OR inffucient funds
    //     // correct transfer amount

    //     uint256 payout = reward_pot + pledge_pot;
    //     isPromiseActive = false;
    //     reward_pot = 0;
    //     pledge_pot = 0;
    //     penalty_pot = 0; //just destroy it for simplicity's sake
    //     (bool sent, ) = owner.call{value: payout}("");
    //     emit cashOutResult(sent);
    // }

    //SECTION UTIL FUNCTIONS (move this to a library)

    function updateCommitmentCheckTimes(uint256 new_time) internal {
        commitments_check_open = new_time;
        commitments_check_deadline =
            commitments_check_open +
            one_day_in_seconds;

        emit commitmentTimesUpdated(
            commitments_check_open,
            commitments_check_deadline
        );
    }
    // function showStats() public view returns () {
    //     pledge_pot;
    //     daily_wager;
    //     reward_pot;
    //     penalty_pot;
    //     promise_deadline;
    //     isPromiseActive;
    // }
}
