
# CHAIN INSURE

**CHAIN INSURE** is a Solidity-based insurance contract designed to secure digital assets stored in Ethereum wallets by monitoring for unusual or malicious activity. The system automatically freezes the insured account if suspicious behavior is detected, such as multiple transactions in a short time span or funds exceeding a threshold. It offers an added layer of protection with a secret-based unfreezing mechanism.

The project is built using Solidity, OpenZeppelin security modules, and the Aave protocol for yield management.

## Features

- **Secure Fund Management**: Transfers can only be initiated by the contract owner.
- **Suspicious Behavior Detection**: Monitors transaction patterns to detect unusual activity and freezes the account when detected.
- **Threshold-based Security**: Automatically freezes accounts if funds transferred exceed a certain threshold.
- **Hack Reporting**: Enables users to report hacks, which immediately freezes the account and locks the funds.
- **Secret-based Account Unfreezing**: The owner can unfreeze an account using a predefined secret.
- **Yield Management**: Deposits user funds into Aave to generate yield and allows withdrawals of interest-bearing tokens.
- **Pausable and Non-reentrant**: Implements OpenZeppelin's `Pausable` and `ReentrancyGuard` for added security.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contract Overview](#contract-overview)
- [Tests](#tests)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

To run the CHAIN INSURE project locally, you'll need to set up a development environment using [Foundry](https://github.com/foundry-rs/foundry) or another Solidity tool of your choice. Here's how to get started:

### Prerequisites

- [Foundry](https://github.com/foundry-rs/foundry)
- [Node.js](https://nodejs.org/) (for JavaScript-based testing or scripts)
- [Aave](https://aave.com/) and [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Findy-WID/ChainInsure.git
   cd chain-insure
   ```

2. **Install Dependencies**:
   Install Foundry (if not already installed):
   ```bash
   foundryup
   ```

   You may also need to install dependencies like OpenZeppelin:
   ```bash
   npm install @openzeppelin/contracts
   ```

3. **Compile the contract**:
   Use Foundry to compile the smart contracts:
   ```bash
   forge build
   ```

---

## Usage

### Deploying the Contract

You can deploy the `SecuredVault` and `Manager` contracts to a test network like Goerli using tools like Hardhat or Remix.

Here's how to deploy using Foundry:

1. **Deploy the SecuredVault contract**:
   ```solidity
   vault = new SecuredVault(ownerAddress, thresholdValue, secretPhrase);
   ```

2. **Interacting with the contract**:
   - **Sending Funds**: As the owner, you can send funds to a specified address:
     ```solidity
     vault.sendFunds(payable(recipient), amount);
     ```

   - **Unfreeze Account**: To unfreeze the account, provide the correct secret:
     ```solidity
     vault.unfreezeAccount(secretPhrase);
     ```

   - **Get Account Status**: You can query whether the account is frozen:
     ```solidity
     vault.getAccountStatus();
     ```

   - **Report Hack**: If the account is hacked, report the hack:
     ```solidity
     vault.reportHack();
     ```

### Depositing Funds into Aave

The `YieldManager` contract allows you to deposit funds into Aave to earn interest:

```solidity
yieldManager.deposit(amount);
```

Withdraw the deposited funds along with the interest:

```solidity
yieldManager.withdraw(amount, recipient);
```

---

## Contract Overview

### `SecuredVault.sol`

This contract is the core component responsible for managing and securing user funds. It supports account freezing, secret-based unfreezing, and monitoring of suspicious behaviors.

#### Key Functions:
- `sendFunds(address payable _to, uint256 _amount)`: Allows the owner to send funds.
- `freezeAccount()`: Internal function to freeze the account when suspicious activity is detected.
- `unfreezeAccount(string memory _secret)`: Unfreezes the account using the correct secret.
- `monitorBehavior()`: Internal function that monitors suspicious behavior such as too many transactions in a short period.
- `reportHack()`: Allows users to manually report a hack.

### `Manager.sol`

The `Manager` contract allows the creation and management of multiple `SecuredVault` contracts, each tied to a specific owner.

### `YieldManager.sol`

This contract integrates with Aave to provide yield farming functionality, allowing users to deposit ERC-20 tokens and earn interest.

---

## Tests

Unit tests are written using the Foundry framework and are located in the `test` directory.

### Running Tests

To run the tests:
```bash
forge test
```

Tests include:

1. **Vault Creation**: Ensures the vault is created properly for a user.
2. **Transaction Threshold**: Tests account freezing when the transaction exceeds the threshold.
3. **Suspicious Activity Detection**: Verifies the account freezing due to suspicious behavior.
4. **Unfreeze with Secret**: Tests that an account can only be unfrozen with the correct secret.
5. **Yield Management**: Tests depositing and withdrawing from Aave.

---

## Security

This contract includes multiple layers of security:
- **ReentrancyGuard**: Protects against reentrancy attacks.
- **Pausable**: Can pause the contract in emergencies.
- **Thresholds and Monitoring**: Detects suspicious behavior and automatically freezes accounts.
- **Secret-Based Recovery**: A secret phrase is required to unfreeze the account, enhancing security after a hack.
  
A detailed audit is recommended before deploying this contract in a production environment.

---

## Contributing

We welcome contributions! Feel free to fork this repository and submit pull requests. Please ensure your code passes all tests and adheres to the project's coding standards.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

--- 

## Acknowledgments

Special thanks to the teams behind:
- [Aave](https://aave.com)
- [OpenZeppelin](https://openzeppelin.com)
- [Foundry](https://github.com/foundry-rs/foundry)
  
---

This README should provide a clear understanding of the CHAIN INSURE project, its features, and how to deploy, test, and secure it.