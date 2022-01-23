// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24 <0.7.0;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./AccountabilityChecker.sol";

contract AccountabilityCheckerFactory {
    uint256 public contracts_deployed;
    address immutable accountability_checker_contract;
    address public owner;
    mapping(address => address[]) private user_deployed_contracts;

    event newContractCreated(address contract_address);

    constructor(address deployed_contract) public {
        accountability_checker_contract = deployed_contract;
        owner = msg.sender;
    }

    function createContract() external {
        address cloneContract = Clones.clone(accountability_checker_contract);
        AccountabilityChecker(cloneContract).initialize(msg.sender);

        (user_deployed_contracts[msg.sender]).push(cloneContract);
        contracts_deployed += 1;
        emit newContractCreated(cloneContract);
    }

    function findMyContracts(address requesting_user)
        external
        view
        returns (address[] memory)
    {
        return (user_deployed_contracts[requesting_user]);
    }
}
