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
    function mint(address addr_, uint256 value_) external;
}

// ------------------------
// Staking Pool Contract
// ------------------------
contract StakingPool is Pausable, ReentrancyGuard {
    // ------------------------
    // Constants & State Variables
    // ------------------------

    IPool internal pool;
    IWETH internal weth;

    uint256 public totalStaked;
    uint256 public rewardRate = 31700 wei; // Reward per second per ETH
    uint256 public lastRewardTime;
    address private owner;
    address private manager;

    struct Stake {
        uint256 amount;
        uint256 rewardDebt;
        uint256 lastStakeTime;
    }

    mapping(address => Stake) public userStakes;

    // ------------------------
    // Events
    // ------------------------
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);
    event RewardsClaimed(address indexed user, uint256 reward, uint256 timestamp);
    event EthReceived(address account);
    event EmergencyWithdrawal(address admin, uint256 amount, uint256 timestamp);
    event RewardRateUpdated(uint256 newRate, address updatedBy);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner is permitted");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only owner is permitted");
        _;
    }
    // ------------------------
    // Constructor
    // ------------------------

    constructor(address _pool, address _weth) {
        pool = IPool(_pool);
        weth = IWETH(_weth);
        owner = msg.sender;
        // uint208 x = 100;

        // rewardRate = (x/10000) / (365 days * 24 hours * 60 minutes * 60 seconds);
    }

    // ------------------------
    // Public Functions
    // ------------------------

    function _stake() internal whenNotPaused nonReentrant {
        require(msg.value > 0, "StakingPool: Must send ETH to stake");

        _updateRewards(msg.sender);

        weth.deposit{value: msg.value}();
        weth.approve(address(pool), 10000 ether);
        pool.deposit(address(weth), msg.value, address(this), 0);

        userStakes[msg.sender].amount += msg.value;
        totalStaked += msg.value;
        userStakes[msg.sender].lastStakeTime = block.timestamp;

        emit Staked(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint256 amount) external  {
        require(amount > 0, "StakingPool: Cannot withdraw zero amount");
        Stake storage user = userStakes[msg.sender];
        require(user.amount >= amount, "StakingPool: Insufficient balance");

        _updateRewards(msg.sender);

        user.amount -= amount;
        totalStaked -= amount;

        pool.withdraw(address(weth), amount, address(this));
        weth.withdraw(amount);
        // (bool success, ) = payable(msg.sender).call{value: amount}("");
        // require(success, "Widthdrawal Failed");

        emit Withdrawn(msg.sender, amount, block.timestamp);
    }

    function claimRewards() external nonReentrant {
        _updateRewards(msg.sender);

        uint256 reward = userStakes[msg.sender].rewardDebt;

        require(reward > 0, "StakingPool: No rewards to claim");
        weth.mint(address(pool), reward);
        // pool.deposit(address(weth), reward, address(this), 0);
        userStakes[msg.sender].rewardDebt = 0;
        payable(msg.sender).transfer(reward);

        emit RewardsClaimed(msg.sender, reward, block.timestamp);
    }

    function getRewards() external returns (uint256) {
        _updateRewards(msg.sender);
        return userStakes[msg.sender].rewardDebt;
    }

    function getAmount() external returns (uint256) {
        _updateRewards(msg.sender);
        return userStakes[msg.sender].amount;
    }

    // ------------------------
    // Admin Functions
    // ------------------------

    function pause() external onlyOwner {
        _pause();
        emit Paused(msg.sender);
    }

    function unpause() external onlyOwner {
        _unpause();
        emit Unpaused(msg.sender);
    }

    // function emergencyWithdraw() external onlyOwner {
    //     uint256 wethBalance = weth.balanceOf(address(this));
    //     pool.withdraw(address(weth), wethBalance, address(this));
    //     weth.withdraw(wethBalance);

    //     uint256 balance = address(this).balance;
    //     payable(msg.sender).transfer(balance);

    //     emit EmergencyWithdrawal(msg.sender, balance, block.timestamp);
    // }

    function setRewardRate(uint256 _rate) external onlyOwner {
        rewardRate = _rate;
        emit RewardRateUpdated(_rate, msg.sender);
    }

    // ------------------------
    // Internal Functions
    // ------------------------

    function _updateRewards(address user) internal {
        uint256 elapsedTime = block.timestamp - lastRewardTime;
        uint256 annualRateBIPs = 100; // 1% in basis points (1% = 100 BIPs)
        uint256 secondsPerYear = 365 * 24 * 60 * 60; // 31,536,000 seconds in a year

        // Calculate pending rewards: (amount * 1% * elapsedTime) / secondsPerYear
        uint256 pendingReward = (userStakes[user].amount * annualRateBIPs * elapsedTime) / (secondsPerYear * 10000);

        // Update user's reward debt with the new pending reward
        userStakes[user].rewardDebt += pendingReward;

        // Update the last reward time to the current timestamp
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
