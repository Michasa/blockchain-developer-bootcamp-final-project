// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract AccountabilityChecker is Initializable {
    uint256 public immutable contract_creation = block.timestamp;

    bytes32[] private commitments;
    uint256 private pledge_pot;
    uint256 private daily_wager;
    uint256 private reward_pot;
    uint256 private penalty_pot;

    uint256 public promise_deadline;
    uint256 private check_open;
    uint256 private check_closed;
    uint256 private last_checked;
    uint256 private checks_left;

    address private nominee_account;
    address public owner;
    bool public isPromiseActive;

    event nomineeSet(address nominee_address);
    event promiseSet(
        bytes32[] commitments,
        uint256 pledge_pot,
        uint256 promise_deadline,
        uint256 checks_left
    );

    event moneyPotUpdated(
        uint256 pledge_pot,
        uint256 reward_pot,
        uint256 penalty_pot
    );

    event checkTimesUpdated(uint256 check_open, uint256 check_closed);

    event submissionAccepted(uint256 checks_left, uint256 last_checked);

    event penaltyApplied(uint256 days_missed, uint256 penalty_amount);

    event cashOutSummary(
        uint256 payout,
        uint256 penalty,
        bool sentToOwner,
        bool sentToNominee,
        bool isPromiseActive
    );

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

    modifier notAlreadyChecked(uint256 time_given) {
        require(
            time_given > last_checked && time_given >= check_open,
            "already submitted"
        );
        _;
    }

    function initialize(address requester) public initializer {
        owner = requester;
    }

    function setNominee(address nominee) public isOwner promiseNotActive {
        require(nominee != owner, "cant nominate owner account");
        require(nominee != address(this), "cant nominate this contract");

        nominee_account = nominee;

        emit nomineeSet(nominee_account);
    }

    function activatePromise(
        bytes32[] memory my_commitments,
        uint256 my_wager,
        uint256 commitment_checks,
        uint256 my_deadline
    ) public payable isOwner promiseNotActive {
        require(nominee_account != address(0), "nominee account required");
        require(
            my_commitments.length != 0 && my_commitments.length <= 3,
            "1-3 commitments only"
        );
        require(my_wager > 0, "insufficient wager");
        require(
            msg.value >= my_wager * commitment_checks,
            "insufficient pledge amount"
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

        pledge_pot = msg.value;
        isPromiseActive = true;
        promise_deadline = my_deadline;

        checks_left = commitment_checks;
        daily_wager = my_wager;
        commitments = my_commitments;

        updateCheckTimes(block.timestamp);
        emit promiseSet(commitments, pledge_pot, promise_deadline, checks_left);
    }

    function checkCommitments(bool commitments_fulfiled, uint256 time_submitted)
        public
        isOwner
        promiseActive
        notAlreadyChecked(time_submitted)
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
        assert(
            updateCheckTimes(new_time) && updateMoneyPots(commitments_fulfiled)
        );
        acceptCommitmentSubmission();
    }

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

        if (payout > 0) (sentPayout, ) = payable(owner).call{value: payout}("");
        if (penalty > 0)
            (sentPenalty, ) = payable(nominee_account).call{value: penalty}("");

        emit cashOutSummary(
            payout,
            penalty,
            sentPayout,
            sentPenalty,
            isPromiseActive
        );
    }

    function updateCheckTimes(uint256 new_time) internal returns (bool) {
        check_open = new_time;
        check_closed = check_open + 1 days;

        emit checkTimesUpdated(check_open, check_closed);
        return true;
    }

    function updateMoneyPots(bool result) internal returns (bool) {
        pledge_pot -= daily_wager;
        result == true ? reward_pot += daily_wager : penalty_pot += daily_wager;

        emit moneyPotUpdated(pledge_pot, reward_pot, penalty_pot);
        return true;
    }

    function acceptCommitmentSubmission() internal {
        checks_left -= 1;
        last_checked = block.timestamp;

        emit submissionAccepted(checks_left, last_checked);
    }

    function applyPenalty(uint256 missed_days) internal {
        uint256 penalty_amount = missed_days * daily_wager;

        penalty_pot += penalty_amount;
        pledge_pot -= penalty_amount;

        checks_left -= missed_days;

        emit penaltyApplied(missed_days, penalty_amount);
    }

    function getPromiseDetails()
        public
        view
        isOwner
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            bytes32[] memory,
            bool
        )
    {
        return (
            check_open,
            check_closed,
            checks_left,
            promise_deadline,
            nominee_account,
            commitments,
            isPromiseActive
        );
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
