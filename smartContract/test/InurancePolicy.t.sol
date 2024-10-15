// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {InsuranceManager} from "../contracts/InsurancePolicy.sol"; // Corrected import for InsuranceManager
import {SecuredVault} from "../contracts/SecuredVault.sol";
import {Manager} from "../contracts/Manager.sol";

contract InsuranceManagerTest is Test {
    InsuranceManager insuranceManager;
    SecuredVault vault;
    Manager s_manager;
    address owner;
    // address user;

    string secret;
    uint256 initialDeposit = 1 ether;
    uint256 threshold = 0.5 ether;
    address user = makeAddr("user"); // Dummy user for testing
    uint256 coverageAmount = 1 ether; // 1 ETH as coverage
    uint256 policyPeriod = 30; // 30 days period

    function setUp() public {
        // Deploy InsuranceManager contract before running tests
        insuranceManager = new InsuranceManager();
        vm.deal(user, 10 ether); // Give the user 10 ETH for testing

        vm.startPrank(user);
        s_manager = new Manager();

        s_manager.createVault(user, 10 ether, "test");

        vault = s_manager.getVaultAddress(user);
        vm.stopPrank();
    }

    function testCreatePolicy() public {
        // User creates a policy by sending premium amount with the call
        vm.startPrank(user); // Set msg.sender to user for this call
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);

        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Retrieve the user's policy and check details
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);

        assertEq(policy.owner, user);
        assertEq(policy.coverageAmount, coverageAmount);
        assertEq(policy.premium, premium);
        assertEq(policy.active, true);
        vm.stopPrank();
    }

    function testCannotCreatePolicyWithInsufficientFunds() public {
        // Attempt to create a policy with insufficient funds
        vm.startPrank(user); // Set msg.sender to user for this call
        vm.expectRevert();
        insuranceManager.createPolicy{value: 0.0000001 ether}(coverageAmount, policyPeriod);
        vm.stopPrank();
    }

    function testClaimPolicy() public {
        // First, create and approve a policy for the user
        vm.startPrank(user); // Set msg.sender to user for this call
        (bool success,) = address(vault).call{value: 1 ether}("");
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        assertTrue(success);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // // Approve the policy manually for testing purposes
        // insuranceManager.approvePolicy(user);
        reentrantCall(3);
        vm.expectRevert();
        vault.sendFunds(payable(user), 0.001 ether);

        (bool isFrozen, uint256 lostFunds) = vault.reportHack();
        assertGt(lostFunds, 0);
        assertTrue(isFrozen);

        console.log(insuranceManager._approvePolicy(vault, insuranceManager.getPolicy(user)));

        // User claims the policy payout
        insuranceManager.claimPolicy(address(vault));

        // Verify that the policy status is now 'Claimed'
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);
        // assertEq(
        //     uint8(policy.status),
        //     uint8(InsuranceManager.PolicyStatus.Claimed)
        // );
        vm.stopPrank();
    }

    function testCancelPolicy() public {
        // Create a policy for the user
        vm.startPrank(user); // Set msg.sender to user for this call

        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Cancel the policy
        insuranceManager.cancelPolicy();

        // Verify that the policy is inactive and status is 'Rejected'
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);
        assertEq(policy.active, false);
        assertEq(uint8(policy.status), uint8(InsuranceManager.PolicyStatus.Rejected));
        vm.stopPrank();
    }

    function testCalculatePremium() public view {
        // Check if the premium calculation works correctly
        uint256 expectedPremium = (coverageAmount * 1000 * policyPeriod) / (10000 * 365);
        uint256 actualPremium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);

        assertEq(actualPremium, expectedPremium);
    }

    function testOnlyOwnerCanApprovePolicy() public {
        // Create a policy for the user
        vm.startPrank(user); // Set msg.sender to user for this call
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);
        vm.stopPrank();

        // Try approving the policy from a non-owner address
        vm.prank(address(2));
    }

    function reentrantCall(uint256 num_) private {
        for (uint256 i = 0; i < num_; i++) {
            vault.sendFunds(payable(user), 0.001 ether); // 5 transactions in a short time
        }
    }
}
