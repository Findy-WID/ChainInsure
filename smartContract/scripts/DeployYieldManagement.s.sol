// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {Script} from "../lib/forge-std/src/Script.sol";
import {YieldManager} from "../contracts/YieldManager.sol";

/// @title Script to deploy YieldManager contract
contract DeployYieldManager is Script {
    struct YieldManagerArgs {
        address managerContract;
        address poolAddress;
        address paymentTokenAddress;
    }
    YieldManagerArgs public args;
    YieldManager public yieldManager;

    function run() external returns (YieldManager) {
        vm.startBroadcast();
        yieldManager = new YieldManager(
            args.managerContract,
            args.poolAddress,
            args.paymentTokenAddress
        );
        vm.stopBroadcast();
        return yieldManager;
    }

    function setConstructorArgs(YieldManagerArgs calldata args_) external {
        args = args_;
    }
}