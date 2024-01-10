// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.23;

contract FacilityContract {
    struct Location{
        string state;
        string district;
        string street;
    }

    struct Worker{
        string name;
        string designation;
        string imageLink;
    }
    
    struct Facility{
        string name;
        string facilityId;
        Location location;
        accessType facilityType;
        Worker[] facilityWorkers;
    }

    enum accessType {local,national,international}
    accessType public defaultAccessType = accessType.local;
    //check mapping to store only address if possible
    mapping(address => Worker) public workers;
    // Facility[] facilityData;
    mapping(string=>Facility) public facilityData;
    //send faciltydata to new contract facilityregister
    function createFacility(string memory facilityName,string memory state,string memory district,string memory street,accessType facilityType) external returns(bool){
        require(bytes(facilityName).length > 0, "name cannot be empty");
        require(bytes(state).length > 0, "state cannot be empty");
        require(bytes(district).length > 0, "state cannot be empty");
        require(bytes(street).length>0 , "street must be given");
        string memory randomIdentifer = generateRandomString(4);
        Location memory facilityLocation = Location(state, district, street);
        string memory facilityId = string(abi.encodePacked(facilityName,state,substring(street,0,4),'-',randomIdentifer));
        Facility memory newFacility = Facility(facilityId,facilityName, facilityLocation, facilityType, new Worker[](0));
        // facilityData.push(newFacility);
        facilityData[facilityId] = newFacility;
        return true;
    }

    function getLocation(string calldata facilityId) public view returns(Location memory){
        return facilityData[facilityId].location;
    }

    function getWorkers(string calldata facilityId) public view returns(Worker[] memory){
        return facilityData[facilityId].facilityWorkers;
    }

    function getFacilty(string memory facilityId) internal view returns(Facility memory){
        // for (uint256 i = 0; i < facilityData.length; i++) {
        //     if (keccak256(abi.encodePacked(facilityId)) == keccak256(abi.encodePacked(facilityData[i].id))) {
        //         return i;
        //     }
        // }
        // revert("Facility not found");
        return facilityData[facilityId];
    }

    function editFacility(string calldata facilityId) public returns(Facility memory){
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
        facilityData[facilityId].location = Location("", "", "");
        facilityData[facilityId].facilityType = accessType.local;
        facilityData[facilityId].facilityWorkers = new Worker[](0);
        return true;
    }

    function generateRandomString(uint256 length) private view returns (string memory) {
        bytes memory characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        bytes memory randomString = new bytes(length);

        for (uint256 i = 0; i < length; i++) {
            uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, i))) % characters.length;
            randomString[i] = characters[rand];
        }
        return string(randomString);
    }

    function substring(string memory str, uint startIndex, uint endIndex) private pure returns (string memory) {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex-startIndex);
        for(uint i = startIndex; i < endIndex; i++) {
            result[i-startIndex] = strBytes[i];
        }
        return string(result);
    }

    function updateWorkers(string calldata facilityId,Worker[] memory workers) public returns(Worker[] memory){
        facilityData[facilityId].facilityWorkers = workers;
        return facilityData[facilityId].facilityWorkers;
    }
}