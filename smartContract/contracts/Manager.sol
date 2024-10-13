// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SecuredVault} from "./SecuredVault.sol";

error Manager_VaultAlreadyExisted();
error Manager_VaultDoesNotExist();  // Updated error message

contract Manager {

    address owner;

    // Mapping from user to their SecuredVault
    mapping(address => SecuredVault) private s_userVault;

    // Modifier to check if the vault exists for a user
    modifier vaultExist(address _user) {
        if (address(s_userVault[_user]) == address(0)) {
            revert Manager_VaultDoesNotExist();
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Function to create a new vault for a user
    function createVault(address _owner, uint256 _threshold, string memory _secret) external {
        // Check if the user has already created a vault
        if (address(s_userVault[_owner]) != address(0)) {
            revert Manager_VaultAlreadyExisted();
        }

        // Create a new vault for the user
        SecuredVault vault = new SecuredVault(_owner, _threshold, _secret);

        // Assign the vault to the user's address
        s_userVault[_owner] = vault;
    }

    // Function to withdraw funds from the user's vault
    function withdrawFunds(address _owner, address payable _to, uint256 _amount) external vaultExist(_owner) {
        SecuredVault(payable(s_userVault[_owner])).sendFunds(_to, _amount);
    }

    // Function to get the vault balance for a user
    function getVaultBalance(address _owner) external view vaultExist(_owner) returns (uint256) {
        return SecuredVault(payable(s_userVault[_owner])).getBalance();
    }

    // Function to get the vault address for a user
    function getVaultAddress(address _owner) external view vaultExist(_owner) returns (SecuredVault) {
        return s_userVault[_owner];
    }
}
