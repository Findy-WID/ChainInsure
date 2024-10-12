// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// ------------------------
// Imports
// ------------------------
import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

// ------------------------
// Interfaces for Aave & WETH
// ------------------------
interface IWETH {
    function deposit() external payable;
    function withdraw(uint256 amount) external;
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}

// ------------------------
// Staking Pool Contract
// ------------------------
contract StakingPool is AccessControlEnumerable, Pausable, ReentrancyGuard {
    // ------------------------
    // Constants & State Variables
    // ------------------------
    bytes32 public ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public PAUSER_ROLE = keccak256("PAUSER_ROLE");

    IPool internal pool;
    IWETH internal weth;

    uint256 public totalStaked;
    uint256 public rewardRate; // Reward per second per ETH
    uint256 public lastRewardTime;
    address private owner;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    mapping(address => Stake) private userStakes;

    // ------------------------
    // Events
    // ------------------------
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 reward, uint256 timestamp);
    event EthReceived(address account);
    event EmergencyWithdrawal(address admin, uint256 amount, uint256 timestamp);
    event RewardRateUpdated(uint256 newRate, address updatedBy);

    // ------------------------
    // Constructor
    // ------------------------
    constructor(address _pool, address _weth) {
        pool = IPool(_pool);
        weth = IWETH(_weth);
        owner = msg.sender;
    }

    // ------------------------
    // Public Functions
    // ------------------------

    function _stake() internal whenNotPaused nonReentrant {
        require(msg.value > 0, "StakingPool: Must send ETH to stake");

        _updateRewards(msg.sender);

        weth.deposit{value: msg.value}();
        weth.approve(address(pool), msg.value);
        pool.deposit(address(weth), msg.value, address(this), 0);

        userStakes[msg.sender].amount += msg.value;
        totalStaked += msg.value;
        userStakes[msg.sender].lastStakeTime = block.timestamp;

        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "StakingPool: Cannot withdraw zero amount");
        Stake storage user = userStakes[msg.sender];
        require(user.amount >= amount, "StakingPool: Insufficient balance");

        _updateRewards(msg.sender);

        user.amount -= amount;
        totalStaked -= amount;

        pool.withdraw(address(weth), amount, address(this));
        weth.withdraw(amount);
        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount, block.timestamp);
    }

    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);

        uint256 reward = userStakes[msg.sender].rewardDebt;
        require(reward > 0, "StakingPool: No rewards to claim");

        userStakes[msg.sender].rewardDebt = 0;
        payable(msg.sender).transfer(reward);

        emit RewardsClaimed(msg.sender, reward, block.timestamp);
    }

    // ------------------------
    // Admin Functions
    // ------------------------

    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit Paused(msg.sender);
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit Unpaused(msg.sender);
    }

    function emergencyWithdraw() external onlyRole(ADMIN_ROLE) {
        uint256 wethBalance = weth.balanceOf(address(this));
        pool.withdraw(address(weth), wethBalance, address(this));
        weth.withdraw(wethBalance);

        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);

        emit EmergencyWithdrawal(msg.sender, balance, block.timestamp);
    }

    function setRewardRate(uint256 _rate) external onlyRole(ADMIN_ROLE) {
        rewardRate = _rate;
        emit RewardRateUpdated(_rate, msg.sender);
    }

    // ------------------------
    // Internal Functions
    // ------------------------

    function _updateRewards(address user) internal {
        uint256 pendingReward = (block.timestamp - lastRewardTime) * rewardRate * userStakes[user].amount;
        userStakes[user].rewardDebt += pendingReward;
        lastRewardTime = block.timestamp;
    }

    // ------------------------
    // Receive & Fallback Functions
    // ------------------------

    receive() external payable {
        _stake();
    }

    fallback() external payable {
        _stake();
    }
}
