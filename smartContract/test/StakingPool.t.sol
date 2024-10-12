// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../contracts/StakingPool.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";

contract StakingPoolTest is Test {
    StakingPool stakingPool;
    IPool pool;
    IWETH weth;

    address constant POOL_ADDRESS = 0xbE781D7Bdf469f3d94a62Cdcc407aCe106AEcA74;
    address constant WETH_ADDRESS = 0xEB590e5A96CD0E943A0899412E4fB06e0B362a7f;

    address user1 = address(1);
    address admin = address(this);

    function setUp() public {
        // Deploy the StakingPool contract
        stakingPool = new StakingPool(POOL_ADDRESS, WETH_ADDRESS);

        // Assign admin roles
        stakingPool.grantRole(stakingPool.ADMIN_ROLE(), admin);
        stakingPool.grantRole(stakingPool.PAUSER_ROLE(), admin);

        // Fund the test contract with ETH for staking tests
        vm.deal(user1, 10 ether);
    }

    function testStake() public {
        // Stake 1 ETH from user1
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // Check user1's stake amount and totalStaked
        (uint256 amount,,) = stakingPool.userStakes(user1);
        assertEq(amount, 1 ether);
        assertEq(stakingPool.totalStaked(), 1 ether);
    }

    function testWithdraw() public {
        // User1 stakes 1 ETH
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // User1 withdraws 1 ETH
        vm.prank(user1);
        stakingPool.withdraw(1 ether);

        // Check user1's stake amount and contract's ETH balance
        (uint256 amount,,) = stakingPool.userStakes(user1);
        assertEq(amount, 0);
        assertEq(address(stakingPool).balance, 0);
    }

    function testClaimRewards() public {
        // Stake 1 ETH from user1
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // Simulate time passing
        vm.warp(block.timestamp + 1 days);

        // Claim rewards
        vm.prank(user1);
        stakingPool.claimRewards();

        // Check if rewards were claimed
        (, uint256 reward,) = stakingPool.userStakes(user1);
        assertGt(reward, 0);
    }

    function testPauseAndUnpause() public {
        // Pause the contract
        stakingPool.pause();
        assertTrue(stakingPool.paused());

        // Try to stake while paused (should revert)
        vm.expectRevert("Pausable: paused");
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // Unpause and try staking again
        stakingPool.unpause();
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // Check if staking was successful
        (uint256 amount,,) = stakingPool.userStakes(user1);
        assertEq(amount, 1 ether);
    }

    function testEmergencyWithdraw() public {
        // Stake 1 ETH from user1
        vm.prank(user1);
        stakingPool.stake{value: 1 ether}();

        // Call emergency withdraw
        stakingPool.emergencyWithdraw();

        // Check if contract balance is zero
        assertEq(address(stakingPool).balance, 0);
    }

    function testReentrancyProtection() public {
        // Deploy a malicious contract to test reentrancy
        ReentrancyAttack attack = new ReentrancyAttack(address(stakingPool));

        // Expect the attack to fail due to ReentrancyGuard
        vm.expectRevert("ReentrancyGuard: reentrant call");
        attack.attack{value: 1 ether}();
    }
}

// Reentrancy Attack Contract for testing
contract ReentrancyAttack {
    StakingPool public stakingPool;

    constructor(address _stakingPool) {
        stakingPool = StakingPool(_stakingPool);
    }

    // Attack function
    function attack() public payable {
        stakingPool.stake{value: 1 ether}();
        stakingPool.withdraw(1 ether);
    }

    // Fallback to receive ETH
    receive() external payable {}
}
