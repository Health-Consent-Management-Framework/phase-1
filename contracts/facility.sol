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
        Location location;
        accessType FacilityType;
        Worker[] facilityWorkers;
    }

    string private id;
    string public name;
    Location public location;
    enum accessType {local,national,international}
    accessType public defaultAccessType = accessType.local;
    Facility[] public facilityData;
    //check mapping to store only address if possible
    mapping(address => Worker) public workers;

    constructor(){
        string memory randomIdentifer = generateRandomString(4);
        string memory tempName = string(abi.encodePacked(name,location.state,substring(location.street,0,4),'-',randomIdentifer));
        id = tempName;
    }

    function createFacility(string memory facilityName,string memory state,string memory district,string memory street,accessType facilityType) external returns(bool){
        require(bytes(facilityName).length > 0, "name cannot be empty");
        require(bytes(state).length > 0, "state cannot be empty");
        require(bytes(district).length > 0, "state cannot be empty");
        require(bytes(street).length>0 , "street must be given");
        Location memory facilityLocation = Location(state, district, street);
        Facility memory newFacility = Facility(facilityName, facilityLocation, facilityType, new Worker[](0));
        facilityData.push(newFacility);
        return true;
    }

    function getLocation() public view returns(Location memory){
        return location;
    }

    function getWorkers(string calldata facilityId) public view returns(Worker[] memory){

    }

    function editFacility(string calldata facilityId,) public returns(Facility memory){
        // good way of editing parameters even one or two are null
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

}