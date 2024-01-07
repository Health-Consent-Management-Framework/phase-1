// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

contract Hello{
    string public name = "hello";
    function getContractName() public view returns (string memory) {
        return name;
    }
}

