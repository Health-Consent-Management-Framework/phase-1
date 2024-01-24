//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.21;
import {Admin} from "./admin.sol";
import {Doctor} from "./doctor.sol";
import {Utils} from "./lib.sol";


contract DoctorsRecord{
    Admin adminContract;
    mapping(address=>Doctor) records;
    uint totalDoctors = 0;

    modifier isAdmin() {
        require(adminContract.adminAddresses(msg.sender), "Only admin can access the feature");
        _;
    }


    function addDoctorRecord(Doctor doctor) public isAdmin returns(bool){
        records[address(doctor)] = doctor; 
        totalDoctors += 1;
    }

    function getDoctorRecord() public view returns(Doctor) {

    }

    function editDoctorRecord() public returns(bool) {

    }
}