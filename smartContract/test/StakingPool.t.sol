// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {console, Test} from "forge-std/Test.sol";
import {StakingPool} from "../contracts/StakingPool.sol";
import {MockPool} from "../contracts/mocks/MockPool.sol";
import {WETH9} from "../contracts/mocks/SampleERC20.sol";

contract StakingPoolTest is Test {
    StakingPool stakingPool;
    MockPool mockPool;
    WETH9 mockToken;
    WETH9 mockAToken;

    // Mock users
    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    address owner;

    // Setup function
    function setUp() public {
        // owner
        vm.startPrank(owner);
        address[] memory tokens = new address[](1);
        address[] memory aTokens = new address[](1);

        mockToken = new WETH9();
        mockAToken = new WETH9();

        tokens[0] = address(mockToken);
        aTokens[0] = address(mockAToken);

        mockPool = new MockPool(tokens, aTokens);

        // Deploy StakingPool

        stakingPool = new StakingPool(address(mockPool), address(mockToken));

        vm.stopPrank();

        // Fund user accounts with ETH
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }

    // Test: Stake function
    function testStake() public {
        vm.startPrank(user1); // Simulate user1's actions

        // Stake 1 ETH
        (bool success,) = payable(stakingPool).call{value: 1 ether}("");
        assertTrue(success);

        // Check user1's staked amount and total staked in the contract
        (uint256 staked,,) = stakingPool.userStakes(user1);
        // console.log(staked, 1 ether);
        assertEq(staked, 1 ether);
        assertEq(stakingPool.totalStaked(), 1 ether);

        vm.stopPrank();

        vm.startPrank(user2); // Simulate user1's actions

        // Stake 1 ETH
        (success,) = payable(stakingPool).call{value: 1 ether}("");
        assertTrue(success);

        // Check user1's staked amount and total staked in the contract
        (staked,,) = stakingPool.userStakes(user2);
        // console.log(staked, 1 ether);
        assertEq(staked, 1 ether);
        assertEq(stakingPool.totalStaked(), 2 ether);

        vm.stopPrank();
    }

    // Test: Withdraw function
    function testWithdraw() public {
        vm.startPrank(user1);
        (bool success,) = payable(stakingPool).call{value: 2 ether}("");
        assertTrue(success);

        // Withdraw 1 ETH
        stakingPool.withdraw(1 ether);

        // Verify remaining balances
        (uint256 staked, , ) = stakingPool.userStakes(user1);
        // assertEq(staked, 1 ether);
        // assertEq(stakingPool.totalStaked(), 1 ether);

        // // Verify user1 balance is correct
        // assertEq(user1.balance, 9 ether); // 10 - 1 staked, 1 withdrawn

        vm.stopPrank();
    }

    // Test: Claim rewards
    function testClaimRewards() public {
        vm.startPrank(user1);
        (bool success,) = payable(stakingPool).call{value: 1 ether}("");
        assertTrue(success);
        vm.stopPrank();

        vm.startPrank(user2);
        (success,) = payable(stakingPool).call{value: 1 ether}("");
        assertTrue(success);

        // Simulate time passing to generate rewards
        skip(30 days);
        console.log(address(mockToken).balance);
        // Claim rewards
        assertGt(stakingPool.getRewards(), 0);
        stakingPool.claimRewards();
        // console.log(stakingPool._updateRewards(user2));

        // Verify rewards are reset
        (, uint256 rewardDebt, ) = stakingPool.userStakes(user2);
        assertEq(rewardDebt, 0);
        // assertGt(user2.balance, 9 ether); // User should earn some rewards
        // console.log(stakingPool.getAmount());
        vm.stopPrank();
    }

    // Test: Emergency withdrawal by owner
    // function testEmergencyWithdraw() public {
    //     vm.startPrank(user1);
    //     (bool success,) = payable(stakingPool).call{value: 1 ether}("");
    //     assertTrue(success);

    //     vm.stopPrank();
    //     // Perform emergency withdrawal as owner
    //     vm.startPrank(owner);
    //     stakingPool.emergencyWithdraw();

    //     // Ensure the contract balance is zero
    //     assertEq(address(stakingPool).balance, 0);
    // }

    // Test: Only owner can pause the contract
    function testPause() public {
        vm.startPrank(owner); // Owner context
        stakingPool.pause();

        assertTrue(stakingPool.paused()); // Verify the contract is paused
        vm.stopPrank();
    }

    // Test: Stake when paused (should revert)
    function testStakeWhenPaused() public {
        vm.startPrank(owner);
        stakingPool.pause(); // Pause the contract
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert("Pausable: paused");

        // Attempt to stake when paused
        (bool success,) = payable(stakingPool).call{value: 1 ether}("");
        assertFalse(success); // This should not be reached if the revert works

        vm.stopPrank();
    }
}
