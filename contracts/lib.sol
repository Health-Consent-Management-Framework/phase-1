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
}