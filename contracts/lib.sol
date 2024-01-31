// SPDX-License-Identifier: MIT 
//lib.sol

pragma solidity ^0.8.21;

library Utils{
    enum accessType {local,national,international}

    struct Location{
        string state;
        string district;
        string street;
    }

    struct Worker{
        string name;
        string workerId;
        string designation;
        string imageLink;
    }
    
    struct Facility{
        string facilityName;
        string facilityId;
        Location location;
        accessType facilityType;
        // Worker[] facilityWorkers;
        // string[] services;
    }

    struct Patient{
        address walletId;
        string fname;
        string lname;
        string aadharId;
        Location residence;
    }

    struct EHR{
        address claimId;
        string date;
        address[] doctor;
        address patient;
        string[] IdentifiedProblems;
        string[] symptops;
    }

    struct Doctor{
        address doctorId;
        string fname;
        string lname;
        string designation;
        string profilePic;
        string uniqueId;
    }
        
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

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(40);
        for (uint i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2**(8*(19 - i)))));
            bytes1 hi = bytes1(uint8(b) / 16);
            bytes1 lo = bytes1(uint8(b) - 16 * uint8(hi));
            s[2*i] = char(hi);
            s[2*i+1] = char(lo);            
        }
        return string(s);
    }

    function char(bytes1 b) internal pure returns (bytes1 c) {
        if (uint8(b) < 10) return bytes1(uint8(b) + 0x30);
        else return bytes1(uint8(b) + 0x57);       
    }

    function compareString(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }


}