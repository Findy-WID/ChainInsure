// Layout of Contract:
// version
// imports
// errors
// interfaces, libraries, contracts
// Type declarations
// State variables
// Events
// Modifiers
// Functions

// Layout of Functions:
// constructor
// receive function (if exists)
// fallback function (if exists)
// external
// public
// internal
// private
// view & pure functions
// custom errors

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";

contract YieldManager is AccessControlEnumerable {
    // bytes32 public constant MANAGER_CONTRACT = keccak256("MANAGE_CONTRACT");

    IPool public pool;
    IERC20 public paymentToken;
    address public aTokenAddress;
    address public managerContract;

    constructor(address manageContract_, address poolAddress_, address paymentTokenAddress_) {
        pool = IPool(poolAddress_);
        // _grantRole(MANAGER_CONTRACT, manageContract_);
        managerContract = manageContract_;
        paymentToken = IERC20(paymentTokenAddress_);
        aTokenAddress = getATokenAddress(paymentTokenAddress_);
    }

    // Deposite  token into Aave to earn interest
    function deposit(uint256 amount_) public  {
        paymentToken.approve(address(pool), amount_);
        pool.deposit(address(paymentToken), amount_, address(this), 0);
    }

    // Withdraw tokens from Aave
    function withdraw(uint256 amount_, address recipient_) public returns (uint256) {
        return pool.withdraw(address(paymentToken), amount_, recipient_);
    }

    // check balance of aToken on Aave
    function getAvailableBalance() public view returns (uint256) {
        return IERC20(aTokenAddress).balanceOf(address(this));
    }

    function getATokenAddress(address paymentToken_) public view returns (address) {
        DataTypes.ReserveData memory collateralData = pool.getReserveData(paymentToken_);
        return collateralData.aTokenAddress;
    }
}
