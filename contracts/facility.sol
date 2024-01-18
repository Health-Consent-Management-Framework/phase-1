// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.21;

import {Utils} from "./lib.sol";

contract Facility {
    Utils.accessType public defaultAccessType = Utils.accessType.local;
    // mapping(address => Utils.Worker) public workers;
    mapping(string => Utils.Facility) public facilityData;
    //check mapping to store only address if possible
    // Facility[] facilityData;
    //send faciltydata to new contract facilityregister
    function createFacility(string memory facilityName,string memory state,string memory district,string memory street,Utils.accessType facilityType) external returns(bool){
        require(bytes(facilityName).length > 0, "name cannot be empty");
        require(bytes(state).length > 0, "state cannot be empty");
        require(bytes(district).length > 0, "state cannot be empty");
        require(bytes(street).length>0 , "street must be given");
        string memory randomIdentifer = Utils.generateRandomString(4);
        Utils.Location memory facilityLocation = Utils.Location(state, district, street);
        string memory facilityId = string(abi.encodePacked(facilityName,state,Utils.substring(street,0,4),'-',randomIdentifer));
        Utils.Facility memory newFacility = Utils.Facility(facilityId,facilityName, facilityLocation, facilityType);
        // facilityData.push(newFacility);
        facilityData[facilityId] = newFacility;
        return true;
    }

    function getLocation(string calldata facilityId) public view returns(Utils.Location memory){
        return facilityData[facilityId].location;
    }

    // function getWorkers(string calldata facilityId) public view returns(Utils.Worker[] memory){
    //     return facilityData[facilityId].facilityWorkers;
    // }

    function getFacilty(string memory facilityId) internal view returns(Utils.Facility memory){
        // for (uint256 i = 0; i < facilityData.length; i++) {
        //     if (keccak256(abi.encodePacked(facilityId)) == keccak256(abi.encodePacked(facilityData[i].id))) {
        //         return i;
        //     }
        // }
        // revert("Facility not found");
        return facilityData[facilityId];
    }

    function editFacility(string calldata facilityId) public returns(Utils.Facility memory){
        // good way of editing parameters even one or two are null
    }

    function removeFacility(string memory facilityId) public returns(bool){
        // bool found = false;
        // for (uint256 i = 0; i < facilityData.length-1; i++) {
        //     if (keccak256(abi.encodePacked(facilityId)) == keccak256(abi.encodePacked(facilityData[i].id));) found = true;
        //     if(found){
        //         facilityData[i] = facilityData[i+1]
        //     }
        // }
        // delete facilityData[facilityId];
        require(bytes(facilityData[facilityId].facilityId).length!=0, "Facility not found");
        facilityData[facilityId].name = "";
        facilityData[facilityId].facilityId = "";
        facilityData[facilityId].location = Utils.Location("", "", "");
        facilityData[facilityId].facilityType = Utils.accessType.local;
        // facilityData[facilityId].facilityWorkers = new Utils.Worker[](0);
        return true;
    }


    // function updateWorkers(string calldata facilityId,Utils.Worker[] memory workers) public returns(Utils.Worker[] memory){
    //     facilityData[facilityId].facilityWorkers = workers;
    //     return facilityData[facilityId].facilityWorkers;
    // }
}