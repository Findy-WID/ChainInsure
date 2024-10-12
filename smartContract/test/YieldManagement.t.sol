// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {CustomTest} from "./helpers/CustomTest.t.sol";
import {Test, console} from "forge-std/Test.sol";

import {DeployYieldManager} from "../scripts/DeployYieldManagement.s.sol";
import {InsuranceManager} from "../contracts/InsurancePolicy.sol";
import {MockPool} from "../contracts/mocks/MockPool.sol";
import {SampleERC20} from "../../contracts/mocks/SampleERC20.sol";
import {YieldManager} from "../../contracts/YieldManager.sol";

contract YieldManagerTest is Test, CustomTest {
    DeployYieldManager.YieldManagerArgs public args;
    DeployYieldManager public deployYieldManager;
    YieldManager public yieldManager;
    MockPool public mockPool;
    SampleERC20 public mockToken;
    SampleERC20 public mockAToken;

    function setUp() external {
        address[] memory tokens = new address[](1);
        address[] memory aTokens = new address[](1);

        mockToken = new SampleERC20();
        mockAToken = new SampleERC20();

        tokens[0] = address(mockToken);
        aTokens[0] = address(mockAToken);

        mockPool = new MockPool(tokens, aTokens);

        deployYieldManager = new DeployYieldManager();

        address _managerContract = vm.addr(getCounterAndIncrement());
        args = DeployYieldManager.YieldManagerArgs({
            managerContract: _managerContract,
            poolAddress: address(mockPool),
            paymentTokenAddress: address(mockToken)
        });
        deployYieldManager.setConstructorArgs(args);
        yieldManager = deployYieldManager.run();
    }

    function test_deploymentParams() public view {
        assertEq(address(yieldManager.pool()), address(mockPool));
        assertEq(address(yieldManager.paymentToken()), address(mockToken));
        assertEq(address(yieldManager.aTokenAddress()), address(mockAToken));
        assertEq(yieldManager.managerContract(), args.managerContract);
    }

    function test_deposit_success(uint256 amount_) public {
        mockToken.mint(args.managerContract, amount_);

        vm.startPrank(args.managerContract);
        mockToken.transfer(address(yieldManager), amount_);
        yieldManager.deposit(amount_);
        vm.stopPrank();

        // all tokens deposited into pool
        assertEq(
            mockToken.balanceOf(address(yieldManager)),
            0,
            "mismatch token balance"
        );
        assertEq(
            mockToken.balanceOf(address(mockPool)),
            amount_,
            "mismatch pool token balance"
        );
        // aTokens minted to manager contract
        assertEq(
            mockAToken.balanceOf(address(yieldManager)),
            amount_,
            "mismatch aToken balance"
        );
        assertEq(
            yieldManager.getAvailableBalance(),
            amount_,
            "mismatch available balance"
        );
    }

    function test_deposit_fail(
        uint256 amount_,
        address nonManagerContract_
    ) public {
        vm.assume(nonManagerContract_ != args.managerContract);
        vm.startPrank(nonManagerContract_);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessControl.AccessControlUnauthorizedAccount.selector,
                nonManagerContract_,
                yieldManager.MANAGER_CONTRACT()
            )
        );
        yieldManager.deposit(amount_);
        vm.stopPrank();
    }

    function test_withdraw_success(uint256 amount_) public {
        address _recipient = vm.addr(getCounterAndIncrement());
        mockToken.mint(args.managerContract, amount_);

        vm.startPrank(args.managerContract);
        mockToken.transfer(address(yieldManager), amount_);
        yieldManager.deposit(amount_);

        yieldManager.withdraw(amount_, _recipient);
        vm.stopPrank();

        assertEq(
            mockToken.balanceOf(_recipient),
            amount_,
            "mismatch recipient balance"
        );
        assertEq(yieldManager.getAvailableBalance(), 0);
    }

    function test_withdraw_fail(
        uint256 amount_,
        address nonManagerContract_
    ) public {
        vm.assume(nonManagerContract_ != args.managerContract);
        address _recipient = vm.addr(getCounterAndIncrement());
        mockToken.mint(args.managerContract, amount_);

        vm.startPrank(args.managerContract);
        mockToken.transfer(address(yieldManager), amount_);
        yieldManager.deposit(amount_);
        vm.stopPrank();

        vm.startPrank(args.managerContract);
        yieldManager.withdraw(amount_, _recipient);
        vm.stopPrank();
    }

    function test_getATokenAddress() public view {
        assertEq(
            yieldManager.getATokenAddress(address(mockToken)),
            address(mockAToken)
        );
    }
}