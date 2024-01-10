// SPDX-License-Identifier: MIT 

pragma solidity 0.8.23;

library types{
    enum accessType {local,national,international}

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