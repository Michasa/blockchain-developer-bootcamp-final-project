// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "./AccountabilityChecker.sol";

contract AccountabilityCheckerFactory {
    uint256 public contracts_deployed;
    address immutable accountability_checker_contract;
    address public owner;
    mapping(address => address[]) private user_deployed_contracts;

    event newContractCreated(address contract_address);

    event log(address);

    constructor(address deployed_contract) {
        accountability_checker_contract = deployed_contract;
        owner = msg.sender;
    }

    function createContract() external {
        address cloneContract = ClonesUpgradeable.clone(
            accountability_checker_contract
        );
        AccountabilityChecker(cloneContract).initialize(msg.sender);

        (user_deployed_contracts[msg.sender]).push(cloneContract);
        contracts_deployed += 1;
        emit newContractCreated(cloneContract);
    }

    function findMyContracts() external view returns (address[] memory) {
        return (user_deployed_contracts[msg.sender]);
    }
}
