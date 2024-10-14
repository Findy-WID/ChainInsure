// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {InsuranceManager} from "../contracts/InsurancePolicy.sol"; // Corrected import for InsuranceManager

contract InsuranceManagerTest is Test {
    InsuranceManager insuranceManager;

    address user = makeAddr("user");   // Dummy user for testing
    uint256 coverageAmount = 1 ether; // 1 ETH as coverage
    uint256 policyPeriod = 30;   // 30 days period

    function setUp() public {
        // Deploy InsuranceManager contract before running tests
        insuranceManager = new InsuranceManager();
        vm.deal(user, 10 ether); // Give the user 10 ETH for testing
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
        uint256 premium = insuranceManager.getPremiumFee(coverageAmount, policyPeriod);
        insuranceManager.createPolicy{value: premium}(coverageAmount, policyPeriod);

        // // Approve the policy manually for testing purposes
        // insuranceManager.approvePolicy(user);

        // User claims the policy payout
        insuranceManager.claimPolicy();

        // Verify that the policy status is now 'Claimed'
        InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);
        assertEq(uint8(policy.status), uint8(InsuranceManager.PolicyStatus.Claimed));
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
        vm.expectRevert("InsurancePolicy_OnlyPolicyOwnerIsAllowed()");
        insuranceManager.approvePolicy(user);
    }
}
