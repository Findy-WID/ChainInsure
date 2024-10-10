// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {SecuredVault} from "../contracts/SecuredVault.sol";

contract SecuredVaultTest is Test {
    SecuredVault public s_SecuredVault;

    address owner = makeAddr("owner");
    address user = makeAddr("user");

    uint256 constant INITIAL_FUNDS = 21 ether;

    // modifier fundSecuredVault(){
    //     _;
    // }

    function setUp() public {
        // deploy the contact with owner address and set transaction threshold
        vm.startPrank(owner);
        s_SecuredVault = new SecuredVault(owner, 10 ether, "test");

        // Fund SecuredVault with some initial
        deal(owner, INITIAL_FUNDS);
        (bool success,) = payable(s_SecuredVault).call{value: INITIAL_FUNDS}("");
        if (success) {}
        vm.stopPrank();
    }

    function testSecuredVaultBalance() public view {
        console.log(address(s_SecuredVault).balance);
    }

    // function testSendFunds() public {
    //     s_SecuredVault.sendFunds()
    // }

    // Test: Only the owner cand send fund
    function testOnlyOwnerCanSendFunds() public {
        // Revert other user tries to send funds
        vm.startPrank(user);
        vm.expectRevert();
        bool isSuccessful = s_SecuredVault.sendFunds(payable(user), 1 ether);
        vm.stopPrank();

        // Allow owner to send funds
        vm.startPrank(owner);
        s_SecuredVault.sendFunds(payable(user), 1 ether);
        assertEq(address(user).balance, 1 ether);

        for (uint256 i; i < 5; i++) {
            isSuccessful = s_SecuredVault.sendFunds(payable(user), 1 ether);
        }

        // freeze account on the 6th transaction
        vm.expectRevert();
        isSuccessful = s_SecuredVault.sendFunds(payable(user), 1 ether);

        vm.stopPrank();

        // console.log(s_SecuredVault.getBalance());
    }

    // Test: Check if account gets frozen when threshod exceeded
    function testThresholdFreeze() public {
        vm.startPrank(owner);

        // send funds below the threshold
        bool isSuccessful = s_SecuredVault.sendFunds(payable(user), 9 ether);
        assertEq(address(user).balance, 9 ether);
        assertTrue(isSuccessful);


        // send funds above the threshold
        // vm.expectRevert();
        isSuccessful = s_SecuredVault.sendFunds(payable(user), 12 ether);
        console.log(isSuccessful);

        // Frozen confirmation
        // Attention needed
        bool isFrozen = s_SecuredVault.getAccountStatus();
        // console.log(isFrozen);
        assertTrue(isFrozen);
        vm.stopPrank();
    }

    // Test: Unfreezing account with correct secret
    function testUnfreezeAccount() public {
        vm.startPrank(owner);
        bool isSuccessful;

        // send fund to trigger freeze
        isSuccessful = s_SecuredVault.sendFunds(payable(user), 12 ether);
        bool isFrozen = s_SecuredVault.getAccountStatus();
        assertFalse(isSuccessful);
        assertTrue(isFrozen);

        // sund fund should fail when account status is freeze
        vm.expectRevert();
        isSuccessful = s_SecuredVault.sendFunds(payable(user), 12 ether);

        // unfreeze with wrong secrets
        vm.expectRevert();
        s_SecuredVault.unfreezeAccount("somethingelse");

        // unfreeze with correct secrets
        s_SecuredVault.unfreezeAccount("test");
        assertFalse(s_SecuredVault.getAccountStatus());

        vm.stopPrank();
    }

    // Test: Monitor suspicious behaviour
    function testSuspiciousBehaviourDetection() public {
        vm.startPrank(owner);
        bool isSuccessful;

        // Trigger multiple small transaction in a short period
        for (uint256 i = 0; i < 6; i++) {
            isSuccessful = s_SecuredVault.sendFunds(payable(user), 1 ether);
        }

        // Expect to be frozen many attempt in short period of time
        bool isFrozen = s_SecuredVault.getAccountStatus();
        assertTrue(isFrozen);
    }

    // Test: Secret hashes
    function testSecretHash() public {
        vm.startPrank(owner);
        // s_SecuredVault.setSecret()
        assertTrue(s_SecuredVault.isHashedMatch("test"));
        assertFalse(s_SecuredVault.isHashedMatch("something else"));
        s_SecuredVault.setSecret("mySecret");
        assertTrue(s_SecuredVault.isHashedMatch("mySecret"));
        assertFalse(s_SecuredVault.isHashedMatch("something else"));

        vm.stopPrank();
    }

    function testThreshold() public{
        vm.startPrank(owner);
        assert(s_SecuredVault.getThreshold() == 10 ether);
        assert(s_SecuredVault.getThreshold() != 12 ether);
        s_SecuredVault.setThreshold(12 ether);
        assert(s_SecuredVault.getThreshold() == 12 ether);
        assert(s_SecuredVault.getThreshold() != 10 ether);
        vm.stopPrank();
    }
}
