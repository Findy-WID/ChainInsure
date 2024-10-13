// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {YieldManager} from "./YieldManager.sol";
// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SecuredVault} from "./SecuredVault.sol";
import {Manager} from "./Manager.sol";

contract InsuranceManager {

    // Enum to represent different statuses a policy can have
    enum PolicyStatus {
        Pending,    // Policy is under review
        Approved,   // Policy is approved and active
        Rejected,   // Policy is rejected
        Claimed     // Policy has been claimed by the owner
    }

    // Structure representing an insurance policy
    struct Policy {
        uint256 id;                // Unique policy ID
        address owner;             // The policyholder
        uint256 coverageAmount;    // Amount the policy covers
        uint256 premium;           // Premium to be paid for the policy
        uint256 period;            // Policy duration in days
        uint256 startTime;         // Policy start time (Unix timestamp)
        bool active;               // Whether the policy is currently active
        PolicyStatus status;       // Current status of the policy
    }

    uint256 public constant MIN_VALUE = 1e18; // Minimum coverage amount ($1)
    uint256 public constant MAX_VALUE = 1e24; // Maximum coverage amount ($1M)
    uint256 public nextPolicyId;              // Counter to assign new policy IDs

    Manager internal manager;     // Instance of Manager contract to retrieve vault addresses
    address internal owner;       // Owner of the insurance contract (deployer)

    // Mapping from user address to their active policy
    mapping(address => Policy) public currentUserPolicy;

    YieldManager public yielManager;    // Instance of YieldManager for yield-bearing operations
    // IERC20 public paymentToken;         // Token used for policy payments (e.g., DAI, USDC, etc.)

    // Events to log important actions
    event PolicyCreated(address indexed user, uint256 insuredAmount, uint256 premium);
    event PolicyReviewed(uint256 indexed policyId, PolicyStatus status);
    event PolicyCancelled(address indexed user);
    event PolicyActivated(uint256 indexed policyId);
    event PolicyClaimed(uint256 indexed policyId);

    // Custom errors for various failures
    error InsurancePolicy_OnlyPolicyOwnerIsAllowed();
    error InsurancePolicy_ExistingPolicyIsActive();
    error InsurancePolicy_NoActivePolicy();
    error InsurancePolicy_InvalidValue(uint256 value);
    error InsurancePolicy_InvalidPolicyStatus();
    error InsurancePolicy_NotApproved();
    error InsurancePolicy_InsufficientFunds();
    error InsurancePolicy_HackDetected();

    // Modifier to restrict actions to the policy owner
    modifier onlyPolicyOwner() {
        if (msg.sender != currentUserPolicy[msg.sender].owner) {
            revert InsurancePolicy_OnlyPolicyOwnerIsAllowed();
        }
        _;
    }

    // Modifier to validate the policy owner for specific operations
    modifier validPolicyOwner(address _user) {
        if (msg.sender != currentUserPolicy[_user].owner) {
            revert InsurancePolicy_OnlyPolicyOwnerIsAllowed();
        }
        _;
    }

    constructor() {
        // address paymentTokenAddress_, address poolAddress_
        // yielManager = new YieldManager(
        //     address(this), poolAddress_, paymentTokenAddress_
        // );
        // paymentToken = IERC20(paymentTokenAddress_);
        owner = msg.sender; // The contract owner is the deployer
    }

    /**
     * @notice Create a new insurance policy for the caller
     * @param _coverageAmount Amount to be insured
     * @param _premium Premium to be paid for the policy
     * @param _period Duration of the policy in days
     * @return The ID of the created policy
     */
    function createPolicy(uint256 _coverageAmount, uint256 _premium, uint256 _period) payable external returns (uint256) {
        if (_coverageAmount < MIN_VALUE || _coverageAmount > MAX_VALUE) {
            revert InsurancePolicy_InvalidValue(_coverageAmount); // Ensure coverage is within valid limits
        }
        if (currentUserPolicy[msg.sender].active) {
            revert InsurancePolicy_ExistingPolicyIsActive(); // Only one active policy per user allowed
        }

        // Create a new policy for the user
        Policy memory newPolicy = Policy({
            id: nextPolicyId,
            owner: msg.sender,
            coverageAmount: _coverageAmount,
            premium: _premium,
            period: (_period * 1 days),    // Convert period to days
            startTime: block.timestamp,    // Start the policy immediately
            active: true,                  // Policy is active
            status: PolicyStatus.Pending   // Status is pending until reviewed
        });

        currentUserPolicy[msg.sender] = newPolicy; // Store the policy in the mapping
        nextPolicyId++; // Increment policy ID for the next policy

        emit PolicyCreated(msg.sender, _coverageAmount, _premium); // Emit event for new policy creation
        return newPolicy.id;
    }

    /**
     * @notice Claim the policy payout if approved
     * @dev The policy must be in `Approved` status for the claim to be processed
     */
    function claimPolicy() external onlyPolicyOwner {
        Policy memory policy_ = currentUserPolicy[msg.sender];

        if (policy_.status != PolicyStatus.Approved) {
            revert InsurancePolicy_NotApproved(); // Only approved policies can be claimed
        }

        SecuredVault securedVault = SecuredVault(manager.getVaultAddress(msg.sender));

        // Check if there are enough funds in the vault and withdraw them
        (bool success, ) = msg.sender.call{value: securedVault.getBalance()}("");
        if (!success) {
            revert InsurancePolicy_InsufficientFunds(); // Revert if withdrawal fails
        }

        policy_.status = PolicyStatus.Claimed; // Mark policy as claimed
        currentUserPolicy[msg.sender] = policy_; // Update policy in storage

        emit PolicyClaimed(policy_.id); // Emit event for claim
    }

    /**
     * @notice Cancel the active policy
     * @dev This sets the policy status to `Rejected` and deactivates it
     */
    function cancelPolicy() external onlyPolicyOwner {
        Policy storage policy_ = currentUserPolicy[msg.sender];

        if (!policy_.active) {
            revert InsurancePolicy_NoActivePolicy(); // No active policy to cancel
        }

        policy_.active = false; // Deactivate the policy
        policy_.status = PolicyStatus.Rejected; // Mark the policy as rejected

        emit PolicyCancelled(msg.sender); // Emit event for policy cancellation
    }

    /**
     * @notice Approve the policy after verifying no suspicious behavior or hack
     * @param _user The address of the policyholder to approve
     * @dev Integrates with the SecuredVault's `reportHack` function to check for hacks or account freezing
     */
    function approvePolicy(address _user) external validPolicyOwner(_user) {
        SecuredVault securedVault = SecuredVault(manager.getVaultAddress(_user));

        // Call `reportHack` from the SecuredVault contract to detect any hacks
        (bool isFrozen, uint256 fundsLost) = securedVault.reportHack();

        Policy storage policy_ = currentUserPolicy[_user];

        // If the account is frozen or funds were lost, reject the policy for security reasons
        if (isFrozen || fundsLost > 0) {
            revert InsurancePolicy_HackDetected(); // Revert if any suspicious activity was detected
        }

        // Otherwise, approve the policy
        policy_.status = PolicyStatus.Approved;
        emit PolicyReviewed(policy_.id, PolicyStatus.Approved); // Emit event for policy approval
    }

    /**
     * @notice Check if a policy is still valid based on time and activity
     * @param _user The address of the policyholder to check
     * @return `true` if the policy is valid, `false` otherwise
     */
    function checkPolicyValidity(address _user) public view returns (bool) {
        Policy memory policy = currentUserPolicy[_user];
        return policy.active && (block.timestamp <= policy.startTime + policy.period); // Check if policy is active and within the time frame
    }

    /**
     * @notice Retrieve the details of a specific policy
     * @param _user The address of the policyholder
     * @return The policy details
     */
    function getPolicy(address _user) public view returns (Policy memory) {
        return currentUserPolicy[_user]; // Return the policy for the given user
    }

    /**
     * @notice Set the Manager contract to be used for vault address resolution
     * @param _manager The address of the Manager contract
     */
    function setManager(Manager _manager) public {
        manager = _manager; // Set the manager contract instance
    }

    /**
     * @notice Internal utility function to calculate premium based on coverage and risk
     * @param coverageAmount_ The coverage amount of the policy
     */


    // Calculate premium based on coverage and risk
    function _calculatePremium(uint256 coverageAmount_, uint256 risk_) internal pure returns (uint256) {
        uint256 basePercentageInBIPs = 100;
        uint256 additionalPercentageInBIPs = (200 * risk_) / 100;
        uint256 totalPercentage = basePercentageInBIPs + additionalPercentageInBIPs;
        uint256 premium = (coverageAmount_ * totalPercentage) / 10000;
        return premium;
    }

    function  _vaultHackCheck(Policy memory policy_, SecuredVault securedVault) internal{
        
        (bool isFrozen, uint256 lostFunds) = securedVault.reportHack();

        if(!isFrozen && lostFunds == 0){
            policy_.status = PolicyStatus.Approved;
        } else if(!isFrozen){
            policy_.status = PolicyStatus.Pending;
        }
        
        if (policy_.status != PolicyStatus.Approved) {
            revert InsurancePolicy_NotApproved();
        }
    }
}
