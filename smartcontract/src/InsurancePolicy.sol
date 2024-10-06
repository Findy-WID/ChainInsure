// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;
import {LiquidityPool} from "./LiquidityPool.sol";
import {ClaimsHandler} from "./ClaimsHandler.sol";
contract InsurancePolicy {

    error InsurancePolicy_OnlyPolicyOnwerIsAllowed();
    error InsurancePolicy_ExistingPolicyIsActive();
    error InsurancePolicy_NoActivePolicy();


    struct Policy {
        address owner;
        uint256 coverageAmount;
        uint256 premium;
        uint256 period;
        uint256 startTime;
        bool active;
    }

    mapping (address => Policy) public policies;
    LiquidityPool public liquidityPool;
    ClaimsHandler public claimsHandler;

    event PolicyCreated(address indexed user, uint256 insuredAmount, uint256 premium, uint256 coverageAmount);
    event PolicyCancelled(address indexed user);

    constructor(address _liquidityPool, address _claimsHandler) {
        liquidityPool = LiquidityPool(_liquidityPool);
        claimsHandler = ClaimsHandler(_claimsHandler);
    }
    
    modifier onlyPolicyOwner {
        if(msg.sender != policies[msg.sender].owner){
            revert InsurancePolicy_OnlyPolicyOnwerIsAllowed();
        }
        _;
    }

    function createPolicy(uint256 _coverageAmount, uint256 _premium, uint256 _period) external {
        if(policies[msg.sender].active){
            revert InsurancePolicy_ExistingPolicyIsActive();
        }

        policies[msg.sender]  = Policy({
            owner: msg.sender,
            coverageAmount: _coverageAmount,
            premium: _premium,
            period: (block.timestamp + (_period* 24 hours)),
            startTime: block.timestamp,
            active: true
        });

        // policies[msg.sender] = newPolicy;

        liquidityPool.collectPremium(msg.sender, _premium);

        emit PolicyCreated(msg.sender, _coverageAmount, _premium, _coverageAmount);
        
    }

    function cancelPolicy() external onlyPolicyOwner{
        if(!policies[msg.sender].active ){
            revert InsurancePolicy_NoActivePolicy();
        }

        policies[msg.sender].active = false;
        emit PolicyCancelled(msg.sender);
    }

    function checkPolicyValidity(address _user) public view returns(bool){
        Policy memory policy = policies[_user];
        return policy.active && (block.timestamp <= policy.startTime + policy.period);
    }

    function getPolicy(address _user) public view returns (Policy memory){
        return policies[_user];
    }
}