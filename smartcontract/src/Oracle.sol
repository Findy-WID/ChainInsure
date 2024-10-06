// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.26;

import {AggregatorV3Interface} from "@chainlink-contracts/interfaces/AggregatorV3Interface.sol";
import {VRFConsumerBase} from "@chainlink-contracts/VRFConsumerBase.sol";

contract Oracle {

    AggregatorV3Interface internal s_priceFeed;
    uint256 private constant THRESHOLD = 2000 * 10 ** 8;

    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 public randomResult;

    // 

    event PriceCrashDetected(uint256 price, bool crash);

    constructor(address _priceFeed) {
        s_priceFeed = AggregatorV3Interface(_priceFeed);
    }
    function  checkForPriceCrash() public  returns(bool){
        int256 latestPrice = getLatestPrice();
        bool crashDetected = latestPrice <= int256(THRESHOLD);

        if (crashDetected){
            emit PriceCrashDetected(uint256(latestPrice), true);
        }else {
            emit PriceCrashDetected(uint256(latestPrice), false);
        }

        return crashDetected;
    }

    function getLatestPrice() public view returns (int256){
        (, int256 price, , ,) = s_priceFeed.latestRoundData();
        return price;
    }
}