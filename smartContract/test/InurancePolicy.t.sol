// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.24;

// import "forge-std/Test.sol";
// import {Manager} from "../contracts/Manager.sol";
// import {SecuredVault} from "../contracts/SecuredVault.sol";
// import {InsuranceManager} from "../contracts/InsurancePolicy.sol"; // Corrected import for InsuranceManager
// // import {MockPool} from "../contracts/mocks/MockPool.sol";
// import {SampleERC20} from "../contracts/mocks/SampleERC20.sol"; // Adjusted path for SampleERC20
// import {YieldManager} from "../contracts/YieldManager.sol";

// import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// // Mock ERC20 token for testing payments
// contract MockERC20 is IERC20 {
//     string public name = "Mock Token";
//     string public symbol = "MCK";
//     uint8 public decimals = 18;
//     uint256 public totalSupply;
//     mapping(address => uint256) public balanceOf;
//     mapping(address => mapping(address => uint256)) public allowance;

//     function transfer(address to, uint256 amount) external override returns (bool) {
//         balanceOf[msg.sender] -= amount;
//         balanceOf[to] += amount;
//         return true;
//     }

//     function approve(address spender, uint256 amount) external override returns (bool) {
//         allowance[msg.sender][spender] = amount;
//         return true;
//     }

//     function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
//         allowance[from][msg.sender] -= amount;
//         balanceOf[from] -= amount;
//         balanceOf[to] += amount;
//         return true;
//     }

//     function mint(address to, uint256 amount) external {
//         balanceOf[to] += amount;
//         totalSupply += amount;
//     }
// }

// contract InsuranceManagerTest is Test {
//     InsuranceManager insuranceManager;
//     MockERC20 mockToken;
//     YieldManager yieldManager;
//     SecuredVault securedVault;
//     Manager manager;

//     address user = address(0x123);
//     uint256 initialBalance = 1e24; // 1 million tokens

//     function setUp() public {
//         // Deploy the mock token and mint tokens to the user
//         mockToken = new MockERC20();
//         mockToken.mint(user, initialBalance);

//         // Deploy YieldManager, SecuredVault, and Manager contracts
//         yieldManager = new YieldManager(address(this), address(yieldManager), address(mockToken));
//         securedVault = new SecuredVault(address(this), 10 ether, "test");
//         manager = new Manager();

//         // Deploy the InsuranceManager contract
//         insuranceManager = new InsuranceManager(address(mockToken), address(yieldManager));
        
//         // Simulate setting the manager contract
//         insuranceManager.setManager(manager);
//     }

//     function testCreatePolicy() public {
//         vm.startPrank(user); // Simulate user interaction
//         mockToken.approve(address(insuranceManager), 100 ether);

//         uint256 policyId = insuranceManager.createPolicy(100 ether, 10 ether, 30);
//         InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);

//         assertEq(policy.id, policyId);
//         assertEq(policy.owner, user);
//         assertEq(policy.coverageAmount, 100 ether);
//         assertEq(policy.premium, 10 ether);
//         assertTrue(policy.active);
//         assertEq(uint(policy.status), uint(InsuranceManager.PolicyStatus.Pending));

//         vm.stopPrank();
//     }

//     function testCancelPolicy() public {
//         vm.startPrank(user);
//         mockToken.approve(address(insuranceManager), 100 ether);
//         insuranceManager.createPolicy(100 ether, 10 ether, 30);

//         insuranceManager.cancelPolicy();
//         InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);

//         assertFalse(policy.active);
//         assertEq(uint(policy.status), uint(InsuranceManager.PolicyStatus.Rejected));
//         vm.stopPrank();
//     }

//     function testClaimPolicy() public {
//         vm.startPrank(user);
//         mockToken.approve(address(insuranceManager), 100 ether);
//         insuranceManager.createPolicy(100 ether, 10 ether, 30);

//         // Simulate approval
//         vm.prank(address(this)); // Simulate as manager or owner
//         insuranceManager.approvePolicy(user);

//         // Claim the policy
//         insuranceManager.claimPolicy();
//         InsuranceManager.Policy memory policy = insuranceManager.getPolicy(user);

//         assertEq(uint(policy.status), uint(InsuranceManager.PolicyStatus.Claimed));
//         vm.stopPrank();
//     }

//     function testFailClaimWithoutApproval() public {
//         vm.startPrank(user);
//         mockToken.approve(address(insuranceManager), 100 ether);
//         insuranceManager.createPolicy(100 ether, 10 ether, 30);

//         // Attempt to claim without approval should fail
//         vm.expectRevert(InsuranceManager.InsurancePolicy_NotApproved.selector);
//         insuranceManager.claimPolicy();
//         vm.stopPrank();
//     }

//     function testFailCreatePolicyWithInvalidCoverage() public {
//         vm.startPrank(user);

//         // Attempt to create policy with coverage below minimum
//         vm.expectRevert(InsuranceManager.InsurancePolicy_InvalidValue.selector);
//         insuranceManager.createPolicy(0.5 ether, 1 ether, 30);

//         vm.stopPrank();
//     }
// }
