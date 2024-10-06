// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

contract LiquidityPool {
    mapping (address => uint256) public stakedAmounts;
    mapping(address => uint256) public stakingStartTime;
    mapping(address => uint256) public rewardDebt;
   
    uint256 private totalLiquidity;
    uint256 public rewardRate; // APY percentage as a decimal, e.g., 5% = 500 for 5% APY
    uint256 public constant BASE = 10000; // To calculate percentages (500 means 5% APY)

    uint256 public lastRewardTime;
    uint256 public accRewardPerShare; // Accumulated reward per staked token

    // Errors
    error StakeLiquidity_StakeMostBeGreaterThan0();
    error StakeLiquidity_InsufficientLiquidity();
    error StakeLiquidity_PaymentFail();
    error StakeLiquidity_InsufficientPremiumPayment();
    error StakeLiquidity_InsufficientStakedAmount();


    event LiquidityAdded(address indexed provider, uint256 amount);
    event LiquidityRemoved(address indexed provider, uint256 amount);
    event PayoutMade(address indexed user, uint256 amount, bool success);
    event PremiumCollected(address indexed user, uint256 premium);
    event RewardsClaimed(address indexed user, uint256 reward, bool success);

    constructor(uint256 _rewardRate){
        rewardRate = _rewardRate;
        lastRewardTime = block.timestamp;
    }

    modifier updateRewards() {
        if(totalLiquidity > 0){
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 rewards = (timeElapsed * rewardRate * totalLiquidity) / (BASE * 365 days);
            accRewardPerShare += (rewards * 1e28) / totalLiquidity;
        }

        lastRewardTime = block.timestamp;

        _;
    }
    function stakeLiquidity() external payable {
        if (msg.value < 0) {
            revert StakeLiquidity_StakeMostBeGreaterThan0();
        }

        uint256 pendingReward = calculateRewards(msg.sender);

        if(pendingReward > 0){
            lowLevelTransfar(msg.sender, pendingReward);
            emit RewardsClaimed(msg.sender, pendingReward, true);
        }

        stakedAmounts[msg.sender] += msg.value;
        stakingStartTime[msg.sender] = block.timestamp;
        rewardDebt[msg.sender] = (stakedAmounts[msg.sender] * accRewardPerShare)/1e18;
        totalLiquidity += msg.value;


        emit LiquidityAdded(msg.sender, msg.value);
    }

    function removeLiquidity(uint256 _amount) public updateRewards{
        if (stakedAmounts[msg.sender] <= _amount){
            revert StakeLiquidity_InsufficientStakedAmount();
        }

        // Claim before updating
        uint256 pendingReward = calculateRewards(msg.sender);

        if(pendingReward > 0){
            lowLevelTransfar(msg.sender, pendingReward);
            emit RewardsClaimed(msg.sender, pendingReward, true);
        }

        // update stkaing
        stakedAmounts[msg.sender] -= _amount;
        totalLiquidity -= _amount;
        rewardDebt[msg.sender] = (stakedAmounts[msg.sender] * accRewardPerShare) / 1e18;

        // Refund staked funds to user
        lowLevelTransfar(msg.sender, _amount);    

        emit LiquidityRemoved(msg.sender, _amount);

    }

    function payout(address _user, uint256 _amount) external {
        if (totalLiquidity <= _amount){
            revert StakeLiquidity_InsufficientLiquidity();
        }
        totalLiquidity -= _amount;

        // send fund to user
        lowLevelTransfar(_user, _amount);      
    }

    function collectPremium(address _user, uint256 _premium) external payable{
        if(msg.value <= _premium){
            revert StakeLiquidity_InsufficientPremiumPayment();
        }

        totalLiquidity += _premium;
        emit PremiumCollected(_user, _premium);
    }

    function calculateRewards(address _user) private view returns (uint256){
        uint256 pendingReward = ((stakedAmounts[_user] * accRewardPerShare)/1e18) - rewardDebt[_user];
        return pendingReward;
    }

    function lowLevelTransfar(address _to, uint256 _amount) private {

        (bool success, ) = payable(_to).call{value: _amount}("");

        emit PayoutMade(_to, _amount, success);

        if (!success){
            revert StakeLiquidity_PaymentFail();
        }
    }

    function claimRewards() external updateRewards{
        uint256 pendingReward = calculateRewards(msg.sender);
        if(pendingReward > 0){
            lowLevelTransfar(msg.sender, pendingReward);
            emit RewardsClaimed(msg.sender, pendingReward, true);
            rewardDebt[msg.sender] = (stakedAmounts[msg.sender] * accRewardPerShare) / 1e18;
        }
    }

    function getStackAmount(address _user) public view returns (uint256) {
        return stakedAmounts[_user];
    }
    
    function getTotalLiquidity() public view returns (uint256){
        return totalLiquidity;
    }

}