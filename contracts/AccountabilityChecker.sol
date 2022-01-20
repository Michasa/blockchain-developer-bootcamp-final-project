// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./PenaltyBank.sol";

contract AccountabilityChecker {
    // SECTION  STATE VARIABLES
    address private owner;
    PenaltyBank private _PenaltyBank;
    address private nominated_account;

    bytes32[] private commitments;
    uint256 private pledge_pot;
    uint256 private daily_wager;
    uint256 private reward_pot;
    uint256 private penalty_pot;

    bool private isPromiseActive;

    uint256 private promise_deadline;
    uint256 private check_open;
    uint256 private check_closed;
    uint256 private last_checked;
    uint256 private checks_left;

    // SECTION EVENTS
    event penaltyBankCreated(address penalty_bank_address);
    event nomineeSent(address nominee_address);

    event promiseSet(
        bytes32[] commitments,
        uint256 pledge_pot,
        uint256 promise_deadline,
        uint256 check_open,
        uint256 check_closed,
        uint256 checks_left
    );

    event moneyPotUpdated(
        uint256 pledge_pot,
        uint256 reward_pot,
        uint256 penalty_pot
    );

    event checkIntervalUpdated(
        uint256 check_open,
        uint256 check_closed,
        uint256 checks_left
    );

    event penaltyApplied(
        uint256 days_missed,
        uint256 pledge_pot,
        uint256 penalty_pot
    );

    event cashOutSummary(
        uint256 payout,
        uint256 penalty,
        bool sentToOwner,
        bool sentToPenaltyBank,
        bool isPromiseActive
    );

    // event log(address one);

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

    modifier promiseExpired() {
        require(block.timestamp >= promise_deadline, "promise not expired");
        _;
    }

    modifier promiseNotExpired() {
        require(
            (block.timestamp < promise_deadline),
            "promise expired; cashout now"
        );
        _;
    }

    modifier commitmentNotSubmitted(uint256 time_given) {
        require(
            time_given > last_checked && time_given >= check_open,
            "already submitted"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
        createPenaltyBank();
    }

    //SECTION MAIN FUNCTIONS
    // 🌟 CREATE PROMISE
    function createPenaltyBank() internal isOwner {
        _PenaltyBank = new PenaltyBank(address(this));

        assert(address(_PenaltyBank) != address(0));
        emit penaltyBankCreated(address(_PenaltyBank));
    }

    function setNomineeAccount(address nominee)
        public
        isOwner
        promiseNotActive
    {
        require(nominee != owner, "cant nominate contract owner");
        require(nominee != address(this), "cant nominate this contract");
        require(
            nominee != address(_PenaltyBank),
            "cant nominate penalty contract"
        );

        nominated_account = nominee;
        _PenaltyBank.setPaymentNominee(nominated_account);

        emit nomineeSent(nominated_account);
    }

    function activatePromise(
        bytes32[] memory my_commitments,
        uint256 my_wager,
        uint256 commitment_checks,
        uint256 my_deadline
    ) public payable isOwner promiseNotActive {
        require(nominated_account != address(0), "nominee account required");
        require(
            my_commitments.length != 0 && my_commitments.length <= 3,
            "1-3 commitments only"
        );
        require(
            my_deadline > block.timestamp &&
                my_deadline - block.timestamp >= 2 days,
            "deadline >1 day away only"
        );
        require(
            ((my_deadline - block.timestamp) / 1 days) < 29,
            "deadline <30 days away only"
        );
        uint256 calculated_deadline = block.timestamp +
            (commitment_checks * 1 days);
        require(
            calculated_deadline < my_deadline &&
                ((my_deadline - calculated_deadline) <= 1 days),
            "incorrect # of checks"
        );
        require(my_wager > 0, "insufficient wager");
        require(
            msg.value >= my_wager * commitment_checks,
            "insufficient pledge amount"
        );
        pledge_pot = msg.value;
        isPromiseActive = true;
        promise_deadline = my_deadline;

        checks_left = commitment_checks;
        daily_wager = my_wager;
        commitments = my_commitments;

        updateCheckInterval(block.timestamp);
        emit promiseSet(
            commitments,
            pledge_pot,
            promise_deadline,
            check_open,
            check_closed,
            checks_left
        );
    }

    // 🔍 CHECK PROMISE
    function checkCommitments(bool commitments_fulfiled, uint256 time_submitted)
        public
        isOwner
        promiseActive
        commitmentNotSubmitted(time_submitted)
        promiseNotExpired
    {
        uint256 new_time;
        if (time_submitted >= check_open && time_submitted < check_closed) {
            new_time = check_open + 1 days;
        } else {
            uint256 missed_days = (time_submitted - check_closed) / 1 days;
            if (missed_days > 0) applyPenalty(missed_days);
            new_time = check_open + 1 days + (1 days * missed_days);
        }
        updateMoneyPots(commitments_fulfiled);
        updateCheckInterval(new_time);
    }

    // 🤑 CASHOUT REWARD
    function cashOut() public payable isOwner promiseActive promiseExpired {
        if (checks_left != 0) applyPenalty(checks_left);

        uint256 payout = reward_pot + pledge_pot;
        reward_pot = 0;
        pledge_pot = 0;

        uint256 penalty = penalty_pot;
        penalty_pot = 0;

        isPromiseActive = false;
        bool sentPayout;
        bool sentPenalty;

        if (payout > 0) (sentPayout, ) = owner.call{value: payout}("");

        if (penalty > 0)
            (sentPenalty, ) = payable(address(_PenaltyBank)).call{
                value: penalty
            }("");

        emit cashOutSummary(
            payout,
            penalty,
            sentPayout,
            sentPenalty,
            isPromiseActive
        );
    }

    //REVIEW which does the variable check belong to? don't update check interval if 0 checks left

    //SECTION UTIL FUNCTIONS (move this to a library? YES)
    function updateCheckInterval(uint256 new_time) internal {
        check_open = new_time;
        check_closed = check_open + 1 days;

        emit checkIntervalUpdated(check_open, check_closed, checks_left);
    }

    function updateMoneyPots(bool result) internal {
        pledge_pot -= daily_wager;
        result == true ? reward_pot += daily_wager : penalty_pot += daily_wager;
        checks_left -= 1;
        last_checked = block.timestamp;

        emit moneyPotUpdated(pledge_pot, reward_pot, penalty_pot);
    }

    function applyPenalty(uint256 missed_days) internal {
        uint256 penalty_amount = missed_days * daily_wager;
        pledge_pot -= penalty_amount;
        penalty_pot += penalty_amount;
        checks_left -= missed_days;

        emit penaltyApplied(missed_days, pledge_pot, penalty_pot);
    }

    function getPromiseDetails()
        public
        view
        isOwner
        returns (
            bytes32[] memory,
            uint256,
            uint256,
            uint256,
            uint256,
            bool
        )
    {
        return (
            commitments,
            check_open,
            check_closed,
            checks_left,
            promise_deadline,
            isPromiseActive
        );
    }

    function getPenaltyPaymentDetails()
        public
        view
        isOwner
        returns (address, address)
    {
        return (nominated_account, address(_PenaltyBank));
    }

    function getPotsDetails()
        public
        view
        isOwner
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        return (pledge_pot, reward_pot, penalty_pot);
    }
}
