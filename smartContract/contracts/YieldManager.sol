// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ------------------------
// Imports
// ------------------------
import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";

// ------------------------
// Errors
// ------------------------

// ------------------------
// Interfaces, Libraries, Contracts
// ------------------------

contract YieldManager is AccessControlEnumerable {

    // ------------------------
    // Type Declarations
    // ------------------------
    
    // ------------------------
    // State Variables
    // ------------------------
    bytes32 public constant MANAGER_CONTRACT = keccak256("MANAGER_CONTRACT");

    IPool public pool;                // Aave Pool interface
    IERC20 public paymentToken;       // Token to be deposited in Aave
    address public aTokenAddress;     // Aave aToken address for the deposit
    address public managerContract;   // Manager contract address

    // ------------------------
    // Events
    // ------------------------
    
    // ------------------------
    // Modifiers
    // ------------------------

    // ------------------------
    // Functions
    // ------------------------

    // Constructor
    constructor(address manageContract_, address poolAddress_, address paymentTokenAddress_) {
        pool = IPool(poolAddress_);
        managerContract = manageContract_;
        paymentToken = IERC20(paymentTokenAddress_);
        aTokenAddress = getATokenAddress(paymentTokenAddress_);
    }

    // ------------------------
    // External Functions
    // ------------------------
    
    /**
     * @notice Deposits tokens into Aave to earn interest
     * @param amount_ The amount of tokens to be deposited.
     */
    function deposit(uint256 amount_) external {
        // Approve the Aave pool to spend the tokens
        paymentToken.approve(address(pool), amount_);
        // Deposit tokens into Aave pool
        pool.deposit(address(paymentToken), amount_, address(this), 0);
    }

    /**
     * @notice Withdraws tokens from Aave
     * @param amount_ The amount of tokens to withdraw
     * @param recipient_ The address to send the withdrawn tokens
     * @return The actual amount withdrawn
     */
    function withdraw(uint256 amount_, address recipient_) external returns (uint256) {
        return pool.withdraw(address(paymentToken), amount_, recipient_);
    }

    // ------------------------
    // Public Functions
    // ------------------------
    
    /**
     * @notice Gets the available balance of aTokens
     * @return The balance of aTokens held by the contract
     */
    function getAvailableBalance() public view returns (uint256) {
        return IERC20(aTokenAddress).balanceOf(address(this));
    }

    /**
     * @notice Gets the aToken address for a specific token
     * @param paymentToken_ The address of the payment token
     * @return The aToken address corresponding to the payment token
     */
    function getATokenAddress(address paymentToken_) public view returns (address) {
        DataTypes.ReserveData memory reserveData = pool.getReserveData(paymentToken_);
        return reserveData.aTokenAddress;
    }

    // ------------------------
    // Internal Functions
    // ------------------------

    // ------------------------
    // Private Functions
    // ------------------------

    // ------------------------
    // View & Pure Functions
    // ------------------------
}
