// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// import {LiquidityPool} from "./LiquidityPool.sol";
// import {ClaimsHandler} from "./ClaimsHandler.sol";
import {YieldManager} from "./YieldManager.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SecuredVault} from "./SecuredVault.sol";
import {Manager} from "./Manager.sol";
contract InsuranceManager {

    enum PolicyStatus {
        Pending,
        Approved,
        Rejected,
        Claimed
    }
    struct Policy {
        uint256 id;
        address owner;
        uint256 coverageAmount;
        uint256 premium;
        uint256 period;
        uint256 startTime;
        bool active;
        PolicyStatus status;
    }
    uint256 public constant MIN_VALUE = 1e18; // assume 18 token decimals, ie $1
    uint256 public constant MAX_VALUE = 1e24; // assume 18 token decimals, ie $1M
    uint256 public nextPolicyId;
    Manager internal manager;
    address internal owner;
    
    // mapping(address => Policy) public policies;
    Policy[] public policies;
    mapping(address => Policy) public currentUserPolicy;

    YieldManager public yielManager;
    IERC20 public paymentToken;
    // uint256 public nextPolicyId;
    
    event PolicyCreated(address indexed user, uint256 insuredAmount, uint256 premium, uint256 coverageAmount);
    event PolicyReviewed(uint256 indexed policyId, PolicyStatus status);
    event PolicyCancelled(address indexed user);
    event PolicyActivated(uint256 indexed policyId);
    event PolicyClaimed(uint256 indexed policyId);


    error InsurancePolicy_OnlyPolicyOnwerIsAllowed();
    error InsurancePolicy_ExistingPolicyIsActive();
    error InsurancePolicy_NoActivePolicy();
    error InsurancePolicy_InvalidValue(uint256 value);
    // error InsurancePolicy_InvalidCarDetails(bytes32 carDetails);
    // error InsurancePolicy_InvalidAdjuster(address adjuster);
    error InsurancePolicy_InvalidPolicyStatus();
    error InsurancePolicy_NotInitialized();
    error InsurancePolicy_NotApproved();
    error InsurancePolicy_InvalidPolicy(address applicant);
    error InsurancePolicy_InvalidClaimant(address claimant);
    error InsurancePolicy_InsufficientFunds();

    modifier onlyPolicyOwner() {
        if (msg.sender != currentUserPolicy[msg.sender].owner) {
            revert InsurancePolicy_OnlyPolicyOnwerIsAllowed();
        }
        _;
    }

    constructor(address paymentTokenAddress_, address poolAddress_) {
        yielManager = new YieldManager(
            address(this), poolAddress_, paymentTokenAddress_ 
        );

        paymentToken = IERC20(paymentTokenAddress_);
        owner = msg.sender;
    }


    function createPolicy(uint256 _coverageAmount, uint256 _premium, uint256 _period) external returns (uint256){
        
        uint256 _nextPolicy = nextPolicyId;

        if(_coverageAmount < MIN_VALUE || _coverageAmount > MAX_VALUE){
            revert InsurancePolicy_InvalidValue(_coverageAmount);
        }
        if (currentUserPolicy[msg.sender].active) {
            revert InsurancePolicy_ExistingPolicyIsActive();
        }



        Policy memory newPolicy = Policy({
            id: nextPolicyId,
            owner: msg.sender,
            coverageAmount: _coverageAmount,
            premium: _premium,
            period: (block.timestamp + (_period * 24 hours)),
            startTime: block.timestamp,
            active: true,
            status: PolicyStatus.Pending
        });
        currentUserPolicy[msg.sender] = newPolicy;
        policies.push(newPolicy);
        emit PolicyCreated(msg.sender, _coverageAmount, _premium, _coverageAmount);
        nextPolicyId++;
        // policies[msg.sender] = newPolicy;

        // liquidityPool.collectPremium(msg.sender, _premium);
        return _nextPolicy;

    }

    function claimPolicy() external onlyPolicyOwner{
        
        SecuredVault securedVault = SecuredVault(manager.getVaultAddress(msg.sender));
        Policy memory policy_ = currentUserPolicy[msg.sender];

        if(policy_.status != PolicyStatus.Approved){
            revert InsurancePolicy_NotApproved();
        }

        payable(msg.sender).transfer(securedVault.getBalance());
    }

    function cancelPolicy() external onlyPolicyOwner {
        if (!currentUserPolicy[msg.sender].active) {
            revert InsurancePolicy_NoActivePolicy();
        }

        currentUserPolicy[msg.sender].active = false;
        emit PolicyCancelled(msg.sender);
    }

    function checkPolicyValidity(address _user) public view returns (bool) {
        Policy memory policy = currentUserPolicy[_user];
        return policy.active && (block.timestamp <= policy.startTime + policy.period);
    }

    function getPolicy(address _user) public view returns (Policy memory) {
        return currentUserPolicy[_user];
    }

    function checkPolicyApproval(address _manager) internal view returns(bool){
        Manager manager_ = Manager(_manager);
        SecuredVault securedVault = SecuredVault(manager_.getVaultAddress(msg.sender));
        if (securedVault.getAccountStatus()){
            return true;
        }
        return false;
    }

    function setManager(Manager _manager) public {

    }

    function calculateDuration(uint256 coverageAmount_, uint256 risk_) internal pure returns(uint256){
        // Base premium is 1% of the value
        uint256 basePercentageInBIPs = 100;

        // Additional premium is up to 2% of the value based on risk
        uint256 additionalPercentageInBIPs = (200 * risk_) / 100; // Max 400 when risk is 100

        uint256 totalPercentage = basePercentageInBIPs + additionalPercentageInBIPs;
        uint256 premium = (coverageAmount_ * totalPercentage) / 10000; // Dividing by 10000 to account for percentage calculation

        return premium;
    }
}
