// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Ownable{
    address public owner;
    
    constructor(){
        owner = msg.sender;
    }

    modifier isOwner(){
        require(msg.sender== owner, "User doesn't own this data");
        _;
    }
}