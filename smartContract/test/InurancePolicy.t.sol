// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {InsuranceManager} from "../contracts/InsurancePolicy.sol"; // Corrected import for InsuranceManager

contract InsuranceManagerTest is Test {
    InsuranceManager insuranceManager;

    address user = address(1);   // Dummy user for testing
    uint256 coverageAmount = 1 ether; // 1 ETH as coverage
    uint256 policyPeriod = 30;   // 30 days period

    function setUp() public {
        // Deploy InsuranceManager contract before running tests
        insuranceManager = new InsuranceManager();
        vm.deal(user, 10 ether); // Give the user 10 ETH for testing
    }

    function testCreatePolicy() public {
        // User creates a policy by sending premium amount with the call
        vm.prank(user); // Set msg.sender to user for this call
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Retrieve the user's policy and check details
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);

        // assertEq(policy.owner, user);
        // assertEq(policy.coverageAmount, coverageAmount);
        // assertEq(policy.premium, premium);
        assertEq(policy.active, true);
    }

    function testCannotCreatePolicyWithInsufficientFunds() public {
        // Attempt to create a policy with insufficient funds
        vm.prank(user);
        vm.expectRevert("InsurancePolicy_InsufficientFunds(uint256)");

        insuranceManager.createPolicy{value: 0.5 ether}(coverageAmount, policyPeriod);
    }

    function testClaimPolicy() public {
        // First, create and approve a policy for the user
        vm.prank(user);
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Approve the policy manually for testing purposes
        insuranceManager.approvePolicy(user);

        // User claims the policy payout
        vm.prank(user);
        insuranceManager.claimPolicy();

        // Verify that the policy status is now 'Claimed'
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);
        assertEq(uint8(policy.status), uint8(InsuranceManager.PolicyStatus.Claimed));
    }

    function testCancelPolicy() public {
        // Create a policy for the user
        vm.prank(user);
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Cancel the policy
        vm.prank(user);
        insuranceManager.cancelPolicy();

        // Verify that the policy is inactive and status is 'Rejected'
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);
        assertEq(policy.active, false);
        assertEq(uint8(policy.status), uint8(InsuranceManager.PolicyStatus.Rejected));
    }

    function testCalculatePremium() public {
        // Check if the premium calculation works correctly
        uint256 expectedPremium = (coverageAmount * 1000 * policyPeriod) / (10000 * 365);
        uint256 actualPremium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);

        assertEq(actualPremium, expectedPremium);
    }

    function testOnlyOwnerCanApprovePolicy() public {
        // Create a policy for the user
        vm.prank(user);
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // Try approving the policy from a non-owner address
        vm.prank(address(2));
        vm.expectRevert("InsurancePolicy_OnlyPolicyOwnerIsAllowed()");
        insuranceManager.approvePolicy(user);
    }
}
