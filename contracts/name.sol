// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract NameStorage {
    // Array to store names
    string[] public names;

    // Function to add a name to the array
    function addName(string memory newName) public {
        names.push(newName);
    }

    // Function to retrieve the total number of names stored
    function getNamesCount() public view returns (uint256) {
        return names.length;
    }

    // Function to retrieve a specific name by index
    function getNameByIndex(uint256 index) public view returns (string memory) {
        require(index < names.length, "Index out of bounds");
        return names[index];
    }

    function getAllNames() public view returns (string[] memory) {
        return names;
    }
}
