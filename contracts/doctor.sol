// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;
contract Doctor{
    address owner;

    constructor(){
        owner = msg.sender;
    }

    modifier isOwner(){
        require(msg.sender== owner, "User doesn't own this data");
        _;
    }

    event doctorCreated();
    event doctorUpdated();
    event doctorRemoved();

    function editDoctor() public isOwner returns (bool){
    
    }
    
    function deleteDoctor() public isOwner returns (bool){

    }

}