// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {Manager} from "../contracts/Manager.sol";
import {SecuredVault} from "../contracts/SecuredVault.sol";

contract ManagerTest is Test {
    address owner = makeAddr("owner");
    address user = makeAddr("user");

    uint256 constant INITIAL_FUNDS = 21 ether;

    Manager s_manager;

    // modifier onlyOwner() {
    //     if(msg.sender != owner){
    //         revert SecuredVault_OnlyOwner();
    //     }
    //     _;
    // }
    function setUp() public {
        s_manager = new Manager();
        deal(owner, INITIAL_FUNDS);
        // deal(owner, INITIAL_FUNDS);
    }

    function testCreateVault() public {
        vm.startPrank(owner);
        s_manager.createVault(owner, 10 ether, "test");
        s_manager.createVault(user, 10 ether, "test");
        SecuredVault securedVault1 = s_manager.getVaultAddress(owner);
        SecuredVault securedVault2 = s_manager.getVaultAddress(user);

        (bool success,) = address(securedVault1).call{value: 5 ether}("");
        (success,) = payable(securedVault2).call{value: 3 ether}("");
        assert(securedVault1.getBalance() == 5 ether);
        assert(securedVault2.getBalance() == 3 ether);
        vm.stopPrank();
    }

    function testWithdrawal() public {
        vm.startPrank(owner);
        s_manager.createVault(owner, 10 ether, "test");
        SecuredVault securedVault1 = s_manager.getVaultAddress(owner);
        (bool success,) = address(securedVault1).call{value: INITIAL_FUNDS}("");

        assertTrue(success);
        assert(securedVault1.getBalance() == INITIAL_FUNDS);

        securedVault1.sendFunds(payable(user), 5 ether);
        // console.log(securedVault1.getBalance());
        // console.log(user.balance);
        // assert(securedVault1.getBalance() == 0);

        assertTrue(success);
        // console.log(address(s_manager.getVaultAddress(owner)));

        vm.stopPrank();
    }
}
