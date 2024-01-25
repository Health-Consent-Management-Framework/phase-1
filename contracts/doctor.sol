// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import {Ownable} from "./owner.sol";
import {Utils} from "./lib.sol";

contract Doctor is Ownable{
    constructor(){
        super;
    }   

    event doctorCreated();
    event doctorUpdated();
    event doctorRemoved();

    function editDoctor() public isOwner returns (bool){
    
    }
    
    function deleteDoctor() public isOwner returns (bool){

    }

    function sendReportRequest() public isOwner returns (bool){

    }
}