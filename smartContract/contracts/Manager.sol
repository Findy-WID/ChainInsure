// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {SecuredVault} from "./SecuredVault.sol";

error Manager_VaultAlreadyExisted();
error Manager_VaultADoesNotExist();

contract Manager {


    mapping(address => SecuredVault) private s_userVault;

    modifier vaultExist(address _user) {
        if (address(s_userVault[_user]) == address(0)) {
            revert Manager_VaultADoesNotExist();
        }
        _;
    }

    function createVault(address _owner,uint256 _threshold, string memory _secret) external {
        // Check if the user has already created a vault
        if (address(s_userVault[_owner]) != address(0)) {
            revert Manager_VaultAlreadyExisted();
        }

        // create  new vault for a user
        SecuredVault vault = new SecuredVault(_owner, _threshold, _secret);

        // assign vault to the users address
        s_userVault[_owner] = vault;
    }

    // function depositFunds(address _owner, uint256 _amount) external payable {
    //     bool success;
    //     // (bool success, ) = payable(s_userVault[_user]).call{value: _amount};
    //     (success,) = payable(s_userVault[_owner]).call{value: _amount}("");
    //     // (success, bytes memory data) = address(s_userVault).call{ value: msg.value, gas: 5000}(abi.encodeWithSignature("foo(string,uint256)", "call foo", 123))

    // }

    function withdrawFunds(address _owner, address payable _to, uint256 _amount) external payable {
        SecuredVault(payable(s_userVault[_owner])).sendFunds(_to, _amount);
    }

    function getVaultBalance(address _owner) external view returns (uint256) {
        return SecuredVault(payable(s_userVault[_owner])).getBalance();
    }

    function getVaultAddress(address _owner) external view returns(SecuredVault){
        return s_userVault[_owner];
    }
}
