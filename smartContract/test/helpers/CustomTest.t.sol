// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CustomTest {
    uint256 public counter = 1;

    function getCounterAndIncrement() public returns (uint256) {
        uint256 currentCounter = counter;
        counter += 1;
        return currentCounter;
    }
}
