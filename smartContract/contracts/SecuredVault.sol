// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;


import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol"; // Uncomment if Pausable is needed


contract SecuredVault is ReentrancyGuard, Pausable {

    // Errors
    error SecuredVault_OnlyOwner();
    error SecuredVault_AccountIsFrozen();
    error SecuredVault_ThresholdLimitExceeded();
    error SecuredVault_TransactionFailed();
    error SecuredVault_InsufficientBalance();
    error SecuredVault_InvalidSecret();

    // State Variables
    address private owner;
    uint256 private threshold;
    uint256 private currentTransactionCount;
    uint256 private totalTransactionValue;
    uint256 private transactionPer5Sec;
    uint256 private transactionTimestamp;
    uint256 private balance;
    uint256 private timeElapsed;
    bool private isFrozen;
    bytes32 private secretHash;
    uint256 private fundsLost;

    // Events
    event Frozen(string reason);
    event Unfrozen(string message);
    event ThresholdExceeded(uint256 transactionCount, uint256 totalValue);
    event SuspiciousBehaviorDetected(address user);
    event FundsWithdrawn(address to, uint256 amount);
    event HackDetected(uint256 fundsLost);

    // Modifiers
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

    // Constructor
    constructor(address _owner, uint256 _threshold, string memory _secret) {
        owner = _owner;
        threshold = _threshold;
        isFrozen = false;
        fundsLost = 0;
        secretHash = keccak256(abi.encodePacked(_secret)); // Hash the secret using keccak256
        timeElapsed = block.timestamp;
    }

    // Send funds with security checks
    function sendFunds(address payable _to, uint256 _amount)
        public
        payable
        onlyOwner
        notFrozen
        nonReentrant
        whenNotPaused
        returns (bool)
    {
        // Ensure there is enough balance
        if (balance < _amount) {
            revert SecuredVault_InsufficientBalance();
        }

        // Monitor for suspicious behavior before sending funds
        monitorBehavior();

        balance -= _amount;
        currentTransactionCount++;
        totalTransactionValue += _amount;

        if (totalTransactionValue >= threshold) {
            freezeAccount();
            emit ThresholdExceeded(currentTransactionCount, totalTransactionValue);
            return false;
        }

        (bool success, ) = _to.call{value: _amount}("");
        if (!success) {
            revert SecuredVault_TransactionFailed();
        }
        if (isFrozen){
            fundsLost += _amount;
        }

        emit FundsWithdrawn(_to, _amount);
        return success;
    }

    // Freeze the account due to suspicious behavior or attack
    function freezeAccount() internal {
        isFrozen = true;
        emit Frozen("Your account is frozen due to strange behavior or a potential attack.");
    }

    // Unfreeze the account after verifying the secret
    function unfreezeAccount(string memory _secret) external onlyOwner whenPaused {
        if (keccak256(abi.encodePacked(_secret)) != secretHash) {
            revert SecuredVault_InvalidSecret();
        }
        isFrozen = false;
        emit Unfrozen("Account has been unfrozen successfully.");
    }

    // Reset the transaction threshold
    function setThreshold(uint256 _newThreshold) external onlyOwner {
        threshold = _newThreshold;
    }

    // Set a new secret for additional security
    function setSecret(string memory _secret) external onlyOwner {
        secretHash = keccak256(abi.encodePacked(_secret));
    }

    // Check if the hashed secret matches
    function isHashedMatch(string memory _secret) external view onlyOwner returns (bool) {
        return secretHash == keccak256(abi.encodePacked(_secret));
    }

    // Detect suspicious behavior such as rapid or excessive transactions
    function monitorBehavior() internal {
        if (block.timestamp > timeElapsed && !isFrozen) {
            timeElapsed = block.timestamp + 1 days;
            transactionPer5Sec = 0;
        }

        // Detect rapid transactions
        if (block.timestamp > transactionTimestamp) {
            transactionTimestamp = block.timestamp + 1 seconds;
            transactionPer5Sec = 0;
        }

        if (block.timestamp <= transactionTimestamp) {
            transactionPer5Sec++;
        }

        if (transactionPer5Sec >= 3) {
            freezeAccount();
            emit SuspiciousBehaviorDetected(msg.sender);
        }
    }

    // Receive function to accept Ether
    receive() external payable {
        balance += msg.value;
    }

    // Fallback function
    fallback() external payable {
        balance += msg.value;
    }

    // Get the contract's balance
    function getBalance() external view returns (uint256) {
        return balance;
    }

    // Check if the account is frozen
    function getAccountStatus() external view returns (bool) {
        return isFrozen;
    }

    // Report a hack and freeze all transactions
    function reportHack() external onlyOwner returns(bool , uint256) {
       
        emit HackDetected(fundsLost);
        return ( isFrozen, fundsLost);
    }

    // Pauses the contract in case of emergency
    function pauseContract() external onlyOwner whenNotPaused {
        _pause();
    }

    // Unpauses the contract
    function unpauseContract() external onlyOwner whenPaused {
        _unpause();
    }
}
