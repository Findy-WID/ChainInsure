// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {console} from "../../lib/forge-std/src/Test.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {DataTypes} from "@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol";
import {SampleERC20} from "../mocks/SampleERC20.sol";

contract MockPool {
    struct Reserve {
        uint256 liquidity;
        address aTokenAddress; // Address of the corresponding aToken for this asset
    }

    mapping(address => Reserve) public reserves;

    constructor(address[] memory assets, address[] memory aTokens) {
        for (uint i = 0; i < assets.length; i++) {
            reserves[assets[i]] = Reserve({
                liquidity: 0,
                aTokenAddress: aTokens[i]
            });
        }
    }

    function deposit(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        reserves[asset].liquidity += amount;
        // Optionally simulate aToken credit to onBehalfOf account
        SampleERC20(reserves[asset].aTokenAddress).mint(onBehalfOf, amount);
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(reserves[asset].liquidity >= amount, "Insufficient liquidity");
        reserves[asset].liquidity -= amount;
        SampleERC20(reserves[asset].aTokenAddress).burn(msg.sender, amount);
        IERC20(asset).transfer(to, amount);
        return amount;
    }

    function getReserveData(
        address asset
    ) external view returns (DataTypes.ReserveData memory data) {
        data.aTokenAddress = reserves[asset].aTokenAddress;
    }
}