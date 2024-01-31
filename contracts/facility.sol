// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.21;

import "./lib.sol";
import {Admin} from "./admin.sol";

contract Facility {
    address public adminContractAddress;
    mapping(string => FacilityType) public facilityRegister;
    string[] facilityIds;

    constructor(address _adminContractAddress){
        adminContractAddress = _adminContractAddress; 
    }

    event FacilityCreated(uint256 patientId,string message);
    event FacilityUpdated(uint256 patientId,string message);
    event PatientRemoved(uint256 patientId,string message);

    enum accessType {local,national,international}

    struct Location{
        string state;
        string district;
        string street;
    }
    
    struct FacilityType{
        string facilityName;
        string facilityId;
        Location location;
        accessType facilityType;
        // Worker[] facilityWorkers;
        // string[] services;
    }

    modifier isAdmin() {
        Admin adminContract = Admin(adminContractAddress);
        require(adminContract.checkIfAdmin(msg.sender), "Only admin can access the feature");
        _;
    }


    function createFacility(string memory facilityName,string memory state,string memory district,string memory street,string memory pincode,accessType facilityType) public returns(bool){
        require(bytes(facilityName).length > 0, "name cannot be empty");
        require(bytes(state).length > 0, "state cannot be empty");
        require(bytes(district).length > 0, "state cannot be empty");
        require(bytes(street).length>0 , "street must be given");
        require(bytes(pincode).length>0 , "street must be given");
        string memory randomIdentifer = generateRandomString(4);
        Location memory facilityLocation = Location(state, district, street);
        string memory facilityId = string(abi.encodePacked(facilityName,state,substring(street,0,4),'-',randomIdentifer));
        FacilityType memory newFacility = FacilityType(facilityName,facilityId,facilityLocation,facilityType);
        facilityRegister[facilityId] = newFacility;
        facilityIds.push(facilityId);
        return true;
    }

    function getLocation(string calldata facilityId) public view returns(Location memory){
        return facilityRegister[facilityId].location;
    }

    // function getWorkers(string calldata facilityId) public view returns(Worker[] memory){
    //     return facilityRegister[facilityId].facilityWorkers;
    // }

    function getFacilty(string memory facilityId) internal view returns(FacilityType memory){
        return facilityRegister[facilityId];
    }

    function editFacility(string memory facilityId) public view isAdmin returns(bool){
        require(bytes(facilityId).length>0,"no facility id");
        return false;
        // good way of editing parameters even one or two are null
    }

    function removeFacility(string memory facilityId) public returns(bool){
        require(bytes(facilityRegister[facilityId].facilityId).length!=0, "Facility not found");
        facilityRegister[facilityId].facilityName = "";
        facilityRegister[facilityId].facilityId = "";
        facilityRegister[facilityId].location = Location("", "", "");
        facilityRegister[facilityId].facilityType = accessType.local;
        // facilityRegister[facilityId].facilityWorkers = new Worker[](0);
        return true;
    }

        function getFacilities() public view returns (FacilityType[] memory) {
            uint256 length = facilityIds.length;

            FacilityType[] memory facilites = new FacilityType[](length);

            for (uint256 i = 0; i < length; i++) {
                facilites[i] = facilityRegister[facilityIds[i]];
            }

            return facilites;
    }

    // function updateWorkers(string calldata facilityId,Worker[] memory workers) public returns(Worker[] memory){
    //     facilityRegister[facilityId].facilityWorkers = workers;
    //     return facilityRegister[facilityId].facilityWorkers;
    // }

        function generateRandomString(uint256 length) public view returns (string memory) {
        bytes memory characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        bytes memory randomString = new bytes(length);

        for (uint256 i = 0; i < length; i++) {
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, i))) % characters.length;
            randomString[i] = characters[rand];
        }
        return string(randomString);
    }

    function substring(string memory str, uint startIndex, uint endIndex) public pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }
}

