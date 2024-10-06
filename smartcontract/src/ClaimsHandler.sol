// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;
import {Oracle} from "./Oracle.sol";
import {LiquidityPool} from "./LiquidityPool.sol";
import {InsurancePolicy} from "./InsurancePolicy.sol";
contract ClaimsHandler {

    error ClaimsHandler_ClaimedAlready();
    error ClaimsHandler_InvalidOrExpiredPolicy();
    error ClaimsHandler_EvenConditionNotMet();


    Oracle private oracle;
    LiquidityPool private liquidityPool;
    InsurancePolicy private insurancePolicy;

    mapping (address => bool) public hasClaimed;

    event ClaimProcessed (address indexed user, uint256 payoutAmount);
    constructor(address _oracle, address _liquidityPool, address _insurancePolicy) {
        oracle = Oracle(_oracle);
        liquidityPool = LiquidityPool(_liquidityPool);
        insurancePolicy = InsurancePolicy(_insurancePolicy);
    }

    function processClaim(address _user) public {
        if(hasClaimed[_user]){
            revert ClaimsHandler_ClaimedAlready();
        }

        if(!insurancePolicy.checkPolicyValidity(_user)){
            revert ClaimsHandler_InvalidOrExpiredPolicy();
        }

        uint256 coverageAmount = insurancePolicy.getPolicy(_user).coverageAmount;
        bool validEvent = oracle.checkForEvent(_user);

        if(!validEvent){
            revert ClaimsHandler_EvenConditionNotMet();
        }

        liquidityPool.payout(_user, coverageAmount);
        hasClaimed[_user] = true;

        emit ClaimProcessed(_user, coverageAmount);
    }
}