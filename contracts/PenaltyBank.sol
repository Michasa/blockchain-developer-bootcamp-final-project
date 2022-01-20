// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract PenaltyBank {
    address private payee_contract;
    address private recipient_address;
    uint256 private balance;

    event paymentRecipientSet(address recipient_address);
    event current_balance(uint256 balance);
    event penaltyPayoutSummary(uint256 sent_amount, bool sentPenaltyPayout);

    modifier fromPayeeContract() {
        require(msg.sender == payee_contract, "approved payee contract only");
        _;
    }
    modifier isApprovedRecipient() {
        require(recipient_address != address(0), "receipent required");
        require(msg.sender == recipient_address, "approved receipent only");
        _;
    }

    constructor(address owner_contract) {
        payee_contract = owner_contract;
    }

    function setPaymentNominee(address recipient) public fromPayeeContract {
        recipient_address = recipient;

        emit paymentRecipientSet(recipient_address);
    }

    receive() external payable fromPayeeContract {
        emit current_balance(address(this).balance);
    }

    function payoutPenaltyPayment() public payable isApprovedRecipient {
        uint256 amount = address(this).balance;
        bool sent;
        if (amount > 0) (sent, ) = recipient_address.call{value: amount}("");
        emit penaltyPayoutSummary(amount, sent);
    }
}
