// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import {SecuredVault} from "../contracts/SecuredVault.sol";

contract SecuredVaultTest is Test {
    SecuredVault vault;
    address owner;
    address user;
    string secret;
    uint256 initialDeposit = 1 ether;
    uint256 threshold = 0.5 ether;
    
    function setUp() public {
        // Set up owner and user accounts
        owner = vm.addr(1);
        user = vm.addr(2);

        // Set up secret and deploy SecuredVault contract
        secret = "superSecret123";
        vault = new SecuredVault(owner, threshold, secret);

        // Label addresses for readability in logs
        vm.label(owner, "Owner");
        vm.label(user, "User");

        // Fund the vault with 1 ether
        // vm.deal(address(vault), initialDeposit);
        vm.deal(owner, initialDeposit);
    }

    function testOwnerCanSendFunds() public {
        // Deposit funds to vault
        _depositFunds();

        // Check initial balance of the vault
        uint256 vaultBalance = vault.getBalance();
        assertEq(vaultBalance, initialDeposit);

        // Owner sends 0.1 ether to user
        vm.startPrank(owner);
        bool success = vault.sendFunds(payable(user), 0.1 ether);
        vm.stopPrank();

        // Assert the transaction was successful
        assertTrue(success);

        // Check updated balances
        assertEq(vault.getBalance(), initialDeposit - 0.1 ether);
    }

    function testSendFundsExceedsThreshold() public {
        // Test that sending funds exceeding threshold freezes the account
        vm.startPrank(owner);
        vm.expectRevert();
        bool success = vault.sendFunds(payable(user), 0.6 ether);  // Above threshold
        assertFalse(success);
        vm.stopPrank();
    }

    function testFreezeAccountAfterSuspiciousActivity() public {
        // Deposit funds to vault
        _depositFunds();


        // Check initial balance of the vault
        uint256 vaultBalance = vault.getBalance();
        assertEq(vaultBalance, initialDeposit);

        // Test account freezing due to suspicious behavior (too many transactions in short time)
        vm.startPrank(owner);
        reentrantCall();

        // Account should be frozen after suspicious behavior
        bool isFrozen = vault.getAccountStatus();
        assertTrue(isFrozen);

        // Try sending funds again (should revert due to frozen account)
        vm.expectRevert();
        vault.sendFunds(payable(user), 0.01 ether);
        vm.stopPrank();
    }

    function testUnfreezeAccountWithSecret() public {
        // Freeze the account manually for testing
        vm.startPrank(owner);
        _depositFunds();


        bool success = vault.sendFunds(payable(user), 0.6 ether);  // Trigger threshold limit freeze
        assertFalse(success);
        assertTrue(vault.getAccountStatus());

        // Unfreeze the account with the correct secret
        vault.pauseContract();
        vault.unfreezeAccount(secret);

        // Ensure the account is no longer frozen
        assertFalse(vault.getAccountStatus());
        vm.stopPrank();
    }

    function testUnfreezeAccountWithInvalidSecret() public {
        // Freeze the account manually for testing
        vm.startPrank(owner);

         // Deposit funds to vault
        _depositFunds();


        vault.sendFunds(payable(user), 0.6 ether);  // Trigger threshold limit freeze
        assertTrue(vault.getAccountStatus());

        // Try to unfreeze with an incorrect secret (should fail)
        vm.expectRevert();
        vault.unfreezeAccount("wrongSecret");

        // Ensure the account remains frozen
        assertTrue(vault.getAccountStatus());
        vm.stopPrank();
    }

    function testPauseContract() public {

        // Test that pausing the contract stops transactions
        vm.startPrank(owner);

        // Deposit funds to vault
        _depositFunds();

        // Pause the contract
        vault.pauseContract();

        // Try sending funds (should revert due to pause)
        vm.expectRevert();
        vault.sendFunds(payable(user), 0.1 ether);
        vm.stopPrank();
    }

    function testWithdrawAfterHackReport() public {
        // Test that after reporting a hack, the account is frozen
        vm.startPrank(owner);

        // Deposit funds to vault
        _depositFunds();

        reentrantCall();
        

        // Report a hack
        (bool isFrozen, uint256 lostFunds) = vault.reportHack();
        assertTrue(isFrozen);
        assert(lostFunds < initialDeposit);

        // Try sending funds (should revert due to frozen account)
        vm.expectRevert();
        vault.sendFunds(payable(user), 0.1 ether);

        vm.stopPrank();
    }

    function testReceiveEther() public {
        // Simulate receiving Ether
        // vm.deal(address(vault), 1 ether);
        _depositFunds();

        (bool success, ) = address(vault).call{value: 0.5 ether}("");
        assertTrue(success);

        // Check the updated balance
        assertEq(vault.getBalance(), initialDeposit + 0.5 ether);
    }

    function _depositFunds() private{
         (bool success, ) = address(vault).call{value: initialDeposit}("");
        assertTrue(success);
    }

    function reentrantCall() private {
        for (uint256 i = 0; i < 3; i++) {
            vault.sendFunds(payable(user), 0.01 ether);  // 5 transactions in a short time
        }
    }
}
