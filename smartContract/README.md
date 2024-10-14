
# CHAIN INSURE

**CHAIN INSURE** is a Solidity-based insurance contract designed to secure digital assets stored in Ethereum wallets by monitoring for unusual or malicious activity. The system automatically freezes the insured account if suspicious behavior is detected, such as multiple transactions in a short time span or funds exceeding a threshold. It offers an added layer of protection with a secret-based unfreezing mechanism.

The project is built using Solidity, OpenZeppelin security modules, and the Aave protocol for yield management.
Below is a unified **README documentation** covering the `Manager`, `SecuredVault`, `InsuranceManager`, and `StakingPool` contracts. This README provides an overview of the contracts, their purpose, key functions, and how they interact with each other.

---

# **Smart Contracts Documentation**

This repository contains multiple smart contracts designed to work together, including **Manager**, **SecuredVault**, **InsuranceManager**, and **StakingPool**. These contracts provide functionality for managing vaults, staking rewards, insurance policies, and security checks to ensure smooth and transparent decentralized finance operations.

---

## **Table of Contents**
1. [Contracts Overview](#contracts-overview)
2. [Contract Interactions](#contract-interactions)
3. [Contracts](#contracts)
    - [Manager](#1-manager)
    - [SecuredVault](#2-securedvault)
    - [InsuranceManager](#3-insurancemanager)
    - [StakingPool](#4-stakingpool)
4. [Deployment and Usage](#deployment-and-usage)

---

```bash
ManagerModule#Manager - 0x8690c9e8329aeEB65bB5ad299fD4B6d67882C05D
SecuredVaultModule#SecuredVault - 0x9D3AEaE603Ac0482a04898919f20a4E318B99Cf8
InsuranceModule#InsuranceManager - 0x6D0ceF6a337bF944bc4E002b91D445dE6E28aD08
StakinPoolModule#StakingPool - 0x9b87EfDFcB734243E483f447d73EccC128023839
```

## **Contracts Overview**
- **Manager**: Responsible for managing vault addresses for users and connecting vaults with the insurance mechanism.
- **SecuredVault**: Holds user assets and implements hack detection and freezing mechanisms to secure funds.
- **InsuranceManager**: Manages insurance policies, allowing users to create policies, claim rewards, or cancel them.
- **StakingPool**: Allows users to stake ETH, earn rewards, and withdraw their funds. Works with `WETH` and integrates with the Aave pool for yield-bearing operations.

---

## **Contract Interactions**
- **InsuranceManager** relies on the `SecuredVault` to detect hacks and approve insurance claims.
- **StakingPool** integrates with **WETH** and **Aave IPool** to deposit, withdraw, and stake ETH efficiently.
- **Manager** resolves vault addresses for users to allow seamless insurance claims and security checks between different modules.

---

## **Contracts**

### **1. Manager**
The `Manager` contract is responsible for managing vault addresses for users. It ensures that each user has a unique vault, and these vaults are used by the insurance mechanism.

#### **Key Functions:**
- **`createVault(address _owner, uint256 _threshold, string memory _secret)`**: Returns the `SecuredVault` create a vault to a specific user.

- **`getVaultAddress(address _user)`**: Returns the `SecuredVault` address assigned to a specific user.
- **`setVaultAddress(address _user, address _vault)`**: Assigns a vault address to a user (only callable by the owner).

---

### **2. SecuredVault**
The `SecuredVault` stores user assets securely and offers a mechanism to detect and report hacks or freezing events. It is integral to the insurance process.

#### **Key Functions:**
- **`reportHack()`**: Checks if a hack or loss has been reported and returns the status and lost funds.
- **`freezeAccount(address _user)`**: Freezes the user’s account if malicious activity is detected (admin-only function).

---

### **3. InsuranceManager**
The `InsuranceManager` handles the entire lifecycle of insurance policies, including creation, activation, review, and claims. It ensures that policies are only approved if no suspicious activity is detected by `SecuredVault`.

#### **Key Structures:**
- **`Policy`**: Contains policy details such as owner, coverage amount, premium, duration, and status.
- **`PolicyStatus`**: Enum representing policy statuses: `Pending`, `Approved`, `Rejected`, `Claimed`.

#### **Key Functions:**
- **`createPolicy(uint256 _coverageAmount, uint256 _period)`**: Creates a new insurance policy for the caller.
- **`claimPolicy()`**: Allows the policyholder to claim their insurance payout if the policy is approved.
- **`cancelPolicy()`**: Cancels an active policy and marks it as `Rejected`.
- **`function getPolicy(address _user)`**: returns the policy of the current user
-  **` function getPremiumFee(uint256 coverageAmount_,uint256 period_ )`**: returns the funds the user will pay for an insurance 

---

### **4. StakingPool**
The `StakingPool` contract allows users to stake their ETH, earn rewards, and withdraw their funds. It integrates with **Aave's IPool** for yield and **WETH** to handle ETH deposits.

#### **Key Functions:**
- **`_stake()`**: Internal function that stakes ETH sent by the user and deposits it into the Aave pool.
- **`withdraw(uint256 amount)`**: Allows users to withdraw their staked ETH plus earned rewards.
- **`claimRewards()`**: Transfers accumulated rewards to the user’s account.
- **`pause()` / `unpause()`**: Admin-only functions to pause or resume the staking pool.
- **`emergencyWithdraw()`**: Withdraws all user funds in case of an emergency (admin-only).

---

## **Deployment and Usage**

### **1. Deploying Contracts**
1. **Manager**: Deploy this first to manage vault addresses.
2. **SecuredVault**: Deploy individual vaults for each user.
3. **InsuranceManager**: Deploy and link it with the `Manager` contract.
4. **StakingPool**: Deploy with Aave Pool and WETH addresses.

```bash
# Example Deployment (using Hardhat)
npx hardhat run scripts/deploy.js --network goerli
```

### **2. Interactions**
- **Staking ETH**:
    - Send ETH directly to the `StakingPool` contract’s address.
    - Example: `receive()` or `fallback()` functions trigger staking automatically.

- **Creating an Insurance Policy**:
    - Call `createPolicy()` with desired coverage and period.
    - Example: 
      ```solidity
      insuranceManager.createPolicy(100 ether, 30);
      ```

- **Claiming Insurance**:
    - Call `claimPolicy()` after the policy is approved by the manager.
    - Example:
      ```solidity
      insuranceManager.claimPolicy();
      ```

- **Managing Vaults**:
    - Set a vault address for a user in `Manager`.
    - Example:
      ```solidity
      manager.setVaultAddress(userAddress, vaultAddress);
      ```

---

## **Example Workflows**

### **Staking Workflow:**
1. User sends ETH to `StakingPool`.
2. `StakingPool` converts ETH to WETH and deposits it into Aave.
3. User earns rewards and can withdraw both principal and rewards.

### **Insurance Policy Workflow:**
1. User creates a policy via `InsuranceManager`.
2. If no hacks are detected by `SecuredVault`, the policy is approved.
3. User claims the payout if a valid policy exists and no security issues occur.

---
