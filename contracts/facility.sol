// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import {Utils} from "./lib.sol";
import {Admin} from "./admin.sol";
import {Doctor} from './doctor.sol';

contract Facility {
    Admin public adminContract;
    Doctor public doctorContract;
    Utils.accessType public defaultAccessType = Utils.accessType.local;
    mapping(string => Utils.Facility) public facilityRegister;
    string[] facilityIds;

    event FacilityCreated(uint256 patientId,string message);
    event FacilityUpdated(uint256 patientId,string message);
    event PatientRemoved(uint256 patientId,string message);

    modifier isAdmin() {
        require(adminContract.adminAddresses(msg.sender), "Only admin can access the feature");
        _;
    }


    // mapping(address => Utils.Worker) public workers;
    function createFacility(string memory facilityName,string memory state,string memory district,string memory street,string memory pincode,Utils.accessType facilityType) public isAdmin returns(bool){
        require(bytes(facilityName).length > 0, "name cannot be empty");
        require(bytes(state).length > 0, "state cannot be empty");
        require(bytes(district).length > 0, "state cannot be empty");
        require(bytes(street).length>0 , "street must be given");
        require(bytes(pincode).length>0 , "street must be given");
        string memory randomIdentifer = Utils.generateRandomString(4);
        Utils.Location memory facilityLocation = Utils.Location(state, district, street);
        string memory facilityId = string(abi.encodePacked(facilityName,state,Utils.substring(street,0,4),'-',randomIdentifer));
        Utils.Facility memory newFacility = Utils.Facility(facilityId,facilityName, facilityLocation, facilityType);
        // facilityRegister.push(newFacility);
        facilityRegister[facilityId] = newFacility;
        facilityIds.push(facilityId);
        return true;
    }

    function getLocation(string calldata facilityId) public view returns(Utils.Location memory){
        return facilityRegister[facilityId].location;
    }

    // function getWorkers(string calldata facilityId) public view returns(Utils.Worker[] memory){
    //     return facilityRegister[facilityId].facilityWorkers;
    // }

    function getFacilty(string memory facilityId) internal view returns(Utils.Facility memory){
        // for (uint256 i = 0; i < facilityRegister.length; i++) {
        //     if (keccak256(abi.encodePacked(facilityId)) == keccak256(abi.encodePacked(facilityRegister[i].id))) {
        //         return i;
        //     }
        // }
        // revert("Facility not found");
        return facilityRegister[facilityId];
    }

    function editFacility(string calldata facilityId) public isAdmin returns(Utils.Facility memory){
        // good way of editing parameters even one or two are null
    }

    function removeFacility(string memory facilityId) public returns(bool){
        // bool found = false;
        // for (uint256 i = 0; i < facilityRegister.length-1; i++) {
        //     if (keccak256(abi.encodePacked(facilityId)) == keccak256(abi.encodePacked(facilityRegister[i].id));) found = true;
        //     if(found){
        //         facilityRegister[i] = facilityRegister[i+1]
        //     }
        // }
        // delete facilityRegister[facilityId];
        require(bytes(facilityRegister[facilityId].facilityId).length!=0, "Facility not found");
        facilityRegister[facilityId].facilityName = "";
        facilityRegister[facilityId].facilityId = "";
        facilityRegister[facilityId].location = Utils.Location("", "", "");
        facilityRegister[facilityId].facilityType = Utils.accessType.local;
        // facilityRegister[facilityId].facilityWorkers = new Utils.Worker[](0);
        return true;
    }

        function getFacilities() public view returns (Utils.Facility[] memory) {
            uint256 length = facilityIds.length;

            Utils.Facility[] memory facilites = new Utils.Facility[](length);

            for (uint256 i = 0; i < length; i++) {
                facilites[i] = facilityRegister[facilityIds[i]];
            }

            return facilites;
    }

    // function updateWorkers(string calldata facilityId,Utils.Worker[] memory workers) public returns(Utils.Worker[] memory){
    //     facilityRegister[facilityId].facilityWorkers = workers;
    //     return facilityRegister[facilityId].facilityWorkers;
    // }
}

