# Documentation: Insurance Policy Smart Contract Suite

## Overview
This document provides a detailed overview of the functions available in the **Insurance Policy** and related smart contracts (e.g., Manager Staking, Secured Vault, and StakingPool). Each section explains the usage of functions, their parameters, access controls, and expected outputs.

---

# **Insurance Policy**

The **Insurance Policy** smart contract handles the lifecycle of insurance policies, from creation to claims, premium fee calculation, and cancellation.

### **1. createPolicy**  
```solidity
function createPolicy(uint256 _coverageAmount, uint256 _period) external payable returns (uint256)
```
- **Description**: Creates a new insurance policy with a specified coverage amount and policy period.
- **Parameters**:
  - `_coverageAmount`: The total amount to be covered under this policy (in Wei).
  - `_period`: Duration of the policy in seconds (e.g., 30 days = 2592000 seconds).
- **Returns**: A unique policy ID (`uint256`).
- **Payable**: Requires the user to send the appropriate premium fee when calling the function.

---

### **2. claimPolicy**  
```solidity
function claimPolicy(address vaultAddress_) external onlyPolicyOwner
```
- **Description**: Initiates a claim against the policy to release the insured amount to a specific vault.
- **Parameters**:
  - `vaultAddress_`: The address of the secured vault where the claim payout will be sent.
- **Access Control**: Only the policy owner can call this function.

---

### **3. approvePolicy**  
```solidity
function approvePolicy(SecuredVault securedVault_, Policy memory policy_) public returns (uint256)
```
- **Description**: Approves a policy and transfers the necessary amount to the secured vault.
- **Parameters**:
  - `securedVault_`: The SecuredVault contract where funds will be deposited.
  - `policy_`: A `Policy` struct containing details of the policy being approved.
- **Returns**: A policy approval ID (`uint256`).

---

### **4. getPremiumFee**  
```solidity
function getPremiumFee(uint256 coverageAmount_, uint256 period_) external pure returns (uint256)
```
- **Description**: Calculates the premium fee for a given coverage amount and policy period.
- **Parameters**:
  - `coverageAmount_`: The total amount to be insured.
  - `period_`: Duration of the policy in seconds.
- **Returns**: Premium fee (`uint256`).

---

### **5. cancelPolicy**  
```solidity
function cancelPolicy() external onlyPolicyOwner
```
- **Description**: Cancels the policy before its expiry.
- **Access Control**: Only the policy owner can call this function.

---

### **6. checkPolicyValidity**  
```solidity
function checkPolicyValidity(address _user) public view returns (bool)
```
- **Description**: Checks whether a user’s policy is still active.
- **Parameters**:
  - `_user`: The address of the policy owner.
- **Returns**: `true` if the policy is valid, otherwise `false`.

---

# **Manager Staking**

The **Manager Staking** contract allows users to create secured vaults, manage funds, and track vault balances.

### **1. createVault**  
```solidity
function createVault(address _owner, uint256 _threshold, string memory _secret) external
```
- **Description**: Creates a secured vault for the specified owner.
- **Parameters**:
  - `_owner`: The address of the vault owner.
  - `_threshold`: The withdrawal threshold amount.
  - `_secret`: A secret key required for vault operations.

---

### **2. withdrawFunds**  
```solidity
function withdrawFunds(address _owner, address payable _to, uint256 _amount) external payable
```
- **Description**: Withdraws a specific amount of funds from the owner’s vault to a specified address.
- **Parameters**:
  - `_owner`: The address of the vault owner.
  - `_to`: The recipient address.
  - `_amount`: The amount to withdraw (in Wei).

---

### **3. getVaultBalance**  
```solidity
function getVaultBalance(address _owner) external view returns (uint256)
```
- **Description**: Retrieves the current balance of a specific vault.
- **Parameters**:
  - `_owner`: The address of the vault owner.
- **Returns**: Vault balance (`uint256`).

---

### **4. getVaultAddress**  
```solidity
function getVaultAddress(address _owner) external view returns (SecuredVault)
```
- **Description**: Retrieves the address of the secured vault belonging to the specified owner.
- **Parameters**:
  - `_owner`: The address of the vault owner.
- **Returns**: The `SecuredVault` address.

---

# **SecuredVault**

The **SecuredVault** contract manages the storage of funds with security features such as thresholds and secrets.

### **1. sendFunds**  
```solidity
function sendFunds(address payable _to, uint256 _amount) returns (bool)
```
- **Description**: Sends funds from the vault to the specified address.
- **Parameters**:
  - `_to`: The recipient address.
  - `_amount`: The amount to send (in Wei).
- **Returns**: `true` if the transfer was successful, otherwise `false`.

---

### **2. unfreezeAccount**  
```solidity
function unfreezeAccount(string memory _secret) external onlyOwner
```
- **Description**: Unfreezes the vault if it is locked.
- **Parameters**:
  - `_secret`: The secret key associated with the vault.
- **Access Control**: Only the vault owner can call this function.

---

### **3. setThreshold**  
```solidity
function setThreshold(uint256 _newThreshold) external onlyOwner
```
- **Description**: Updates the withdrawal threshold.
- **Parameters**:
  - `_newThreshold`: The new threshold amount.

---

### **4. getThreshold**  
```solidity
function getThreshold() external onlyOwner view returns (uint256)
```
- **Description**: Retrieves the current withdrawal threshold.
- **Returns**: The threshold amount (`uint256`).

---

### **5. setSecret**  
```solidity
function setSecret(string memory _secret) external onlyOwner
```
- **Description**: Sets a new secret key for the vault.
- **Parameters**:
  - `_secret`: The new secret key.

---

# **StakingPool**

The **StakingPool** contract manages staking and reward distribution for users participating in the pool.

### **1. withdraw**  
```solidity
function withdraw(uint256 amount) external
```
- **Description**: Withdraws a specified amount from the staking pool.
- **Parameters**:
  - `amount`: The amount to withdraw.

---

### **2. claimRewards**  
```solidity
function claimRewards() external nonReentrant
```
- **Description**: Claims accumulated rewards for the caller.
- **Access Control**: Uses the `nonReentrant` modifier to prevent reentrancy attacks.

---

### **3. getRewards**  
```solidity
function getRewards() external returns (uint256)
```
- **Description**: Retrieves the total rewards available for the caller.
- **Returns**: The reward amount (`uint256`).

---