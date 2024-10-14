// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract WETH9 is ERC20{

    // string public name = "Wrapped Ether";
    // string public symbol = "WETH";
    // uint8 public decimals = 18;

    // event Approval(address indexed src, address indexed guy, uint256 wad);
    // event Transfer(address indexed src, address indexed dst, uint256 wad);
    event Deposit(address indexed dst, uint256 wad);
    event Withdrawal(address indexed src, uint256 wad);

    // mapping(address => uint256) public balanceOf;
    // mapping(address => mapping(address => uint256)) public allowance;


    // Receive ETH and wrap it
    receive() external payable {
        deposit();
    }

    constructor() ERC20("Wrapped Ether", "WETH"){}

    function deposit() public payable {
        _mint(msg.sender, msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function mint(address addr_, uint256 value_) public {
        _mint(addr_, value_);
    }

    function withdraw(uint256 wad) public {
        require(balanceOf(msg.sender)>= wad, "Insufficient balance");
        _burn(msg.sender, wad);
        payable(msg.sender).transfer(wad);
        emit Withdrawal(msg.sender, wad);
    }
}
