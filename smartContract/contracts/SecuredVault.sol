// Layout of Contract:
// version
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// imports
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

// errors
error SecuredVault_OnlyOwner();
error SecuredVault_AccountIsFrozen();
error SecuredVault_ThresholdLimitIsExceeded();
error SecuredVault_TransactionFailed();
error SecuredVault_InsufficientBalance();
error SecuredVault_InvalidSecret();

// interfaces, libraries, contracts
contract SecuredVault is ReentrancyGuard /*, Pausable*/ {

    
// Type declarations
// State variables
    address private owner;

    struct MonitorTransaction {
        uint256 threshold;
    }

    // enum Status();

    // Transaction details
    uint256 private threshold;
    uint256 private currentTransactionCount;
    uint256 private totalTransactionValue;
    uint256 private transactionThreshold;
    uint256 private transactionPer5Sec;
    // uint256 private transactionPerSec;
    uint256 private transactionTimestamp;
    uint256 private balance;

    // security details
    bool private isFrozen;
    bytes32 private secretHash;
    uint256 private timeElapsed;
    bool private isTimeElapse;

// Events
    // notifications
    event AccountFrozen(string _text);
    event AccountUnfrozen(string _text);
    event ThresholdExceeded(uint256 _transtionCount, uint256 _totalValue);
    event SuspiciousBehaviourDetected(address user);

// Modifiers
    // reuseable checks
    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert SecuredVault_OnlyOwner();
        }
        _;
    }

    modifier notFrozen() {
        if (isFrozen) {
            revert SecuredVault_AccountIsFrozen();
        }
        _;
    }
    // Functions


// constructor
    constructor(address _owner, uint256 _threshold, string memory _secret) {
        owner = _owner;
        threshold = _threshold;
        totalTransactionValue = 0;
        currentTransactionCount = 0;
        isFrozen = false;
        secretHash = keccak256(abi.encodePacked(_secret));
    }

    // send funds, when account is not rozen
    function sendFunds(address payable _to, uint256 _amount)
        public
        payable
        onlyOwner
        notFrozen
        nonReentrant
        returns (bool)
    {
        // ensure there is enough funds
        if (balance < _amount) {
            revert SecuredVault_InsufficientBalance();
        }

        monitorBehavior();

        balance -= _amount;
        // _to.transfer(_amount);
        currentTransactionCount++;
        totalTransactionValue += _amount;
        if (totalTransactionValue >= threshold) {
            freezeAccount();
            return false;
        }

        (bool success,) = _to.call{value: _amount}("");
        if (!success) {
            revert SecuredVault_TransactionFailed();
        }

        return success;
    }

    // freeze account
    function freezeAccount() internal {
        isFrozen = true;
        emit AccountFrozen("Your account is frozen due to some stange behevious detected");
    }

    // unfreeze account
    function unfreezeAccount(string memory _secret) external onlyOwner {
        if (keccak256(abi.encodePacked(_secret)) != secretHash) {
            revert SecuredVault_InvalidSecret();
        }

        isFrozen = false;
        emit AccountUnfrozen("Account has been unfrozen successfuly!");
    }

    // reset threshold
    function setThreshold(uint256 _newThreshold) external onlyOwner {
        threshold = _newThreshold;
    }

    function getThreshold() external onlyOwner view returns(uint256){
        return threshold;
    }

        // reset threshold
    function setSecret(string memory _secret) external onlyOwner {
        secretHash = keccak256(abi.encodePacked(_secret)) ;
    }

    function isHashedMatch(string memory _secret) external view onlyOwner returns (bool){
        return secretHash == keccak256(abi.encodePacked(_secret)) ;
    }

    // monitor suspicious behavior
    function monitorBehavior() internal {
        // Reset daily limit
        if (timeElapsed < block.timestamp && !isFrozen) {
            timeElapsed = 1 days;
        }

        // freeze if there are too many transaction in a short period
        if (transactionTimestamp <= block.timestamp) {
            transactionTimestamp += (block.timestamp + 5 seconds);
            transactionPer5Sec = 0;
        }

        if (transactionTimestamp > block.timestamp) {
            transactionPer5Sec += 1;
        }

        if (transactionPer5Sec > 5) {
            isFrozen = true;
            emit AccountFrozen("Account is freeze due to too many transaction in a short period");
        }
    }


    receive() external payable {
        balance += msg.value;
    }

    fallback() external payable {
        balance += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return balance;
    }

    function getAccountStatus() external view returns (bool) {
        return isFrozen;
    }
}
